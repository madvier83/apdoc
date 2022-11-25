<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use DB;
use Illuminate\Http\Request;
use App\Models\Blog;

class HomeBlogCategoryController extends Controller
{
    public function blog()
    {
        $categoryParent = BlogCategory::orderBy('name', 'asc')->get();
        $latest = Blog::orderBy('created_at','desc')->get();
        $onlyParent = BlogCategory::where('parent_id', '=',null)->get();
        $blogs    = Blog::where('is_published', '=', '1')->get();
        $categoryModel  = BlogCategory::class;
        return view('frontend.blog', compact('categoryParent', "blogs", "categoryModel","onlyParent","latest"));
    }
    
    public function detail_blog($slug)
    {
        $name = DB::table('blog')->where(
            'slug',
            $slug
        )->first();
        $detail = DB::table('blog_category')->join('blog', 'blog_category.id', '=', 'blog.category_id')
            ->where('blog.slug', '=', $slug)
            ->select('blog.name as Nama', 'blog.image', 'blog.content', 'blog_category.*')->get();
        $related = DB::table('blog')->join('blog_category', 'blog.category_id', 'blog_category.id')
            ->where('blog_category.id', '=', $name->category_id)->where('blog.id', '!=', $name->id)->select('blog_category.name as categoryP', 'blog.slug', 'blog.image', 'blog.name' ,'blog.created_at')->get();
        $imagePhotos = DB::table('blog_photo')->join('blog', 'blog_photo.blog_id', 'blog.id')
            ->where('blog_photo.blog_id', '=', $name->id)->select('blog_photo.image', 'blog_photo.seed', 'blog_photo.name')->orderBy('blog_photo.seed', 'asc')->get();
        $heroImg = DB::table('blog')
            ->where('blog.slug', '=', $slug)->select('image')->get()[0]->image;
        return view('frontend.blog-detail', compact('detail','name', 'related', 'imagePhotos', 'heroImg'));
    }
}
