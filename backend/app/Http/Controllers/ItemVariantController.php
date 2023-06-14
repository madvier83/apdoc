<?php

namespace App\Http\Controllers;

use App\Models\ItemVariant;
use Illuminate\Http\Request;
use Throwable;

class ItemVariantController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $variant = ItemVariant::where('is_delete', false)->where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $variant = ItemVariant::where(function($query) use ($keyword) {
                        $query->where('unit', 'like', '%'.$keyword.'%')
                            ->orWhere('varian', 'like', '%'.$keyword.'%')
                            ->orWhere('buy_price', 'like', '%'.$keyword.'%')
                            ->orWhere('sell_price', 'like', '%'.$keyword.'%')
                            ->orWhere('created_at', 'like', '%'.$keyword.'%')
                            ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('is_delete', false)
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($variant);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $variant = ItemVariant::find($id);
    
            return response()->json($variant);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'item_id'    => 'required',
            'unit'       => 'required',
            'variant'    => 'required',
            'sell_price' => 'required',
            'buy_price'  => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $variant = ItemVariant::create($data);
    
            return response()->json($variant);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $variant = ItemVariant::find($id);

        if (!$variant) {
            return response()->json(['message' => 'ItemVariant not found!'], 404);
        }

        $this->validate($request, [
            'item_id'    => 'required',
            'unit'       => 'required',
            'variant'    => 'required',
            'sell_price' => 'required',
            'buy_price'  => 'required',
        ]);

        if($variant->name != $request->name) {
            $unique = ItemVariant::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('name', $request->name)->first();
    
            if ($unique) {
                return response()->json(['message' => 'The name has already been taken.'], 422);
            }
        }

        try {
            $data = $request->all();
            $variant->fill($data);
            $variant->save();
    
            return response()->json($variant);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $variant = ItemVariant::find($id);

        if (!$variant) {
            return response()->json(['message' => 'ItemVariant not found!'], 404);
        }

        try {
            $variant->fill(['is_delete' => true]);
            $variant->save();
    
            return response()->json(['message' => 'ItemVariant deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
