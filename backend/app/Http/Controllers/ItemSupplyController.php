<?php

namespace App\Http\Controllers;

use App\Models\ItemSupply;
use Illuminate\Http\Request;

class ItemSupplyController extends Controller
{
    public function index()
    {
        $itemSupply = ItemSupply::orderBy('created_at', 'desc')->with('item')->get();
        return response()->json($itemSupply);
    }

    public function show($item)
    {
        $itemSupply = ItemSupply::where('item_id', $item)->orderBy('created_at', 'desc')->get();
        return response()->json($itemSupply);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'item_id'       => 'required',
            'total'         => 'required|numeric|min:1',
            'manufacturing' => 'required|date|before:now',
            'expired'       => 'required|date|after:now',
        ]);

        $before = ItemSupply::where('item_id', $request->item_id)->get()->sum('stock');

        $data = [
            'item_id'       => $request->item_id,
            'total'         => $request->total,
            'before'        => $before,
            'after'         => $before + $request->total,
            'manufacturing' => $request->manufacturing,
            'expired'       => $request->expired,
            'note'          => $request->note ?? '-',
            'stock'         => $request->total,
        ];

        $itemSupply = ItemSupply::create($data);

        return response()->json($itemSupply);
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
