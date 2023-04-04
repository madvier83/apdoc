<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use \Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Notifications\OTPWhatsapp;
use App\Events\VerifyEmail;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Events\ForgotPasswordMail;
use App\Models\Clinic;
use App\Models\Employee;
use App\Models\UserSlot;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Twilio\Rest\Client;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'string',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|min:8',
        ],[
            'name.string' => 'please input string character',
            'email.required' => 'fill email',
            'email.unique' => 'email was used',
            'email.email' => 'invalid email',
            'password' => 'fill password',
            'password.min' => 'minimum password 8 character'
        ]);
        if($validator->fails()){
            return response()->json(['status' => 'error', 'message' => 'unvalid data', 'errors' => $validator->errors()], 422);
        }
        try {
            $apdoc_id = time() . 'AP' . User::latest()->first()->id + 1;

            $clinic = Clinic::create([
                'name'        => null,
                'address'     => null,
                'province'    => null,
                'city'        => null,
                'district'    => null,
                'postal_code' => null,
                'phone'       => null,
                'apdoc_id'    => $apdoc_id,
            ]);

            $employee = Employee::create([
                'nik'         => null,
                'name'        => null,
                'birth_place' => null,
                'birth_date'  => null,
                'gender'      => null,
                'address'     => null,
                'phone'       => null,
                'position_id' => null,
                'clinic_id'   => $clinic->id,
            ]);

            $user = new User();
            $user->email       = $request->email;
            $user->password    = app('hash')->make($request->password);
            $user->role_id     = 2;
            $user->apdoc_id    = $apdoc_id;
            $user->employee_id = $employee->id;
            $user->save();

            // free slot
            for($i=0; $i<10; $i++) {
                UserSlot::create([
                    'apdoc_id' => $apdoc_id
                ]);
            }

            return response()->json(['status' => 'OK', 'data' => $user, 'message' => 'Success register!'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function verification_otp(Request $request)
    {
        $data = User::where('email', $request->email)->where('otp_verification', $request->otp_verification)->first();
        $validator = Validator::make($request->all(), [
            'phone' => 'unique:users,phone',
            'otp_verification' => 'required|min:6|numeric'
        ],[
            'phone.unique' => 'phone number was used',
            'otp_verification.required' => 'fill code',
            'otp_verification.min' => 'invalid code minimun 6',
            'otp_verificaton.numeric' => 'please input numeric character'
        ]);
        if($validator->fails()){
            return response()->json(['status' => 'error', 'message' => 'unvalid data', 'errors' => $validator->errors()], 422);
        }
        if (!$data) {
            return response()->json(['status' => 'failed', 'message' => 'Unathorized OTP Verification, Wrong Credentials OTP code!'], 422);
        }
        try {
            $expired = Carbon::parse($data->expired_otp)->toString();
            $now = Carbon::now()->toString();
            if ($data->is_verified == 1) {
                return response()->json(['status' => 'error', 'message' => 'Account was verified'], 200);
            }
            if ($expired < $now) {
                return response()->json(['status' => 'failed', 'message' => 'Verification OTP expired!'], 422);
            }
            $data->phone = $request->phone;
            $data->is_verified = 1;
            $data->phone_verified_at = Carbon::now();
            $data->save();
            if ($request->password) {
                return $this->login($request);
            }
            return response()->json(['status' => 'OK', 'data' => $data, 'message' => 'Success verification'], 200);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function send_otp(Request $request)
    {   
        $validator = Validator::make($request->all(), [
            'phone' => 'unique:users,phone',
            'email' => 'required'
        ],[
            'phone.unique' => 'phone number was used',
            'email.required' => 'fill email',
        ]);
        if($validator->fails()){
            return response()->json(['status' => 'error', 'message' => 'unvalid data', 'errors' => $validator->errors()], 422);
        }
        $data = User::where('email', $request->email)->first();
        if (!$data) {
            return response()->json(['status' => 'error', 'message' => 'user Not Found'], 404);
        } else {
            try {
                if ($data->is_verified == 1) {
                    return response()->json(['status' => 'error', 'message' => 'account was verified'], 422);
                }
                if ($data->created_at_otp) {
                    $limit_otp = Carbon::parse($data->created_at_otp)->addMinutes(5)->toString();
                    $times_remaining = Carbon::parse($data->created_at_otp)->diffForHumans();
                    $now = Carbon::now()->toString();
                    if ($now < $limit_otp) {
                        return response()->json(['status' => 'failed', 'data' => $data, 'message' => 'your request token is limit for 5 minutes, You was request OTP code ' . $times_remaining . '.'], 429);
                    }
                }
                $data->otp_verification = random_int(100000, 999999);
                $data->created_at_otp = Carbon::now();
                $data->expired_otp = Carbon::now()->addMinutes(5);
                $data->update();
                Notification::route('whatsapp', 'WHATSAPP_SESSION')->notify(new OTPWhatsapp($request->phone, $data->otp_verification));
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
                return response()->json(['status' => 'failed', 'message' => 'user not found or not verified'], 404);
            }
            if ($data->email_verified_at) {
                return response()->json(['status' => 'error', 'message' => 'email was verified'], 200);
            }
            Mail::to($data->email)->send(new VerifyEmail($data->email));

            return response()->json(['status' => 'success', 'message' => 'success send email'], 200);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function send_forgot_password(Request $request)
    {
        try {
            $data = User::where('email', $request->email)->first();

            if(!$data){
                return response()->json(['status' => 'failed', 'message' => 'user not found'], 404);
            }
            if($data->password_resets_token_created){
                $limit = Carbon::parse($data->password_resets_token_created)->addMinutes(10)->toString();
                $now = Carbon::now()->toString();
                if($now < $limit){
                    return response()->json(['status' => 'failed', 'message' => 'your request is limit for 10 minutes'], 429);
                }
            }
            $data->password_resets_token = Str::random(8);
            $data->expired_password_resets_token = Carbon::now()->addMinutes(30);
            $data->password_resets_token_created = Carbon::now();
            $data->updated_at = Carbon::now();
            $data->update();

            Mail::to($data->email)->send(new ForgotPasswordMail($data->email, $data->password_resets_token));
            
            return response()->json(['status' => 'success', 'message' => 'success send email'], 200);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function change_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password'          => 'required|min:8',
            'confirmPassword' => 'required_with:password|same:password'
        ],[
            'password.min' => 'minumum password character 8',
            'password.required' => 'fill password',
            'confirmPassword.required_with' => 'fill confirm password',
            'confirmPassword.same' => 'password doesnt match',
        ]);
        if($validator->fails()){
            return response()->json(['status' => 'error', 'message' => 'unvalid data', 'errors' => $validator->errors()], 422);
        }
        try {
            $data = User::where('email', $request->email)->first();
            if(!$data){
                return response()->json(['status' => 'failed', 'message' => 'user not found'], 404);
            }
            
            $decrypted = Crypt::decrypt($request->token);
            $limit = Carbon::parse($data->expired_password_resets_token)->toString();
            $now = Carbon::now()->toString();

            if($data->password_resets_token != $decrypted && $now > $limit){
                return response()->json(['status' => 'failed', 'message' => 'unvalid token'], 422);
            }
            if($request->password){
                $data->password = app('hash')->make($request->password);
                $data->updated_at = Carbon::now();
                $data->update();
                return response()->json(['status' => 'OK', 'data' => $data, 'message' => 'success change password!'], 200);
            }   
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function verification_email(Request $request)
    {
        try {
            $data = User::where('email', $request->email)->first();
            if (!$data) {
                return response()->json(['status' => 'failed', 'message' => 'user not found'], 404);
            }
            if ($data->email_verified_at) {
                return response()->json(['status' => 'error', 'message' => 'email was verified'], 422);
            }

            $data->email_verified_at = Carbon::now();
            $data->update();

            return response()->json(['status' => 'OK', 'data' => $data, 'message' => 'success verification'], 200);
        } catch (\Throwable $e) {
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

        return response()->json(['message' => 'successfully logged out']);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password'          => 'required|min:8',
            'credential'        => 'required'
        ],[
            'password.min' => 'minumum password character 8',
            'password.required' => 'fill password',
            'credential.required' => 'fill credential'
        ]);
        if($validator->fails()){
            return response()->json(['status' => 'error', 'message' => 'unvalid data', 'errors' => $validator->errors()], 422);
        }
        try {
            $user = User::where('email', $request->credential)->orWhere('phone', $request->credential)->with('role')->first();
            if(!$user){
                return response()->json(['status' => 'error', 'message' => 'the credentials you entered did not match our records.'], 422);
            }
            $credentials = [
                'email' => $user->email,
                'phone' => $user->phone,
                'password' => $request->password
            ];
            if ($user->is_verified == 0) {
                return response()->json(['status' => 'error', 'message' => 'user not verified'], 403);
            }
            if (!$token = auth()->claims(['id' => $user->id, 'phone' => $user->phone, 'email' => $user->email,'email_verified_at' => $user->email_verified_at, 'role_id' => $user->role_id, 'exp' => time() + (3600 * 12), 'accesses' => $user->role->accesses[0]->accesses])->attempt($credentials)) {
                return response()->json(['status'=> 'error', 'message' => 'unauthorized'], 401);
            }
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
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
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}