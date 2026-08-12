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
        $model = $this->calculateRegressionModel();

        if (!$model) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model regresi tidak dapat dihitung.'
            ], 400);
        }

        $testingData = RegressionTesting::whereNotNull('actual_time')
            ->whereNotNull('queue_position')
            ->orderBy('created_at', 'asc')
            ->get();

        if ($testingData->count() == 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data testing tidak ditemukan.'
            ], 400);
        }

        $absoluteError = 0;
        $squaredError = 0;

        $results = [];

        foreach ($testingData as $data) {

            $x = (float) $data->queue_position;
            $actual = (float) $data->actual_time;

            $prediction = $model['intercept']
                + ($model['slope'] * $x);

            $error = $actual - $prediction;

            $absolute = abs($error);
            $squared = pow($error, 2);

            $absoluteError += $absolute;
            $squaredError += $squared;

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

        $mae = $absoluteError / $n;

        $rmse = sqrt($squaredError / $n);

        return response()->json([
            'status' => 'success',

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