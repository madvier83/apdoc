<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index()
    {
        $promotion = Promotion::all();
        return response()->json($promotion);
    }

    public function show($id)
    {
        $promotion = Promotion::find($id);
        return response()->json($promotion);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name'     => 'required',
            'discount' => 'required',
        ]);

        $data = $request->all();
        $promotion = Promotion::create($data);

        return response()->json($promotion);
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found!'], 404);
        }

        $this->validate($request, [
            'name'     => 'required',
            'discount' => 'required',
        ]);

        $data = $request->all();

        $promotion->fill($data);

        $promotion->save();
        return response()->json($promotion);
    }

    public function destroy($id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found!'], 404);
        }

        $promotion->delete();
        return response()->json(['message' => 'Promotion deleted successfully!']);
    }
}
