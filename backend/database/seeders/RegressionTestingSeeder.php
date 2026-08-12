<?php

namespace Database\Seeders;

use App\Models\RegressionTesting;
use Illuminate\Database\Seeder;

class RegressionTestingSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/dataset_testing.csv');

        if (!file_exists($path)) {
            $this->command->error('File dataset_testing.csv tidak ditemukan.');
            return;
        }

        $file = fopen($path, 'r');

        $header = fgetcsv($file);

        while (($row = fgetcsv($file)) !== false) {

            if (count($row) < count($header)) {
                continue;
            }

            $data = array_combine($header, $row);

            RegressionTesting::create([
                'patient_id' => $data['patient_id'] ?? null,
                'queue_number' => $data['queue_number'] ?? null,
                'prediction_time' => $data['prediction_time'] ?? null,
                'actual_time' => $data['actual_time'] ?? null,
                'status_id' => $data['status_id'] ?? null,
                'clinic_id' => $data['clinic_id'] ?? null,
                'created_at' => $data['created_at'] ?? null,
                'updated_at' => $data['updated_at'] ?? null,
                'queue_position' => $data['queue_position'] ?? null,
            ]);
        }

        fclose($file);

        $this->command->info('Data testing berhasil diimport.');
    }
}