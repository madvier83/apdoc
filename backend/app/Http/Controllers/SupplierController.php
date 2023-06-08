<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Throwable;

class SupplierController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $supplier = Supplier::where('clinic_id', $clinic)->where('is_delete', false)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $supplier = Supplier::where(function($query) use ($keyword) {
                        $query->where('name', 'like', '%'.$keyword.'%')
                            ->orWhere('phone', 'like', '%'.$keyword.'%')
                            ->orWhere('email', 'like', '%'.$keyword.'%')
                            ->orWhere('address', 'like', '%'.$keyword.'%')
                            ->orWhere('created_at', 'like', '%'.$keyword.'%')
                            ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->where('is_delete', false)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($supplier);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $supplier = Supplier::find($id);
    
            return response()->json($supplier);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name'              => 'required',
            'phone'             => 'required',
            'email'             => 'required',
            'address'           => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $supplier = Supplier::create($data);
    
            return response()->json($supplier);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json(['message' => 'Supplier not found!'], 404);
        }

        $this->validate($request, [
            'name'              => 'required',
            'phone'             => 'required',
            'email'             => 'required',
            'address'           => 'required',
        ]);

        try {
            $data = $request->all();
            $supplier->fill($data);
            $supplier->save();
    
            return response()->json($supplier);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json(['message' => 'Supplier not found!'], 404);
        }

        try {
            // $supplier->delete();
            $supplier->fill(['is_delete' => true]);
            $supplier->save();
    
            return response()->json(['message' => 'Supplier deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
