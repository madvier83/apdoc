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
        // 
    }

    public function getByRole($role)
    {
        $access = Access::where('role_id', $role)->get();
        return response()->json($access);
    }

    public function update(Request $request, $role)
    {
        $this->validate($request, [
            'accesses'  =>  'required',
        ]);

        $access = Access::where('role_id', $role)->first();

        if (!$access) {
            $data = [
                'role_id'   => $role,
                'accesses'  => $request->accesses
            ];
            Access::create($data);

            $response = [
                'role_id'   => $role,
                'accesses'  => $request->accesses
            ];
            return response()->json($response);
        }

        $data = [
            'role_id'   => $role,
            'accesses'  => $request->accesses
        ];

        $access->fill($data);

        $access->save();

        $response = [
            'role_id'   => $role,
            'accesses'  => $request->accesses
        ];
        return response()->json($response);
    }
}
