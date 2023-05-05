<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Throwable;

class UserController extends Controller
{
    public function index()
    {
        //
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
        //
    }

    public function create(Request $request, $id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
