<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Throwable;

class EmployeeController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $employee = Employee::with(['position', 'users', 'province', 'city', 'district', 'village'])
                    ->where(function($query) {
                        $query->doesntHave('users')->orWhereRelation('users', 'apdoc_id', null);
                    })
                    ->where('clinic_id', $clinic)
                    ->where('is_delete', false)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            } else {
                $employee = Employee::with(['position', 'users', 'province', 'city', 'district', 'village'])
                    ->where(function($query) use ($keyword) {
                        $query->where('nik', 'like', '%'.$keyword.'%')
                            ->orWhere('name', 'like', '%'.$keyword.'%')
                            ->orWhere('birth_place', 'like', '%'.$keyword.'%')
                            ->orWhere('birth_date', 'like', '%'.$keyword.'%')
                            ->orWhere('gender', 'like', '%'.$keyword.'%')
                            ->orWhere('address', 'like', '%'.$keyword.'%')
                            ->orWhere('phone', 'like', '%'.$keyword.'%')
                            ->orWhere('created_at', 'like', '%'.$keyword.'%')
                            ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                            ->orWhereRelation('position', 'name', 'like', '%'.$keyword.'%');
                    })
                    ->where(function($query) {
                        $query->doesntHave('users')->orWhereRelation('users', 'apdoc_id', null);
                    })
                    ->where('clinic_id', $clinic)
                    ->where('is_delete', false)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($employee);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $employee = Employee::with(['position', 'province', 'city', 'district', 'village'])->find($id);
    
            return response()->json($employee);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $unique = Employee::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('nik', $request->nik)->first();

        if ($unique) {
            return response()->json(['message' => 'The nik has already been taken.'], 400);
        }
        
        $this->validate($request, [
            'nik'               => 'required',
            'name'              => 'required|string',
            'position_id'       => 'required',
            'birth_place'       => 'required|string',
            'birth_date'        => 'required|date|before:now',
            'gender'            => 'required|in:male,female',
            'phone'             => 'required',
            'province_id'       => 'required',
            'city_id'           => 'required',
            'district_id'       => 'required',
            'village_id'        => 'required',
            'address'           => 'required',
            'rt'                => 'required|max:3',
            'rw'                => 'required|max:3',
            'postal_code'       => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $employee = Employee::create($data);
    
            return response()->json($employee);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found!'], 404);
        }

        $this->validate($request, [
            'nik'               => 'required',
            'name'              => 'required|string',
            'birth_place'       => 'required|string',
            'birth_date'        => 'required|date|before:now',
            'gender'            => 'required|in:male,female',
            'phone'             => 'required',
            'province_id'       => 'required',
            'city_id'           => 'required',
            'district_id'       => 'required',
            'village_id'        => 'required',
            'address'           => 'required',
            'rt'                => 'required|max:3',
            'rw'                => 'required|max:3',
            'postal_code'       => 'required',
        ]);

        if($employee->nik != $request->nik) {
            $unique = Employee::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('nik', $request->nik)->first();
    
            if ($unique) {
                return response()->json(['message' => 'The nik has already been taken.'], 400);
            }
        }

        try {
            $data = $request->all();
            if(isset($request['position_id'])) { $data['position_id'] = $request->position_id; }
            $employee->fill($data);
            $employee->save();
    
            return response()->json($employee);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found!'], 404);
        }

        try {
            $employee->fill(['is_delete' => true]);
            $employee->save();
    
            return response()->json(['message' => 'Employee deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
