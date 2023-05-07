<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use App\Models\UserSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Throwable;

class UserSlotController extends Controller
{
    public function index()
    {
        try {
            $user = UserSlot::with(['user', 'user.employee', 'user.role'])->where('clinic_id', auth()->user()->employee->clinic_id)->get();
    
            return response()->json($user);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function getByClinicId($id)
    {
        try {
            $user = UserSlot::with(['user', 'user.employee', 'user.role'])->where('clinic_id', $id)->get();
    
            return response()->json($user);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $user = UserSlot::with(['user', 'user.employee'])->find($id);
    
            return response()->json($user);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request, $id)
    {
        $employee = UserSlot::whereRelation('user', 'employee_id', $request->employee_id)->first();

        if ($employee) {
            return response()->json(['message' => 'Employee already registered!'], 404);
        }

        $this->validate($request, [
            'email'       => 'required|email|unique:users',
            'phone'       => 'required|unique:users',
            'role_id'     => 'required|numeric|min:3',
            'clinic_id'   => 'required',
            'employee_id' => 'required|numeric|min:2'
        ]);

        try {
            $employee = Employee::find($request->employee_id);

            Employee::where('id', $request->employee_id)->update([
                'clinic_id'   => $request->clinic_id
            ]);
    
            $data = [
                'name'              => $employee->name,
                'email'             => $request->email,
                'role_id'           => $request->role_id,
                'phone'             => $request->phone,
                'otp_verification'  => '123456',
                'created_at_otp'    => Carbon::now(),
                'expired_otp'       => Carbon::now(),
                'phone_verified_at' => Carbon::now(),
                'is_verified'       => 1,
                'employee_id'       => $request->employee_id
            ];
    
            $user = User::create($data);

            UserSlot::where('id', $id)->update(['user_id' => $user->id]);
    
            return response()->json($user);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $slot = UserSlot::with(['user', 'user.employee'])->find($id);

        if (!$slot) {
            return response()->json(['message' => 'User slot not found!'], 404);
        }

        $user = User::find($slot->user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        $employee = Employee::find($request->employee_id);

        if ($employee) {
            return response()->json(['message' => 'Employee already registered!'], 404);
        }

        $this->validate($request, [
            // 'name'      => 'required',
            'phone'     => $user->phone == $request->phone ? 'required' : 'required|unique:users',
            'role_id'   => 'required|numeric|min:3',
            'clinic_id' => 'required',
        ]);

        try {
            $data = $request->all();
            $user->fill($data);
            $user->save();
    
            Employee::where('id', $user->employee_id)->update(['clinic_id' => $request->clinic_id]);
    
            return response()->json(UserSlot::with(['user', 'user.employee'])->find($id));
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function addSlot(Request $request)
    {
        try {
            $user = UserSlot::create([
                'apdoc_id' => auth()->user()->apdoc_id,
                'status'    => 'purchased'
            ]);
    
            return response()->json($user);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $slot = UserSlot::with(['user', 'user.employee'])->find($id);

        if (!$slot) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        try {
            Employee::where('id', $slot->user->employee_id)->delete();
            User::where('id', $slot->user_id)->delete();
            $slot->fill(['user_id' => null]);
            $slot->save();
            
            return response()->json(['message' => 'User deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
