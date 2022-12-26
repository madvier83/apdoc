<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        $patient = Patient::all();
        return response()->json($patient);
    }

    public function show($id)
    {
        $patient = Patient::find($id);
        return response()->json($patient);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'nik'               => 'required',
            'name'              => 'required|string',
            'birth_place'       => 'required|string',
            'birth_date'        => 'required|date|before:now',
            'gender'            => 'required|in:male,female',
            'address'           => 'required',
            'phone'             => 'required',
        ]);

        $data = $request->all();
        $patient = Patient::create($data);

        return response()->json($patient);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found!'], 404);
        }

        $this->validate($request, [
            'nik'               => 'required',
            'name'              => 'required|string',
            'birth_place'       => 'required|string',
            'birth_date'        => 'required|date|before:now',
            'gender'            => 'required|in:male,female',
            'address'           => 'required',
            'phone'             => 'required',
        ]);

        $data = $request->all();

        $patient->fill($data);

        $patient->save();
        return response()->json($patient);
    }

    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found!'], 404);
        }

        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully!']);
    }
}
