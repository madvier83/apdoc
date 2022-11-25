<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Auth;
use Session;

class authController extends Controller
{
    public function login(){
        return view('admin.login');
    }

    public function postLogin(Request $request){

        $username = $request->username;
        $password = $request->password;
        
        $user=Auth::attempt(['username' => $username, 'password' => $password]);
        
        if(!$user){
            Session::flash('fail', 'Username or Password isn`t matched with our database');
            return back();
        }
        return redirect()->route('admin.dashboard');

    }

    public function logout(){
        Auth::logout();
        Session::flush();
        return redirect()->route('login');
    }
}
