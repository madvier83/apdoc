<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Throwable;

class ItemController extends Controller
{
    public function index()
    {
        try {
            $item = Item::with(['categoryItem', 'itemSupplys'])->where('clinic_id', auth()->user()->employee->clinic_id)->get();
    
            return response()->json($item);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $item = Item::with('categoryItem')->find($id);
    
            return response()->json($item);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'category_item_id'  => 'required',
            'name'              => 'required',
            'unit'              => 'required',
            'sell_price'        => 'required',
            'buy_price'         => 'required',
            'factory'           => 'required',
            'distributor'       => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $item = Item::create($data);
    
            return response()->json($item);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found!'], 404);
        }

        $this->validate($request, [
            'category_item_id'  => 'required',
            'name'              => 'required',
            'unit'              => 'required',
            'sell_price'        => 'required',
            'buy_price'         => 'required',
            'factory'           => 'required',
            'distributor'       => 'required',
        ]);

        try {
            $data = $request->all();
            $item->fill($data);
            $item->save();
    
            return response()->json($item);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found!'], 404);
        }

        try {
            $item->delete();
    
            return response()->json(['message' => 'Item deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
