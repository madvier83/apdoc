<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function index()
    {
        $position = Position::all();
        return response()->json($position);
    }

    public function show($id)
    {
        $position = Position::find($id);
        return response()->json($position);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name'              => 'required|string|unique:positions',
        ]);

        $data = $request->all();
        $position = Position::create($data);

        return response()->json($position);
    }

    public function update(Request $request, $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found!'], 404);
        }

        $this->validate($request, [
            'name' => $request->name == $position->name ? 'required|string' : 'required|string|unique:positions',
        ]);

        $data = $request->all();

        $position->fill($data);

        $position->save();
        return response()->json($position);
    }

    public function destroy($id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found!'], 404);
        }

        $position->delete();
        return response()->json(['message' => 'Position deleted successfully!']);
    }
}
