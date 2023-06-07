<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Throwable;

class PatientController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'updated_at';
        $order  = $request->order ?? 'desc';

        try {
            if ($keyword == null) {
                $patient = Patient::with('queues')->where('is_delete', false)->where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $patient = Patient::with('queues')->where(function($query) use ($keyword) {
                    $query->where('nik', 'like', '%'.$keyword.'%')
                        ->orWhere('name', 'like', '%'.$keyword.'%')
                        ->orWhere('birth_place', 'like', '%'.$keyword.'%')
                        ->orWhere('birth_date', 'like', '%'.$keyword.'%')
                        ->orWhere('gender', 'like', '%'.$keyword.'%')
                        ->orWhere('address', 'like', '%'.$keyword.'%')
                        ->orWhere('phone', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->where('is_delete', false)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($patient);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $patient = Patient::find($id);
    
            return response()->json($patient);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $unique = Patient::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('nik', $request->nik)->first();

        if ($unique) {
            return response()->json(['message' => 'The nik has already been taken.'], 422);
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

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $patient = Patient::create($data);
    
            return response()->json($patient);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
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

        if($patient->nik != $request->nik) {
            $unique = Patient::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('nik', $request->nik)->first();
    
            if ($unique) {
                return response()->json(['message' => 'The nik has already been taken.'], 422);
            }
        }

        try {
            $data = $request->all();
            $patient->fill($data);
            $patient->save();
    
            return response()->json($patient);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found!'], 404);
        }

        try {
            // $patient->delete();
            $patient->fill(['is_delete' => true]);
            $patient->save();
    
            return response()->json(['message' => 'Patient deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
