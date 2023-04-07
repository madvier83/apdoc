<?php

namespace App\Http\Controllers;

use App\Models\ItemSupply;
use Illuminate\Http\Request;
use Throwable;

class ItemSupplyController extends Controller
{
    public function index()
    {
        try {
            $itemSupply = ItemSupply::orderBy('created_at', 'desc')->with('item')->where('clinic_id', auth()->user()->employee->clinic_id)->get();
    
            return response()->json($itemSupply);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($item)
    {
        try {
            $itemSupply = ItemSupply::where('item_id', $item)->orderBy('created_at', 'desc')->get();
    
            return response()->json($itemSupply);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'item_id'       => 'required',
            'total'         => 'required|numeric|min:1',
            'manufacturing' => 'required|date|before:now',
            'expired'       => 'required|date|after:now',
        ]);

        try {
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
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $itemSupply = ItemSupply::create($data);
    
            return response()->json($itemSupply);
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
