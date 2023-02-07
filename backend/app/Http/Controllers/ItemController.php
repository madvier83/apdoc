<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        $item = Item::with('category')->get();
        return response()->json($item);
    }

    public function show($id)
    {
        $item = Item::with('category')->find($id);
        return response()->json($item);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'category_id'       => 'required',
            'name'              => 'required',
            'unit'              => 'required',
            'sell_price'        => 'required',
            'buy_price'         => 'required',
            'factory'           => 'required',
            'distributor'       => 'required',
        ]);

        $data = $request->all();
        $item = Item::create($data);

        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found!'], 404);
        }

        $this->validate($request, [
            'category_id'       => 'required',
            'name'              => 'required',
            'unit'              => 'required',
            'sell_price'        => 'required',
            'buy_price'         => 'required',
            'factory'           => 'required',
            'distributor'       => 'required',
        ]);

        $data = $request->all();

        $item->fill($data);

        $item->save();
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found!'], 404);
        }

        $item->delete();
        return response()->json(['message' => 'Item deleted successfully!']);
    }
}
