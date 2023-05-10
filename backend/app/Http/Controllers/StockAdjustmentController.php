<?php

namespace App\Http\Controllers;

use App\Models\ItemSupply;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;
use Throwable;

class StockAdjustmentController extends Controller
{
    public function index($clinic, $perPage, $keyword=null)
    {
        try {
            if ($keyword == null) {
                $itemSupply = StockAdjustment::with(['itemSupply', 'itemSupply.item'])->where('clinic_id', $clinic)->orderBy('updated_at', 'desc')->paginate($perPage);
            } else {
                $itemSupply = StockAdjustment::with(['itemSupply', 'itemSupply.item'])->where(function($query) use ($keyword) {
                    $query->where('adjustment', 'like', '%'.$keyword.'%')
                        ->orWhere('before', 'like', '%'.$keyword.'%')
                        ->orWhere('difference', 'like', '%'.$keyword.'%')
                        ->orWhere('note', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                        ->orWhereRelation('itemSupply.item', 'name', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy('updated_at', 'desc')
                    ->paginate($perPage);
            }
    
            return response()->json($itemSupply);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        //
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'item_supply_id' => 'required',
            'adjustment'     => 'required|numeric',
        ]);

        try {
            $before = ItemSupply::where('id', $request->item_supply_id)->first();
    
            $data = [
                'item_supply_id' => $request->item_supply_id,
                'adjustment'    => $request->adjustment,
                'note'          => $request->note ?? '-',
                'before'        => $before->stock,
                'difference'    => $request->adjustment - $before->stock,
            ];
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $adjustment = StockAdjustment::create($data);
    
            // Adjustment stock
            ItemSupply::where('id', $request->item_supply_id)->update(['stock' => $request->adjustment]);
    
            return response()->json($adjustment);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
