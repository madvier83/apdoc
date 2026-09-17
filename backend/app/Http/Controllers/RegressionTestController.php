<?php

namespace App\Http\Controllers;

use App\Models\RegressionTesting;
use App\Models\RegressionTraining;

class RegressionTestController extends Controller
{
    private function calculateRegressionModel()
    {
        $trainingData = RegressionTraining::whereNotNull('actual_time')
            ->whereNotNull('queue_position')
            ->orderBy('created_at', 'asc')
            ->get();

        if ($trainingData->count() < 2) {
            return null;
        }

        $xValues = [];
        $yValues = [];

        foreach ($trainingData as $data) {
            $xValues[] = (float) $data->queue_position;
            $yValues[] = (float) $data->actual_time;
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

        $denominator = ($n * $sumX2) - ($sumX * $sumX);

        if ($denominator == 0) {
            return null;
        }

        $b = (
            ($n * $sumXY) -
            ($sumX * $sumY)
        ) / $denominator;

        $a = ($sumY - ($b * $sumX)) / $n;

        return [
            'data_count' => $n,
            'intercept' => round($a, 4),
            'slope' => round($b, 4),
            'formula' => 'Y = ' . round($a, 2)
                . ' + (' . round($b, 2) . ' * X)',
        ];
    }

    public function regressionModel()
    {
        $model = $this->calculateRegressionModel();

        if (!$model) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model regresi tidak dapat dihitung.'
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'model' => $model
        ]);
    }

    public function testRegression()
    {
        // Memanggil model Regresi Linear
        $model = $this->calculateRegressionModel();

        // Validasi: jika error model gagal dihitung 
        if (!$model) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model regresi tidak dapat dihitung.'
            ], 400);
        }

        // Mengambil seluruh Testing Data dari database yang memiliki nilai aktual
        $testingData = RegressionTesting::whereNotNull('actual_time')
            ->whereNotNull('queue_position')
            ->orderBy('created_at', 'asc')
            ->get();

        // Validasi: Cegah proses jika data testing kosong
        if ($testingData->count() == 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data testing tidak ditemukan.'
            ], 400);
        }

        // Inisialisasi variabel penampung total error (MAE & RMSE)
        $absoluteError = 0;
        $squaredError = 0;
        $results = [];

        // Menghitung nilai prediksi dan error per baris data testing
        foreach ($testingData as $data) {

            $x = (float) $data->queue_position; // Variabel X: Posisi Antrean
            $actual = (float) $data->actual_time; // Variabel Y Aktual: Waktu Tunggu Nyata

            // Rumus Regresi Linear: Y' = a + (b * X)
            $prediction = $model['intercept'] + ($model['slope'] * $x);

            // Menghitung selisih (error) antara Nilai Aktual dan Hasil Prediksi
            $error = $actual - $prediction;

            $absolute = abs($error);     // Absolute Error 
            $squared = pow($error, 2);   // Squared Error 

            // Akumulasi total error seluruh data
            $absoluteError += $absolute;
            $squaredError += $squared;

            // Menyimpan rincian perhitungan per data antrean ke array hasil
            $results[] = [
                'id' => $data->id,
                'queue_number' => $data->queue_number,
                'queue_position' => $x,
                'actual_time' => $actual,
                'prediction' => round($prediction, 2),
                'absolute_error' => round($absolute, 2),
                'squared_error' => round($squared, 2),
            ];
        }

        $n = $testingData->count(); 

        $mae = $absoluteError / $n;          // Formula MAE  = Sum(|Actual - Pred|) / N
        $rmse = sqrt($squaredError / $n);     // Formula RMSE = Sqrt( Sum(Error^2) / N )

        // retrurn
        return response()->json([
            'status' => 'success',

            //  Training
            'training' => [
                'data_count' => $model['data_count'],
                'intercept' => $model['intercept'],
                'slope' => $model['slope'],
                'formula' => $model['formula'],
            ],

            'testing' => [
                'data_count' => $n,
                'mae' => round($mae, 2),
                'rmse' => round($rmse, 2),
            ],

            'results' => $results,
        ]);
    }
}