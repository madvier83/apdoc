<?php

namespace App\Http\Controllers;

use App\Models\QueueDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;

class QueueDetailController extends Controller
{
    public function index()
    {
        $queueDetail = QueueDetail::whereDate('created_at', Carbon::today())->with(['queue', 'employee', 'service'])->get();
        return response()->json($queueDetail);
    }

    public function getByDoctor()
    {
        $employee_id = auth()->user()->employee_id ?? null;

        if (!$employee_id) {
            $queueDetail = QueueDetail::whereDate('created_at', Carbon::today())->with(['queue', 'employee', 'service'])->get();
            return response()->json($queueDetail);
        } else {
            $queueDetail = QueueDetail::where('employee_id', auth()->user()->employee_id)->whereDate('created_at', Carbon::today())->with(['queue', 'employee', 'service'])->get();
            return response()->json($queueDetail);
        }
    }

    public function create($queue, $employee, $service)
    {
        $queueDetail = QueueDetail::whereDate('created_at', Carbon::today())->where('queue_id', $queue)->where('service_id', $service)->first();

        if ($queueDetail) {
            return response()->json(['message' => 'Service already in queue'], 400);
        }

        $data = [
            'queue_id'      => $queue,
            'employee_id'   => $employee,
            'service_id'    => $service,
            'is_cancelled'  => false,
        ];

        $queueDetail = QueueDetail::create($data);

        return response()->json($queueDetail);
    }

    public function update($id)
    {
        $queueDetail = QueueDetail::find($id);

        if (!$queueDetail) {
            return response()->json(['message' => 'Queue not found!'], 404);
        }

        $data = [
            'is_cancelled' => ($queueDetail->is_cancelled == 0) ? 1 : 0,
        ];

        $queueDetail->fill($data);

        $queueDetail->save();
        return response()->json($queueDetail);
    }

    public function destroy($id)
    {
        //
    }
}
