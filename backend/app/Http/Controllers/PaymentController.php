<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payment = Payment::with('category')->get();
        return response()->json($payment);
    }

    public function show($id)
    {
        $payment = Payment::with('category')->find($id);
        return response()->json($payment);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'category_id'       => 'required',
            'name'              => 'required',
        ]);

        $data = $request->all();
        $payment = Payment::create($data);

        return response()->json($payment);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found!'], 404);
        }

        $this->validate($request, [
            'category_id'       => 'required',
            'name'              => 'required',
        ]);

        $data = $request->all();

        $payment->fill($data);

        $payment->save();
        return response()->json($payment);
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found!'], 404);
        }

        $payment->delete();
        return response()->json(['message' => 'Payment deleted successfully!']);
    }
}
