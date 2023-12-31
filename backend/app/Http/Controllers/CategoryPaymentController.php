<?php

namespace App\Http\Controllers;

use App\Models\CategoryPayment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Throwable;

class CategoryPaymentController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $category = CategoryPayment::with('payments')->where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $category = CategoryPayment::with('payments')->where(function($query) use ($keyword) {
                    $query->where('name', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($category);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $category = CategoryPayment::with('payments')->find($id);
    
            return response()->json($category);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
        ]);

        $unique = CategoryPayment::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('name', $request->name)->first();

        if ($unique) {
            return response()->json(['message' => 'The name has already been taken.'], 422);
        }

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $category = CategoryPayment::create($data);
    
            return response()->json($category);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
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

        if($category->name != $request->name) {
            $unique = CategoryPayment::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('name', $request->name)->first();
    
            if ($unique) {
                return response()->json(['message' => 'The name has already been taken.'], 422);
            }
        }

        try {
            $data = $request->all();
            $category->fill($data);
            $category->save();
    
            return response()->json($category);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $category = CategoryPayment::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found!'], 404);
        }

        try {
            $category->delete();
            Payment::where('category_payment_id', $id)->update(['category_payment_id' => null]);
    
            return response()->json(['message' => 'Category deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
