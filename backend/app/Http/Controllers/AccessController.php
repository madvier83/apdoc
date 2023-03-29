<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Menu;
use App\Models\Access;

class AccessController extends Controller
{
    public function index()
    {
        $access = Access::with('role')->where('clinic_id', auth()->user()->employee->clinic_id)->get();
        return response()->json($access);
    }

    public function getByRole($role)
    {
        $access = Access::where('role_id', $role)->get();
        return response()->json($access);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'role'      =>  'required',
            'accesses'  =>  'required',
        ]);

        $role = Role::create([
            'name' => $request->role
        ]);

        $data = [
            'role_id'   => $role->id,
            'accesses'  => $request->accesses,
            'clinic_id' => auth()->user()->employee->clinic_id
        ];

        $access = Access::create($data);

        return response()->json($access);
    }

    public function update(Request $request, $role)
    {
        $access = Access::where('role_id', $role)->first();
        
        if (!$access) {
            return response()->json(['message' => 'Access role not found!'], 404);
        }

        $this->validate($request, [
            'accesses'  =>  'required',
        ]);

        // if (!$access) {
        //     $data = [
        //         'role_id'   => $role,
        //         'accesses'  => $request->accesses
        //     ];
        //     Access::create($data);

        //     $response = [
        //         'role_id'   => $role,
        //         'accesses'  => $request->accesses
        //     ];
        //     return response()->json($response);
        // }

        $data = [
            'accesses'  => $request->accesses
        ];

        $access->fill($data);

        $access->save();

        return response()->json($access);
    }
}
