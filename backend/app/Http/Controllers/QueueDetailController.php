<?php

namespace App\Http\Controllers;

use App\Models\QueueDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Throwable;

class QueueDetailController extends Controller
{
    public function index()
    {
        try {
            $queueDetail = QueueDetail::whereDate('created_at', Carbon::today())->with(['queue', 'employee', 'service'])->where('clinic_id', auth()->user()->employee->clinic_id)->get();
    
            return response()->json($queueDetail);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function getByDoctor()
    {
        try {
            $employee_id = auth()->user()->employee_id ?? null;
    
            if (!$employee_id) {
                $queueDetail = QueueDetail::whereDate('created_at', Carbon::today())->with(['queue', 'employee', 'service'])->get();
                return response()->json($queueDetail);
            } else {
                $queueDetail = QueueDetail::where('employee_id', auth()->user()->employee_id)->whereDate('created_at', Carbon::today())->with(['queue', 'employee', 'service'])->get();
                return response()->json($queueDetail);
            }
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create($queue, $employee, $service)
    {
        $queueDetail = QueueDetail::whereDate('created_at', Carbon::today())->where('queue_id', $queue)->where('service_id', $service)->first();

        if ($queueDetail) {
            return response()->json(['message' => 'Service already in queue'], 400);
        }

        try {
            $data = [
                'queue_id'      => $queue,
                'employee_id'   => $employee,
                'service_id'    => $service,
                'is_cancelled'  => false,
            ];
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $queueDetail = QueueDetail::create($data);
    
            return response()->json($queueDetail);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update($id)
    {
        $queueDetail = QueueDetail::find($id);

        if (!$queueDetail) {
            return response()->json(['message' => 'Queue not found!'], 404);
        }

        try {
            $data = [
                'is_cancelled' => ($queueDetail->is_cancelled == 0) ? 1 : 0,
            ];
            $queueDetail->fill($data);
            $queueDetail->save();
    
            return response()->json($queueDetail);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        //
    }
}
