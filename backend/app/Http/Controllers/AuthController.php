<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use \Illuminate\Support\Carbon;
use App\Notifications\OTPWhatsapp;
use Twilio\Rest\Client;

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
            $user->phone = $request->phone;
            $user->role_id  = 2;
            $user->save();
            // if ($user->save()) {
            //     return $this->login($request);
            // }
            return response()->json(['status' => 'OK', 'data' => $user, 'message' => 'Success register!']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function verification_otp(Request $request){
        
        $this->validate($request, [
            'otp_verification' => 'required|min:6|max:6'
        ]);
        
        $data = User::where('email',$request->email)->where('otp_verification', $request->otp_verification)->first();
        
        if (!$data) {
            return response()->json(['status' => 'failed', 'message' => 'Unathorized OTP Verification, Wrong Credentials OTP code!'], 401);
        } else {
            try {
                $expired = Carbon::parse($data->expired_otp)->toString();
                $now = Carbon::now()->toString();
                if($data->is_verified == 1){
                    return response()->json(['status' => 'error', 'message' => 'Account was verified'], 204);
                }
                if($expired < $now)
                {
                    return response()->json(['status' => 'failed', 'message' => 'Verification OTP expired!'], 410);
                }
                $data->is_verified = 1;
                if ($data->save()) {
                    return $this->login($request);
                }
            } catch (\Throwable $th) {
                return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
            }
        }
    }
    
    public function send_otp(Request $request)
    {
        $data = User::where('email',$request->email)->first();
        if (!$data) {
            return response()->json(['status' => 'error', 'message' => 'User Not Found'], 204);
        } else {
            try {
                    if($data->is_verified == 1){
                        return response()->json(['status' => 'error', 'message' => 'Account was verified'], 204);
                    }
                    if($data->created_at_otp){
                        $limit_otp = Carbon::parse($data->created_at_otp)->addMinutes(5)->toString();
                        $times_remaining = Carbon::parse($data->created_at_otp)->diffForHumans();
                        $now = Carbon::now()->toString();
                            if($now < $limit_otp){
                                return response()->json(['status' => 'failed', 'data' => $data, 'message' => 'Your request token is limit for 5 minutes, You was request OTP code '.$times_remaining.'.'], 403);    
                            }
                    }
                    $data->otp_verification = random_int(100000, 999999);
                    $data->created_at_otp = Carbon::now('Asia/Jakarta');
                    $data->expired_otp = Carbon::now('Asia/Jakarta')->addMinutes(5);
                    $data->save();
                    // \Notification::route('whatsapp', 'WHATSAPP_SESSION')->notify(new OTPWhatsapp($data->phone, $data->otp_verification));
                    return response()->json(['status' => 'OK', 'data' => $data, 'message' => 'Success send OTP'], 200); 
            } catch (\Throwable $e) {
                return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
            }
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

        if ($user == null || $user->is_verified == 0) {
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
            'expires_in' => auth()->factory()->getTTL() * 60 * 12
        ]);
    }
}
