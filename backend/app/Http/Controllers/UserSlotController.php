<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserSlotController extends Controller
{
    public function index()
    {
        $user = User::all();
        return response()->json($user);
    }

    public function show($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }

    public function create(Request $request)
    {
        // $this->validate($request, [
        //     'email' => 'required|email|unique:users'
        // ]);

        // $data = $request->all();

        // $user = User::create($data);

        // return response()->json(['status'=> 'OK' ,'data' => $user, 'message'=> 'Success created account!'], 201);
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
