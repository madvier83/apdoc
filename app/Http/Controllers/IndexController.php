<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Headline;
use App\Models\ProdukCategory;
use Illuminate\Http\Request;

class IndexController Extends Controller
{
    public function index(){
    $dta = Headline::all();
    $headlines = Headline::where('is_published', '=', '1')->orderBy('seed', 'asc')->get();
    $products = \DB::table('produk_category')->join('produk', 'produk.category_id', '=', 'produk_category.id')
            ->where([
                ['produk.is_published', '=', '1'],
                ['produk.is_highlighted', '=', '1']
            ])->orderBy('produk.created_at','asc')->skip(0)->take(6)->get();
    $blogs = \DB::table('blog_category')->join('blog', 'blog.category_id', '=', 'blog_category.id')
            ->where([
                ['blog.is_published', '==', '1'],
                ['blog.is_highlighted', '==', '1']
            ])->orderBy('blog.created_at','asc')->get();
    $categoryModel  = ProdukCategory::class;
    return view('frontend.home', compact('headlines','dta','products','categoryModel','blogs'));
    }

    public function contactus(){
        return view('frontend.contactus');
    }

    public function aboutus(){
        return view('frontend.about-us');
    }

    public function dashboard(){
        return view('admin.dashboard');
    }

    public function profile(){
        return view('admin.profile');
    }

}
