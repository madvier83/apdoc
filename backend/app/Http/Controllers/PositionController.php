<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function index()
    {
        $position = Position::where('clinic_id', auth()->user()->employee->clinic_id)->get();
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
            'name' => 'required|string|max:32',
        ]);

        $data = $request->all();
        $data['clinic_id'] = auth()->user()->employee->clinic_id;
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
            'name' => ($request->name == $position->name) ? 'required|string' : 'required|string',
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
        Employee::where('position_id', $id)->update(['position_id' => null]);
        return response()->json(['message' => 'Position deleted successfully!']);
    }
}
