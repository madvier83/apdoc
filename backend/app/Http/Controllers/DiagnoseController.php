<?php

namespace App\Http\Controllers;

use App\Models\Diagnose;
use Illuminate\Http\Request;

class DiagnoseController extends Controller
{
    public function index()
    {
        $diagnose = Diagnose::all();
        return response()->json($diagnose);
    }

    public function show($id)
    {
        $diagnose = Diagnose::find($id);
        return response()->json($diagnose);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'code'        => 'required',
            'description' => 'required|string',
        ]);

        $data = $request->all();
        $diagnose = Diagnose::create($data);

        return response()->json($diagnose);
    }

    public function update(Request $request, $id)
    {
        $diagnose = Diagnose::find($id);

        if (!$diagnose) {
            return response()->json(['message' => 'Diagnose not found!'], 404);
        }

        $this->validate($request, [
            'code'        => 'required',
            'description' => 'required|string',
        ]);

        $data = $request->all();

        $diagnose->fill($data);

        $diagnose->save();
        return response()->json($diagnose);
    }

    public function destroy($id)
    {
        $diagnose = Diagnose::find($id);

        if (!$diagnose) {
            return response()->json(['message' => 'Diagnose not found!'], 404);
        }

        $diagnose->delete();
        return response()->json(['message' => 'Diagnose deleted successfully!']);
    }
}
