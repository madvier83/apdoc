<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Headline;
use App\Models\User;
use App\Models\ContactUs;
use App\Models\Setting;
use App\Models\Blog;
use App\Models\Produk;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(){
    $headlines = Headline::count();
    $contacts = ContactUs::count();
    $users = User::count();
    $settings = Setting::count();
    $blogs = Blog::count();
    $products = Produk::count();
    return view('admin.dashboard', compact('headlines', 'contacts', 'users', 'settings', 'blogs', 'products'));
    }   
}
