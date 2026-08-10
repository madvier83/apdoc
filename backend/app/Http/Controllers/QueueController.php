<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Queue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Throwable;

class QueueController extends Controller
{
    public function index($clinic)
    {
        try {
            $queue = Queue::whereDate('created_at', Carbon::today())
                ->whereIn('status_id', [1, 2])
                ->with([
                    'patient.province',
                    'patient.city',
                    'patient.district',
                    'patient.village',
                    'queueDetails',
                    'queueDetails.employee.province',
                    'queueDetails.employee.city',
                    'queueDetails.employee.district',
                    'queueDetails.employee.village',
                    'queueDetails.service'
                ])
                ->where('clinic_id', $clinic)
                ->get();

            return response()->json($queue);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function indexPrediction($clinic)
    {
        try {
            $queue = Queue::with([
                'patient.province',
                'patient.city',
                'patient.district',
                'patient.village',
                'queueDetails',
                'queueDetails.employee.province',
                'queueDetails.employee.city',
                'queueDetails.employee.district',
                'queueDetails.employee.village',
                'queueDetails.service'
            ])
                ->where('clinic_id', $clinic)
                ->orderBy('created_at')
                ->get();

            return response()->json($queue);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show($id)
    {
        //
    }

    /**
     * Membuat antrean baru.
     *
     * prediction_time dihitung berdasarkan:
     * jumlah pasien yang berada di depan + regresi linear
     * terhadap data historis durasi pelayanan.
     */
    public function create(Request $request, $patient)
    {
        $clinicId = $request->clinic_id
            ?? auth()->user()->employee->clinic_id;

        $queue = Queue::whereDate('created_at', Carbon::today())
            ->where('patient_id', $patient)
            ->where('status_id', 1)
            ->where('clinic_id', $clinicId)
            ->first();

        if ($queue) {
            return response()->json([
                'message' => 'Patient already in queue'
            ], 400);
        }

        try {
            /*
             * Menghitung nomor antrean.
             */
            $queueNumber = Queue::whereDate('created_at', Carbon::today())
                ->where('clinic_id', $clinicId)
                ->count() + 1;

            /*
             * Jumlah pasien yang masih berada di depan.
             */
            $patientsAhead = Queue::whereDate('created_at', Carbon::today())
                ->where('clinic_id', $clinicId)
                ->whereIn('status_id', [1, 2])
                ->count();

            /*
             * Menghitung estimasi waktu tunggu.
             */
            $predictionTime = $this->calculatePrediction(
                $clinicId,
                $patientsAhead
            );

            $data = [
                'clinic_id' => $clinicId,
                'patient_id' => $patient,
                'queue_number' => 'A' . $queueNumber,
                'status_id' => 1,

                // Dalam satuan menit
                'prediction_time' => $predictionTime,

                // Belum selesai dilayani
                'actual_time' => null,
            ];

            $queue = Queue::create($data);

            return response()->json($queue);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function createFromAppointment(Request $request, $appointment)
    {
        $appoint = Appointment::find($appointment);

        if (!$appoint) {
            return response()->json([
                'message' => 'Appointment not found!'
            ], 404);
        }

        $clinicId = $request->clinic_id
            ?? auth()->user()->employee->clinic_id;

        $queue = Queue::whereDate('created_at', Carbon::today())
            ->where('patient_id', $appoint->patient_id)
            ->where('status_id', 1)
            ->where('clinic_id', $clinicId)
            ->first();

        if ($queue) {
            return response()->json([
                'message' => 'Patient already in queue'
            ], 400);
        }

        try {
            $queueNumber = Queue::whereDate('created_at', Carbon::today())
                ->where('clinic_id', $clinicId)
                ->count() + 1;

            /*
             * Jumlah pasien yang berada di depan.
             */
            $patientsAhead = Queue::whereDate('created_at', Carbon::today())
                ->where('clinic_id', $clinicId)
                ->whereIn('status_id', [1, 2])
                ->count();

            /*
             * Prediksi waktu tunggu.
             */
            $predictionTime = $this->calculatePrediction(
                $clinicId,
                $patientsAhead
            );

            $data = [
                'clinic_id' => $clinicId,
                'patient_id' => $appoint->patient_id,
                'queue_number' => 'B' . $queueNumber,
                'status_id' => 1,
                'prediction_time' => $predictionTime,
                'actual_time' => null,
            ];

            $queue = Queue::create($data);

            $appoint->fill([
                'status_id' => 2
            ]);

            $appoint->save();

            return response()->json($queue);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Mengubah status antrean.
     *
     * Jika status menjadi 3 (selesai),
     * actual_time dihitung dari created_at sampai waktu selesai.
     */
    public function update($id, $status)
    {
        $queue = Queue::find($id);

        if (!$queue) {
            return response()->json([
                'message' => 'Queue not found!'
            ], 404);
        }

        try {
            $appointment = Appointment::where('patient_id', $queue->patient_id)
                ->where('status_id', 2)
                ->first();

            $data = [
                'status_id' => $status
            ];

            /*
             * Status 3 = selesai.
             */
            if ((int) $status == 2) {

                $completedAt = Carbon::now();

                /*
                 * Menghitung waktu aktual dalam menit.
                 *
                 * created_at = waktu pasien masuk antrean
                 * completedAt = waktu pelayanan selesai
                 */
                $actualTime = round(
                    Carbon::parse($queue->created_at)
                        ->diffInSeconds($completedAt) / 60,
                    2
                );

                $data['actual_time'] = $actualTime;

                /*
                 * updated_at otomatis menjadi waktu selesai.
                 */
                $data['updated_at'] = $completedAt;
            }

            $queue->fill($data);
            $queue->save();

            /*
             * Update appointment jika antrean berasal
             * dari appointment.
             */
            $codeQueue = $queue->queue_number[0];

            if (
                (int) $status === 3 &&
                $codeQueue === 'B' &&
                $appointment
            ) {
                $appointment->fill([
                    'status_id' => 1
                ]);

                $appointment->save();
            }

            return response()->json($queue);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Regresi Linear sederhana.
     *
     * X = posisi pasien dalam antrean
     * Y = durasi pelayanan aktual
     *
     * Hasil regresi digunakan untuk memperkirakan
     * durasi pelayanan pasien yang berada di depan.
     */
    private function calculatePrediction($clinicId, $patientsAhead)
    {
        if ($patientsAhead <= 0) {
            return 0;
        }

        /*
         * Mengambil data historis yang sudah selesai.
         */
        $historicalData = Queue::where('clinic_id', $clinicId)
            ->where('status_id', 3)
            ->whereNotNull('actual_time')
            ->orderBy('created_at')
            ->get();

        /*
         * Jika belum terdapat data historis,
         * gunakan rata-rata 15 menit sebagai nilai awal.
         */
        if ($historicalData->count() < 2) {
            return $patientsAhead * 15;
        }

        /*
         * Membuat pasangan data:
         *
         * X = posisi antrean
         * Y = actual_time
         */
        $xValues = [];
        $yValues = [];

        foreach ($historicalData as $index => $history) {
            $xValues[] = $index + 1;
            $yValues[] = (float) $history->actual_time;
        }

        $n = count($xValues);

        $sumX = array_sum($xValues);
        $sumY = array_sum($yValues);

        $sumXY = 0;
        $sumX2 = 0;

        for ($i = 0; $i < $n; $i++) {
            $sumXY += $xValues[$i] * $yValues[$i];
            $sumX2 += $xValues[$i] * $xValues[$i];
        }

        /*
         * Rumus slope:
         *
         * b = (nΣXY - ΣXΣY)
         *     / (nΣX² - (ΣX)²)
         */
        $denominator = ($n * $sumX2) - ($sumX * $sumX);

        if ($denominator == 0) {
            return $patientsAhead * 15;
        }

        $b = (
            ($n * $sumXY) -
            ($sumX * $sumY)
        ) / $denominator;

        /*
         * Rumus intercept:
         *
         * a = (ΣY - bΣX) / n
         */
        $a = ($sumY - ($b * $sumX)) / $n;

        /*
         * Menghitung estimasi durasi pelayanan
         * untuk setiap pasien yang berada di depan.
         */
        $prediction = 0;

        for ($i = 1; $i <= $patientsAhead; $i++) {

            $estimatedServiceTime = $a + ($b * $i);

            /*
             * Pastikan hasil tidak negatif.
             */
            $estimatedServiceTime = max(
                1,
                $estimatedServiceTime
            );

            $prediction += $estimatedServiceTime;
        }

        return round($prediction, 2);
    }

    public function destroy($id)
    {
        //
    }
}
