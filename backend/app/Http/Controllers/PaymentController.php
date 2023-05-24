<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Throwable;

class PaymentController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'updated_at';
        $order  = $request->order ?? 'desc';

        try {
            if ($keyword == null) {
                $payment = Payment::with('categoryPayment')->where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $payment = Payment::with('categoryPayment')->where(function($query) use ($keyword) {
                    $query->where('name', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                        ->orWhereRelation('categoryPayment', 'name', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($payment);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $payment = Payment::with('categoryPayment')->find($id);
    
            return response()->json($payment);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'category_payment_id' => 'required',
            'name'                => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $payment = Payment::create($data);
    
            return response()->json($payment);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found!'], 404);
        }

        $this->validate($request, [
            'category_payment_id' => 'required',
            'name'                => 'required',
        ]);

        try {
            $data = $request->all();
            $payment->fill($data);
            $payment->save();
    
            return response()->json($payment);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found!'], 404);
        }

        try {
            $payment->delete();
    
            return response()->json(['message' => 'Payment deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
