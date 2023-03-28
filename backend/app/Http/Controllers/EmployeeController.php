<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employee = Employee::with('position')->where('clinic_id', auth()->user()->employee->clinic_id)->get();
        return response()->json($employee);
    }

    public function show($id)
    {
        $employee = Employee::with('position')->find($id);
        return response()->json($employee);
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
            'position_id'       => 'required',
        ]);

        $data = $request->all();
        $data['clinic_id'] = auth()->user()->employee->clinic_id;
        $employee = Employee::create($data);

        return response()->json($employee);
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
            'address'           => 'required',
            'phone'             => 'required',
            'position_id'       => 'required',
        ]);

        $data = $request->all();

        $employee->fill($data);

        $employee->save();
        return response()->json($employee);
    }

    public function destroy($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found!'], 404);
        }

        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully!']);
    }
}
