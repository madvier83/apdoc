<?php

namespace App\Http\Controllers;

use App\Models\Growth;
use App\Models\Patient;
use Illuminate\Http\Request;
use Throwable;

class GrowthController extends Controller
{
    public function index()
    {
        try {
            $growth = Growth::where('clinic_id', auth()->user()->employee->clinic_id)->get();
            
            return response()->json($growth);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $growth = Growth::find($id);
    
            return response()->json($growth);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function getLatest()
    {
        try {
            $growth = Growth::latest()->first();
    
            return response()->json($growth);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function getByPatient($patient)
    {
        try {
            $growth = Growth::where('patient_id', $patient)->get();
    
            return response()->json($growth);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'patient_id'    => 'required',
            'height'        => 'required',
            'weight'        => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $growth = Growth::create($data);
    
            return response()->json($growth);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
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

        try {
            $data = $request->all();
            $growth->fill($data);
            $growth->save();
    
            return response()->json($growth);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $growth = Growth::find($id);

        if (!$growth) {
            return response()->json(['message' => 'Growth not found!'], 404);
        }

        try {
            $growth->delete();
    
            return response()->json(['message' => 'Growth deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
