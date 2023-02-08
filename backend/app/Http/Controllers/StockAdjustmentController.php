<?php

namespace App\Http\Controllers;

use App\Models\ItemSupply;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;

class StockAdjustmentController extends Controller
{
    public function index()
    {
        $itemSupply = StockAdjustment::orderBy('created_at', 'desc')->with(['itemSupply', 'itemSupply.item'])->get();
        return response()->json($itemSupply);
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

        $before = ItemSupply::where('id', $request->item_supply_id)->first();

        $data = [
            'item_supply_id' => $request->item_supply_id,
            'adjustment'    => $request->adjustment,
            'note'          => $request->note ?? '-',
            'before'        => $before->stock,
            'difference'    => $request->adjustment - $before->stock,
        ];

        $adjustment = StockAdjustment::create($data);

        // Adjustment stock
        ItemSupply::where('id', $request->item_supply_id)->update(['stock' => $request->adjustment]);

        return response()->json($adjustment);
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
