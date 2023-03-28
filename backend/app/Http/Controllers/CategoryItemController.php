<?php

namespace App\Http\Controllers;

use App\Models\CategoryItem;
use App\Models\Item;
use Illuminate\Http\Request;

class CategoryItemController extends Controller
{
    public function index()
    {
        $category = CategoryItem::with('items')->where('clinic_id', auth()->user()->employee->clinic_id)->get();
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
        $data['clinic_id'] = auth()->user()->employee->clinic_id;
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
            return response()->json(['message' => 'Category not found!'], 404);
        }

        $category->delete();
        Item::where('category_item_id', $id)->update(['category_item_id' => null]);
        return response()->json(['message' => 'Category deleted successfully!']);
    }
}
