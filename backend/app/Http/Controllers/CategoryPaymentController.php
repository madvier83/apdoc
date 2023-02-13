<?php

namespace App\Http\Controllers;

use App\Models\CategoryPayment;
use App\Models\Payment;
use Illuminate\Http\Request;

class CategoryPaymentController extends Controller
{
    public function index()
    {
        $category = CategoryPayment::with('payments')->get();
        return response()->json($category);
    }

    public function show($id)
    {
        $category = CategoryPayment::with('payments')->find($id);
        return response()->json($category);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
        ]);

        $data = $request->all();
        $category = CategoryPayment::create($data);

        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = CategoryPayment::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found!'], 404);
        }

        $this->validate($request, [
            'name' => 'required|string',
        ]);

        $data = $request->all();

        $category->fill($data);

        $category->save();
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = CategoryPayment::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found!'], 404);
        }

        $category->delete();
        Payment::where('category_payment_id', $id)->update(['category_payment_id' => null]);
        return response()->json(['message' => 'Category deleted successfully!']);
    }
}
