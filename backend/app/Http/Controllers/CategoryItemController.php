<?php

namespace App\Http\Controllers;

use App\Models\CategoryItem;
use App\Models\Item;
use Illuminate\Http\Request;

class CategoryItemController extends Controller
{
    public function index()
    {
        $category = CategoryItem::all();
        return response()->json($category);
    }

    public function show($id)
    {
        $category = CategoryItem::find($id);
        return response()->json($category);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
        ]);

        $data = $request->all();
        $category = CategoryItem::create($data);

        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = CategoryItem::find($id);

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
        $category = CategoryItem::find($id);

        if (!$category) {
            return response()->json(['message' => 'CategoryItem not found!'], 404);
        }

        $category->delete();
        Item::where('category_id', $id)->update(['category_id' => null]);
        return response()->json(['message' => 'CategoryItem deleted successfully!']);
    }
}
