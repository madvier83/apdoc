<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class QueueSeeder extends Seeder
{
    public function run(): void
    {
        $startDate = Carbon::create(2026, 6, 1);
        $endDate = Carbon::create(2026, 6, 20);

        $data = [];

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {

            // Skip Sunday
            if ($date->isSunday()) {
                continue;
            }

            $totalPasienHariIni = rand(15, 30);

            $runningTime = $date->copy()->setTime(8, 0, 0);

            for ($i = 1; $i <= $totalPasienHariIni; $i++) {

                $queueNumber = 'A' . str_pad($i, 2, '0', STR_PAD_LEFT);

                if ($i > 1) {
                    $runningTime->addMinutes(rand(5, 15));
                }

                $createdAt = $runningTime->copy();

                // Durasi pemeriksaan aktual
                $basePemeriksaan = rand(10, 15);

                // Efek bertambahnya durasi pelayanan berdasarkan antrean
                $efekLelahDokter = $i * 0.5;

                $durationOfService = $basePemeriksaan + $efekLelahDokter;

                // Actual time dalam menit
                $actualTime = round($durationOfService);

                // Prediction time
                // Estimasi berdasarkan nomor antrean
                $predictionTime = max(
                    1,
                    round(($i - 1) * 12 + rand(-3, 3))
                );

                $updatedAt = $createdAt
                    ->copy()
                    ->addMinutes($actualTime);

                // Stop if service starts after 17:00
                if ($createdAt->hour >= 17) {
                    break;
                }

                $data[] = [
                    'clinic_id' => 2,
                    'patient_id' => rand(1, 10),
                    'queue_number' => $queueNumber,
                    'status_id' => 4,

                    // 'prediction_time' => $predictionTime,
                    'prediction_time' => "",
                    'actual_time' => $actualTime,

                    'created_at' => $createdAt->toDateTimeString(),
                    'updated_at' => $updatedAt->toDateTimeString(),
                ];

                $runningTime = $updatedAt->copy();
            }
        }

        foreach (array_chunk($data, 100) as $chunk) {
            DB::table('queues')->insert($chunk);
        }
    }
}