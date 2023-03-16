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

    public function getByUser($user)
    {
        $access = Access::where('user_id', $user)->get();
        return response()->json($access);
    }

    public function update(Request $request, $user)
    {
        $this->validate($request, [
            'accesses'  =>  'required',
        ]);

        $access = Access::where('user_id', $user)->first();

        if (!$access) {
            $data = [
                'user_id'   => $user,
                'accesses'  => $request->accesses
            ];
            Access::create($data);

            $response = [
                'user_id'   => $user,
                'accesses'  => json_decode($request->accesses)
            ];
            return response()->json($response);
        }

        return $data = [
            'user_id'   => $user,
            'accesses'  => $request->accesses
        ];

        $access->fill($data);

        $access->save();

        $response = [
            'user_id'   => $user,
            'accesses'  => json_decode($request->accesses)
        ];
        return response()->json($response);
    }
}
