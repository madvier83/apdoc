<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Queue;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class QueueSeeder extends Seeder
{
    public function run(): void
    {
        $file = database_path(
            'seeders/data/dataset.csv'
        );

        $data = array_map('str_getcsv', file($file));

        // ambil header
        $header = array_shift($data);

        foreach ($data as $row) {

            $queue = array_combine($header, $row);

            Queue::create([
                'id' => $queue['id'],
                'patient_id' => $queue['patient_id'],
                'queue_position' => $queue['queue_position'],
                'queue_number' => $queue['queue_number'],
                'prediction_time' => null,
                'actual_time' => $queue['actual_time'],
                'status_id' => $queue['status_id'],
                'clinic_id' => $queue['clinic_id'],
                'created_at' => Carbon::yesterday(),
                'updated_at' => Carbon::yesterday(),
            ]);
        }
    }
}