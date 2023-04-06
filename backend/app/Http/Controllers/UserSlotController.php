<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use App\Models\UserSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserSlotController extends Controller
{
    public function index()
    {
        $user = UserSlot::with(['user', 'user.employee'])->where('apdoc_id', auth()->user()->apdoc_id)->get();
        return response()->json($user);
    }

    public function show($id)
    {
        $user = UserSlot::with(['user', 'user.employee'])->find($id);
        return response()->json($user);
    }

    public function create(Request $request, $id)
    {
        // try {
            $this->validate($request, [
                'name'        => 'required',
                'email'       => 'required|email|unique:users',
                'phone'       => 'required|unique:users',
                'role_id'     => 'required|numeric|min:3',
                'clinic_id'   => 'required',
                'employee_id' => 'required|numeric|min:2'
            ]);

            Employee::where('id', $request->employee_id)->update([
                'clinic_id'   => $request->clinic_id
            ]);
    
            $data = [
                'name'              => $request->name,
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
        // } catch (\Throwable $e) {
        //     return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        // }
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

        $this->validate($request, [
            'name'      => 'required',
            'phone'     => $user->phone == $request->phone ? 'required' : 'required|unique:users',
            'role_id'   => 'required|numeric|min:3',
            'clinic_id' => 'required',
        ]);

        $data = $request->all();

        $user->fill($data);

        $user->save();

        Employee::where('id', $user->employee_id)->update(['clinic_id' => $request->clinic_id]);

        return response()->json(UserSlot::with(['user', 'user.employee'])->find($id));
    }

    public function addSlot(Request $request)
    {
        // try {
            $user = UserSlot::create([
                'apdoc_id' => auth()->user()->apdoc_id,
                'status'    => 'purchased'
            ]);

            return response()->json($user);
        // } catch (\Throwable $e) {
        //     return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        // }
    }

    public function destroy($id)
    {
        $slot = UserSlot::with(['user', 'user.employee'])->find($id);

        if (!$slot) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        Employee::where('id', $slot->user->employee_id)->delete();
        User::where('id', $slot->user_id)->delete();
        $slot->fill(['user_id' => null]);
        $slot->save();
        
        return response()->json(['message' => 'User deleted successfully!']);
    }
}
