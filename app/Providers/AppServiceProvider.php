<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Blog;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        view()->share('blogg', Blog::orderBy('created_at','desc')->skip(0)->take(6)->get());
        view()->share('blog', Blog::orderBy('created_at','desc')->skip(0)->take(4)->get());
        view()->share('newar', \App\Models\Produk::orderBy('created_at','desc')->skip(0)->take(4)->get());
        view()->share('blogCategory', \App\Models\BlogCategory::class);
        view()->share('blogCategoryChild',\App\Models\BlogCategory::whereNotNull('parent_id')->get());
        view()->share('produkCategory', \App\Models\ProdukCategory::class);
        view()->share('productCategoryChild',\App\Models\ProdukCategory::whereNotNull('parent_id')->get());
        view()->share('address', \App\Models\Setting::get('address'));
        view()->share('phone', \App\Models\Setting::get('whatsapp_number'));
        view()->share('email', \App\Models\Setting::get('email'));
        view()->share('maps', \App\Models\Setting::get('map_address'));
        view()->share('linkstore', \App\Models\Setting::get('link_store'));
        view()->share('aboutus', \App\Models\Setting::get('about_us'));
        view()->share('instagram', \App\Models\Setting::get('instagram'));
        view()->share('tiktok', \App\Models\Setting::get('tiktok'));
        view()->share('youtube', \App\Models\Setting::get('youtube'));
        view()->share('facebook', \App\Models\Setting::get('facebook'));
        view()->share('twitter', \App\Models\Setting::get('twitter'));
    }
}
