<?php

namespace App\Http\Controllers;

use App\Models\Growth;
use App\Models\Patient;
use Illuminate\Http\Request;

class GrowthController extends Controller
{
    public function index()
    {
        $growth = Growth::all();
        return response()->json($growth);
    }

    public function show($id)
    {
        $growth = Growth::find($id);
        return response()->json($growth);
    }

    public function getLatest()
    {
        $growth = Growth::latest()->first();
        return response()->json($growth);
    }

    public function getByPatient($patient)
    {
        $growth = Growth::where('patient_id', $patient)->get();
        return response()->json($growth);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'patient_id'    => 'required',
            'height'        => 'required',
            'weight'        => 'required',
        ]);

        $data = $request->all();
        $growth = Growth::create($data);

        return response()->json($growth);
    }

    public function update(Request $request, $id)
    {
        $growth = Growth::find($id);

        if (!$growth) {
            return response()->json(['message' => 'Growth not found!'], 404);
        }

        $this->validate($request, [
            'patient_id'    => 'required',
            'height'        => 'required',
            'weight'        => 'required',
        ]);

        $data = $request->all();

        $growth->fill($data);

        $growth->save();
        return response()->json($growth);
    }

    public function destroy($id)
    {
        $growth = Growth::find($id);

        if (!$growth) {
            return response()->json(['message' => 'Growth not found!'], 404);
        }

        $growth->delete();
        return response()->json(['message' => 'Growth deleted successfully!']);
    }
}
