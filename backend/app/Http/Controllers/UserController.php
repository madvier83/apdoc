<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use App\Models\UserSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $user = UserSlot::where('apdoc_id', auth()->user()->apdoc_id)->get();
        return response()->json($user);
    }

    public function show($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }

    public function create(Request $request)
    {
        try {
            $slot = UserSlot::where('apdoc_id', auth()->user()->apdoc_id)->count();
            $userSlot = 10 + auth()->user()->slot;

            if ($slot > $userSlot) {
                return response()->json(['message' => 'User has no empty slots!'], 404);
            }

            $this->validate($request, [
                'name'   => 'required',
                'email'  => 'required|email|unique:users',
                'phone'  => 'required',
                'role'   => 'required|numeric|min:3',
                'clinic' => 'required',
            ]);

            $employee = Employee::create([
                'nik'         => null,
                'name'        => $request->name,
                'birth_place' => null,
                'birth_date'  => null,
                'gender'      => null,
                'address'     => null,
                'phone'       => $request->phone,
                'position_id' => null,
                'clinic_id'   => $request->clinic
            ]);
    
            $data = [
                'name'              => $request->name,
                'email'             => $request->email,
                'role_id'           => $request->role,
                'phone'             => $request->phone,
                'otp_verification'  => '123456',
                'created_at_otp'    => Carbon::now(),
                'expired_otp'       => Carbon::now(),
                'phone_verified_at' => Carbon::now(),
                'is_verified'       => 1,
                'apdoc_id'          => auth()->user()->apdoc_id,
                'employee_id'       => $employee->id
            ];
    
            $user = User::create($data);
    
            return response()->json(['status'=> 'OK' ,'data' => $user, 'message'=> 'Success created account!'], 201);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        // $user = User::find($id);

        // if (!$user) {
        //     return response()->json(['message' => 'User not found!'], 404);
        // }

        // $this->validate($request, [
        //     'email' => $request->email = $user->email ? 'required|email' : 'required|email|unique:users',
        // ]);

        // $data = $request->all();

        // $user->fill($data);

        // $user->save();
        // return response()->json($user);
    }

    public function addSlot(Request $request)
    {
        try {
            $user = User::find(auth()->user()->id);

            if (!$user) {
                return response()->json(['message' => 'User not found!'], 404);
            }

            $this->validate($request, [
                'slot' => 'required',
            ]);

            $data = [
                'slot' => $user->slot + $request->slot
            ];

            $user->fill($data);

            $user->save();
            return response()->json($user);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully!']);
    }
}
