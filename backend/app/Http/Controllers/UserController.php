<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Throwable;

class UserController extends Controller
{
    public function index()
    {
        $user = User::with('employee')->get();
        return response()->json($user);
    }

    public function getClient($perPage, $keyword=null)
    {
        try {
            $user = User::with('employee')->where('role_id', 2)->orderBy('updated_at', 'desc')->paginate($perPage);

            if ($keyword == null) {
                $user = User::with('employee')->where('role_id', 2)->orderBy('updated_at', 'desc')->paginate($perPage);
            } else {
                $user = User::with('employee')->where('role_id', 2)
                    ->where('name', 'like', '%'.$keyword.'%')
                    ->orWhere('email', 'like', '%'.$keyword.'%')
                    ->orWhere('phone', 'like', '%'.$keyword.'%')
                    ->orWhereRelation('role', 'name', 'like', '%'.$keyword.'%')
                    ->orWhereRelation('employee', 'name', 'like', '%'.$keyword.'%')
                    ->orWhere('created_at', 'like', '%'.$keyword.'%')
                    ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                    ->orderBy('updated_at', 'desc')
                    ->paginate($perPage);
            }
    
            return response()->json($user);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        $user = User::with('employee')->find($id);
        return response()->json($user);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'email'     => 'required|email|unique:users'
        ]);

        $data = $request->all();
        $data['password'] = app('hash')->make($request->password);
        $data['role'] = 3;

        $user = User::create($data);

        return response()->json(['status'=> 'OK' ,'data' => $user, 'message'=> 'Success created account!'], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        $this->validate($request, [
            'email'     => $request->email == $user->email ? 'required|email' : 'required|email|unique:users',
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
