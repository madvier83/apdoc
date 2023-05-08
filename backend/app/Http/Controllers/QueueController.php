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
            $queue = Queue::whereDate('created_at', Carbon::today())->where('status_id', 1)->with(['patient', 'queueDetails', 'queueDetails.employee', 'queueDetails.service'])->where('clinic_id', $clinic)->get();
    
            return response()->json($queue);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        //
    }

    public function create($patient)
    {
        $queue = Queue::whereDate('created_at', Carbon::today())->where('patient_id', $patient)->where('status_id', 1)->first();

        if ($queue) {
            return response()->json(['message' => 'Patient already in queue'], 400);
        }

        try {
            $queue_number = Queue::whereDate('created_at', Carbon::today())->get()->count() + 1;

            $data = [
                'patient_id'    => $patient,
                'queue_number'  => 'A'.$queue_number,
                'status_id'     => 1
            ];
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $queue = Queue::create($data);

            return response()->json($queue);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function createFromAppointment($appointment)
    {
        $appoint = Appointment::find($appointment);

        if (!$appoint) {
            return response()->json(['message' => 'Appointment not found!'], 404);
        }

        $queue = Queue::whereDate('created_at', Carbon::today())->where('patient_id', $appoint->patient_id)->where('status_id', 1)->first();

        if ($queue) {
            return response()->json(['message' => 'Patient already in queue'], 400);
        }

        try {
            $queue_number = Queue::whereDate('created_at', Carbon::today())->get()->count() + 1;
    
            $data = [
                'patient_id'    => $appoint->patient_id,
                'queue_number'  => 'B'.$queue_number,
                'status_id'     => 1
            ];
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
    
            $queue = Queue::create($data);
    
            $appoint->fill(['status_id' => 2]);
            $appoint->save();
    
            return response()->json($queue);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update($id, $status)
    {
        $queue = Queue::find($id);

        if (!$queue) {
            return response()->json(['message' => 'Queue not found!'], 404);
        }

        try {
            $appointment = Appointment::where('patient_id', $queue->patient_id)->where('status_id', 2)->first();
    
            $data = [
                'status_id' => $status
            ];
    
            $queue->fill($data);
            $queue->save();
    
            $codeQueue = $queue->queue_number[0];
    
            if($status == 3 && $codeQueue == 'B') {
                $appointment->fill(['status_id' => 1]);
                $appointment->save();
            }
    
            return response()->json($queue);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        //
    }
}
