<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
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
        $this->validate($request, [
            'name'      => 'required|string',
            'phone'     => 'required|unique:users',
            'email'     => 'required|email|unique:users',
            'role_id'   => 'required|in:1,2,3',
        ]);

        $data = $request->all();
        $data['password'] = app('hash')->make($request->password);

        $user = User::create($data);

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        $this->validate($request, [
            'name'      => 'required|string',
            'phone'     => $request->phone == $user->phone ? 'required' : 'required|unique:users',
            'email'     => $request->email == $user->email ? 'required|email' : 'required|email|unique:users',
            'role_id'   => 'required|in:1,2,3',
        ]);

        $data = $request->all();

        $user->fill($data);

        $user->save();
        return response()->json($user);
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
