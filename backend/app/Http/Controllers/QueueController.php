<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Queue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Throwable;
use Illuminate\Support\Facades\Log;

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

    public function finished($clinic)
    {
        try {
            $queue = Queue::whereDate('created_at', Carbon::today())
                ->whereIn('status_id', [3])
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
                'queue_position' => $patientsAhead,
                'status_id' => 1,

                'prediction_time' => $predictionTime,
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

                $calledAt = Carbon::now();

                $actualTime = round(
                    Carbon::parse($queue->created_at)
                        ->diffInSeconds($calledAt) / 60,
                    2
                );

                $data['actual_time'] = $actualTime;
                $data['updated_at'] = $calledAt;
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
        // Validasi awal: Jika tidak ada antrean di depan, waktu tunggu adalah 0 menit
        if ($patientsAhead <= 0) {
            return 0;
        }

        $historicalData = Queue::where('clinic_id', $clinicId)
            ->whereNotNull('actual_time')
            ->orderBy('created_at')
            ->get();

        // Fallback: Jika data historis kurang dari 2, gunakan estimasi standar (20 menit/pasien)
        if ($historicalData->count() < 2) {
            return $patientsAhead * 20;
        }

        // X = Nomor/Posisi urutan antrean
        // Y = Waktu tunggu aktual (kumulatif) dalam menit
        $xValues = [];
        $yValues = [];

        foreach ($historicalData as $history) {
            $xValues[] = (float) $history->queue_position;
            $yValues[] = (float) $history->actual_time;
        }

        $n = count($xValues);       // Jumlah sampel data (N)
        $sumX = array_sum($xValues); // Total penjumlahan X (∑X)
        $sumY = array_sum($yValues); // Total penjumlahan Y (∑Y)

        $sumXY = 0; 
        $sumX2 = 0; 

        for ($i = 0; $i < $n; $i++) {
            $sumXY += $xValues[$i] * $yValues[$i];
            $sumX2 += $xValues[$i] * $xValues[$i];
        }

        // Rumus: N(∑X²) - (∑X)²
        $denominator = ($n * $sumX2) - ($sumX * $sumX);

        // Mencegah error 'Division by Zero' jika penyebut bernilai 0
        if ($denominator == 0) {
            return $patientsAhead * 20;
        }

        // Slope (b) = Rata-rata tambahan waktu tunggu per kenaikan 1 posisi antrean
        $b = (($n * $sumXY) - ($sumX * $sumY)) / $denominator;

        // Intercept (a) = Estimasi waktu awal/base time (posisi X = 0)
        $a = ($sumY - ($b * $sumX)) / $n;

        // rumus dasar Regresi Linear: Y = a + bX
        $prediction = $a + ($b * $patientsAhead);

        // (safety boundary) agar nilai prediksi tidak bernilai negatif/0
        $prediction = max(1, $prediction);

        return round($prediction, 2);
    }

    public function regressionDebug($clinicId)
    {
        $historicalData = Queue::where('clinic_id', $clinicId)
            ->whereNotNull('actual_time')
            ->whereNotNull('queue_position')
            ->orderBy('created_at')
            ->get();


        $xValues = [];
        $yValues = [];


        foreach ($historicalData as $history) {

            $xValues[] = (float) $history->queue_position;
            $yValues[] = (float) $history->actual_time;

        }


        $n = count($xValues);


        if ($n < 2) {

            return response()->json([
                'status' => false,
                'message' => 'Data training kurang dari 2',
                'jumlah_data' => $n
            ]);

        }


        $sumX = array_sum($xValues);
        $sumY = array_sum($yValues);

        $sumXY = 0;
        $sumX2 = 0;


        for ($i = 0; $i < $n; $i++) {

            $sumXY += $xValues[$i] * $yValues[$i];
            $sumX2 += $xValues[$i] * $xValues[$i];

        }


        $denominator = ($n * $sumX2) - ($sumX * $sumX);


        if ($denominator == 0) {

            return response()->json([
                'status' => false,
                'message' => 'Tidak dapat menghitung regresi, queue_position tidak memiliki variasi',
                'sample_x' => array_slice($xValues, 0, 20)
            ]);

        }


        // slope
        $b = (
            ($n * $sumXY) - ($sumX * $sumY)
        ) / $denominator;


        // intercept
        $a = (
            $sumY - ($b * $sumX)
        ) / $n;


        return response()->json([

            'status' => true,

            'training' => [
                'jumlah_data' => $n,
                'sample_x_queue_position' => array_slice($xValues, 0, 20),
                'sample_y_actual_time' => array_slice($yValues, 0, 20),
            ],


            'regresi_linear' => [

                'intercept_a' => round($a, 4),

                'slope_b' => round($b, 4),

                'formula' =>
                    'Y = ' .
                    round($a, 2) .
                    ' + (' .
                    round($b, 2) .
                    ' * X)'

            ]

        ]);
    }



    public function destroy($id)
    {
    }
}
