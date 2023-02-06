<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use Carbon\Carbon;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function index()
    {
        $queue = Queue::whereDate('created_at', Carbon::today())->where('status_id', 1)->with('patient')->get();
        return response()->json($queue);
    }

    public function show($id)
    {
        //
    }

    public function create(Request $request, $patient)
    {
        $queue = Queue::whereDate('created_at', Carbon::today())->where('patient_id', $patient)->where('status_id', 1)->first();

        if ($queue) {
            return response()->json(['message' => 'Patient already in queue'], 400);
        }

        $queue_number = Queue::whereDate('created_at', Carbon::today())->get()->count() + 1;

        $data = [
            'patient_id'    => $patient,
            'queue_number'  => 'A'.$queue_number,
            'status_id'     => 1
        ];

        $queue = Queue::create($data);

        return response()->json($queue);
    }

    public function update(Request $request, $patient, $status)
    {
        $queue = Queue::whereDate('created_at', Carbon::today())->where('patient_id', $patient)->orderBy('id', 'desc')->first();

        if (!$queue) {
            return response()->json(['message' => 'Queue not found!'], 404);
        }

        $data = [
            'status_id' => $status
        ];

        $queue->fill($data);

        $queue->save();
        return response()->json($queue);
    }

    public function destroy($id)
    {
        //
    }
}
