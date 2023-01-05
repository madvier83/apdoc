<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Carbon;
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

            if ($user->save()) {
                return $this->send_otp($request->email);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function verification_otp($token_verification){
        $user  = User::findOrFail($token_verification);
        $expired = Carbon::parse($user->expired_token)->addMinutes(5);

        $this->validate($request, [
            'token_verification' => 'required|min:6|max:6'
        ]);

        try {
            if(Carbon::parse($user->expired_token)->toString() < $expired)
            {
                return response()->json(['status' => 'failed' ,'message' => 'Token expired!'], 504);
            }
            $user->is_verified = 1;
            $user->verified_at = Carbon::now('Jakarta/Indonesia');
            $user->save();
            return $this->login($request);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
    
    public function send_otp($email){

        $data = User::findOrFail($email);
        $expired = Carbon::parse($data->expired_token)->addMinutes(5);

        if(Carbon::parse($data->expired_token)->toString() < $expired){
            return reponse()->json(['status' => 'failed', 'data' => $data, 'message' => 'Your token is limit by '.$data->expired_token->diffForHumans().' minutes'], 403);
        } else {
            try {
                $data->token_verification = random_int(100000, 999999);
                $data->expired_token = Carbon::now('Jakarta/Indonesia');
                $data->save();
                $this->whatsapp_otp($data->phone, $data->token_verification);
                return reponse()->json(['status' => 'OK', 'data' => $data, 'message' => 'Success send OTP'], 203);
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
            'expires_in' => auth()->factory()->getTTL() * 60 * 12
        ]);
    }

    private function whatsapp_otp($phone, $token_verification)
    {
        $sid    = getenv("TWILIO_AUTH_SID");
        $token  = getenv("TWILIO_AUTH_TOKEN");
        $wa_from= getenv("TWILIO_WHATSAPP_FROM");
        $test = 'Adam';
        $twilio = new Client($sid, $token);
        
        $body = "Good Morning {$test},You have appointment on {$token_verification}.";

        return $twilio->messages->create("whatsapp:$phone",["from" => "whatsapp:$wa_from", "body" => $body]);
    }
}
