<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ProdukCategory;
use App\Models\BlogCategory;
use App\Models\Blog;
use DB;

class HomeCategoryController extends Controller
{
    // product
    public function indexproduct($slug){
        $getName = ProdukCategory::where('slug', '=', $slug)->select('name')->first();
        $byCategory = DB::table('produk')->join('produk_category', 'produk.category_id', 'produk_category.id')
            ->where('produk_category.slug', '=', $slug)
            ->select('produk_category.name', 'produk.image', 'produk.name as nameProduct', 'produk.slug', 'produk.price','produk.link_to_olsera', 'produk.is_published')->get();
        return view('frontend.byCategoryproduct.index', [
            'getName' => $getName,
            'byCategory' => $byCategory
        ]);
    }
    // blog
    public function indexblog($slug){
        $getName = BlogCategory::where('slug', '=', $slug)->select('name')->first();
        $byCategory = DB::table('blog')->join('blog_category', 'blog.category_id', 'blog_category.id')
            ->where('blog_category.slug', '=', $slug)
            ->select('blog_category.name', 'blog.image','blog.created_at','blog.content', 'blog.name as blogName', 'blog.slug', 'blog.is_published')->get();
        $latest = Blog::orderBy('created_at','desc')->get();
        return view('frontend.byCategoryblog.index', [
            'getName' => $getName,
            'byCategory' => $byCategory,
            'latest' => $latest
        ]);
    }
}
