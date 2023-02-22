<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use \Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use App\Notifications\OTPWhatsapp;
use App\Events\VerifyEmail;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Events\ForgotPasswordMail;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Twilio\Rest\Client;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $this->validate($request, [
            'name'      => 'string',
            // 'phone'     => 'unique:users|min:11',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|min:8',
        ]);

        try {
            $user = new User();
            $user->email    = $request->email;
            $user->password = app('hash')->make($request->password);
            // $user->phone = $request->phone;
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

    public function verification_otp(Request $request)
    {
        $this->validate($request, [
            'otp_verification' => 'required|min:6|numeric'
        ]);

        $data = User::where('email', $request->email)->where('otp_verification', $request->otp_verification)->first();

        if (!$data) {
            return response()->json(['status' => 'failed', 'message' => 'Unathorized OTP Verification, Wrong Credentials OTP code!'], 401);
        }
        try {
            $expired = Carbon::parse($data->expired_otp)->toString();
            $now = Carbon::now()->toString();
            if ($data->is_verified == 1) {
                return response()->json(['status' => 'error', 'message' => 'Account was verified'], 204);
            }
            if ($expired < $now) {
                return response()->json(['status' => 'failed', 'message' => 'Verification OTP expired!'], 410);
            }
            $data->phone = $request->phone;
            $data->is_verified = 1;
            $data->phone_verified_at = Carbon::now();
            $data->save();
            if ($request->password) {
                return $this->login($request);
            }
            return response()->json(['status' => 'OK', 'data' => $data, 'message' => 'Success verification'], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function send_otp(Request $request)
    {   
        $data = User::where('email', $request->email)->first();
        $this->validate($request,[
            'phone' => 'unique:users,phone',
            'email' => 'required'
        ]);
        if (!$data) {
            return response()->json(['status' => 'error', 'message' => 'User Not Found'], 404);
        } else {
            try {
                if ($data->is_verified == 1) {
                    return response()->json(['status' => 'error', 'message' => 'Account was verified']);
                }
                if ($data->created_at_otp) {
                    $limit_otp = Carbon::parse($data->created_at_otp)->addMinutes(5)->toString();
                    $times_remaining = Carbon::parse($data->created_at_otp)->diffForHumans();
                    $now = Carbon::now()->toString();
                    if ($now < $limit_otp) {
                        return response()->json(['status' => 'failed', 'data' => $data, 'message' => 'Your request token is limit for 5 minutes, You was request OTP code ' . $times_remaining . '.'], 403);
                    }
                }
                $data->otp_verification = random_int(100000, 999999);
                $data->created_at_otp = Carbon::now();
                $data->expired_otp = Carbon::now()->addMinutes(5);
                $data->update();
                \Notification::route('whatsapp', 'WHATSAPP_SESSION')->notify(new OTPWhatsapp($data->phone, $data->otp_verification));
                return response()->json(['status' => 'OK', 'data' => $data, 'message' => 'Success send OTP'], 200);
            } catch (\Throwable $e) {
                return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
            }
        }
    }

    public function send_email(Request $request)
    {
        try {
            $data = User::where('email', $request->email)->first();
            if (!$data) {
                return response()->json(['status' => 'failed', 'message' => 'User not found or not verified'], 404);
            }
            if ($data->email_verified_at) {
                return response()->json(['status' => 'error', 'message' => 'Email was verified']);
            }
            Mail::to($data->email)->send(new VerifyEmail($data->email));

            return response()->json(['status' => 'success', 'message' => 'Success send email'], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function send_forgot_password(Request $request)
    {
        try {
            // $data = User::where('email', $request->email)->where('is_verified', 1)->first();
            $data = User::where('email', $request->email)->first();

            if(!$data){
                return response()->json(['status' => 'failed', 'message' => 'User not found'], 404);
                // return response()->json(['status' => 'failed', 'message' => 'User not found or not verified'], 404);
            }
            if($data->password_resets_token_created){
                $limit = Carbon::parse($data->password_resets_token_created)->addMinutes(10)->toString();
                $now = Carbon::now()->toString();
                if($now < $limit){
                    return response()->json(['status' => 'failed', 'message' => 'Your request is limit for 10 minutes'], 403);
                }
            }
            $data->password_resets_token = Str::random(8);
            $data->expired_password_resets_token = Carbon::now()->addMinutes(30);
            $data->password_resets_token_created = Carbon::now();
            $data->updated_at = Carbon::now();
            $data->update();

            Mail::to($data->email)->send(new ForgotPasswordMail($data->email, $data->password_resets_token));
            
            return response()->json(['status' => 'success', 'message' => 'Success send email'], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    // public function change_password(Request $request, $email = null)
    public function change_password(Request $request)
    {
        try {
            $this->validate($request, [
                'password' => 'required|min:8',
                'confirmPassword' => 'required_with:password|same:password',
            ]);
            // $data = User::where('email', $email)->where('is_verified', 1)->first();
            $data = User::where('email', $request->email)->first();
            if(!$data){
                return response()->json(['status' => 'failed', 'message' => 'User not found'], 404);
                // return response()->json(['status' => 'failed', 'message' => 'User not found or not verified'], 404);
            }
            
            $decrypted = Crypt::decrypt($request->token);
            $limit = Carbon::parse($data->expired_password_resets_token)->toString();
            $now = Carbon::now()->toString();

            if($data->password_resets_token != $decrypted && $now > $limit){
                return response()->json(['status' => 'failed', 'message' => 'Unvalid token'], 404);
            }
            if($request->password){
                $data->password = app('hash')->make($request->password);
                $data->updated_at = Carbon::now();
                $data->update();
                return response()->json(['status' => 'OK', 'data' => $data, 'message' => 'Success change password!'], 200);
            }   
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function verification_email(Request $request)
    {
        try {
            $data = User::where('email', $request->email)->first();

            if (!$data) {
                return response()->json(['status' => 'failed', 'message' => 'User not found'], 404);
            }
            if ($data->email_verified_at) {
                return response()->json(['status' => 'error', 'message' => 'Email was verified']);
            }

            $data->email_verified_at = Carbon::now();
            $data->update();

            return response()->json(['status' => 'OK', 'data' => $data, 'message' => 'Success verification'], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
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
            // 'email'             => 'required',
            'password'          => 'required|min:8',
            'credential'        => 'required'
        ]);

        $user = User::where('email', $request->credential)->orWhere('phone', $request->credential)->with('role')->first();

        // if (!$user) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        // if ($user->is_verified == 0) {
        //     return response()->json(['error' => 'Unauthorized', 'message' => 'User not verified'], 403);
        // }

        // $credentials = request(['email', 'password']);
        $credentials = [
            'email' => $user->email,
            'phone' => $user->phone,
            'password' => $request->password
        ];
        try {
            if (!$token = auth()->claims(['id' => $user->id, 'phone' => $user->phone, 'email' => $user->email,'email_verified_at' => $user->email_verified_at, 'role' => $user->role->name])->attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
        if ($user->is_verified == 0) {
            return response()->json(['error' => 'Unauthorized', 'message' => 'User not verified'], 403);
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
        try {
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60 * 12
            ]);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}
