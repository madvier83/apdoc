<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $this->validate($request, [
            'name'      => 'string',
            'phone'     => 'unique:users',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|min:8',
        ]);

        try {
            $user = new User();
            $user->email    = $request->email;
            $user->password = app('hash')->make($request->password);
            $user->role_id  = 2;

            if ($user->save()) {
                return $this->login($request);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function login(Request $request)
    {
        $this->validate($request, [
            'email'             => 'required',
            'password'          => 'required',
        ]);

        $user = User::where('email', $request->email)->with('role')->first();

        if ($user == null) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $credentials = request(['email', 'password']);

        if (!$token = auth()->claims(['id' => $user->id, 'email' => $user->email, 'role' => $user->role->name])->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
