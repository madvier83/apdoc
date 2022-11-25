<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProdukCategory;
use DB;
use Illuminate\Http\Request;
use App\Models\Produk;

class HomeProdukCategoryController extends Controller
{
    public function product()
    {
        $categoryParent = ProdukCategory::orderBy('name', 'asc')->get();
        $onlyParent = ProdukCategory::where('parent_id', '=',null)->get();
        $produks     = Produk::where('is_published', '=', '1')->get();
        $categoryModel  = ProdukCategory::class;
        // dd($produks);
        return view('frontend.products', compact('categoryParent', "produks", "categoryModel","onlyParent"));
    }
}
