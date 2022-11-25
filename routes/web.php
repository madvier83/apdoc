<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\HomeProdukCategoryController;
use App\Http\Controllers\HomeBlogCategoryController;
use App\Http\Controllers\HomeCategoryController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HeadlinesController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ContactUsController;
use App\Http\Controllers\Admin\ProdukController;
use App\Http\Controllers\Admin\produkCategoryController;
use App\Http\Controllers\Admin\blogCategoryController;
use App\Http\Controllers\Admin\blogController;
use App\Http\Controllers\Admin\blogPhotoController;
use App\Models\ProdukCategory;
use App\Models\Produk;
use App\Models\BlogCategory;
use App\Models\Blog;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});

Route::get('/', [IndexController::class, 'index'])->name('home');

// About Us
Route::get('/about-us',[IndexController::class,'aboutus'])->name('aboutus');

// Contact Us
Route::get('/contact-us', [IndexController::class, 'contactus'])->name('contactus');
Route::post('/contact-us/store',[ContactUsController::class, 'store'])->name('contactus.store');

// Blog Category
Route::get('/blog',[HomeBlogCategoryController::class,'blog'])->name('blogs');
Route::get('/blog/category/{slug}',[HomeCategoryController::class, 'indexblog'])->name('blogcategory');
Route::get('/blog/category/detail/{slug}',[HomeBlogCategoryController::class, 'detail_blog'])->name('blogdetail');

// Product Category
Route::get('/product', [HomeProdukCategoryController::class, 'product'])->name('products');
Route::get('/product/category/{slug}', [HomeCategoryController::class, 'indexproduct'])->name('productcategory');

// Login Route
Route::get('auth',[authController::class, 'login'])->name('login');
Route::post('/signin',[authController::class, 'postLogin'])->name('signin');
Route::get('logout',[authController::class, 'logout'])->name('logout');

//Admin Dashboard
Route::group([
    'as' => 'admin.', 'prefix' => 'dashboard', 'namespace' => 'dashboard', 'middleware' => 'auth'
], function(){
    Route::get('/',[DashboardController::class, 'index'])->name('dashboard');
    // Profile
    Route::get('/profile/{id}',[UsersController::class, 'changePassword'])->name('profile');
    Route::put('/profile/update/{id}',[UsersController::class, 'postPassword'])->name('users.change');
    //Users
    Route::group(['middleware'=> 'cekRoles:super_admin,user_admin'], function(){
    Route::get('/users',[UsersController::class, 'index'])->name('users.index');
    Route::post('/users/store',[UsersController::class, 'store'])->name('users.create');
    Route::get('/users/show/{id}',[UsersController::class, 'show'])->name('users.show');
    Route::put('/users/update/{id}',[UsersController::class, 'postPassword'])->name('users.update');
    Route::delete('/users/{id}',[UsersController::class, 'destroy'])->name('users.delete');
    Route::get('/users/resetPassword/{id}',[UsersController::class, 'resetPassword'])->name('users.resetPassword');
    });
    // Headliness
    Route::get('/headlines',[HeadlinesController::class, 'index'])->name('headlines.index');
    Route::post('/headlines/store', [HeadlinesController::class, 'store'])->name('headlines.store');
    Route::delete('/headlines/delete/{id}', [HeadlinesController::class, 'delete'])->name('headlines.delete');
    Route::get('/headlines/updatePublish/{id}', [HeadlinesController::class, 'updatePublish'])->name('headlines.updatePublish');
    Route::get('/headlines/show/{id}', [HeadlinesController::class, 'show'])->name('headlines.show');
    Route::put('/headlines/update/{id}', [HeadlinesController::class, 'update'])->name('headlines.update');
    // Contact Us
    Route::get('/contactus',[ContactUsController::class, 'index'])->name('contactus.index');
    Route::delete('/contactus/delete/{id}',[ContactUsController::class, 'destroy'])->name('contactus.delete');
    // Settings
    Route::get('settings',[SettingController::class, 'index'])->name('settings.index');
    Route::get('settings/edit/{id}',[SettingController::class,'edit'])->name('settings.show');
    Route::post('/settings/post',[SettingController::class, 'store'])->name('settings.store');
    Route::put('settings/update/{id}',[SettingController::class,'update'])->name('settings.update');
    Route::delete('/settings/delete/{id}',[SettingController::class, 'destroy'])->name('settings.delete');
    // Produk
    Route::get('product',[ProdukController::class,'index'])->name('product.index');
    Route::post('product/store',[ProdukController::class,'store'])->name('product.store');
    Route::delete('product/delete/{id}',[ProdukController::class,'destroy'])->name('product.delete');
    Route::put('product/update/{id}',[ProdukController::class,'updatePort'])->name('product.update');
    Route::get('product/updatePublish/{id}',[ProdukController::class,'updatePublish'])->name('product.updatePublish');
    Route::get('product/updateHighlight/{id}',[ProdukController::class,'updateHighlight'])->name('product.updateHighlight');
    Route::get('product/checkPublish/{id}',[ProdukController::class,'checkPublish'])->name('product.checkPublish');
    Route::get('product/checkHighlight/{id}',[ProdukController::class,'checkHighlight'])->name('product.checkHighlight');
    Route::get('product/show/{id}',[ProdukController::class,'show'])->name('product.show');
    // Produk Category
    Route::get('product-category',[produkCategoryController::class,'index'])->name('productcategory.index');
    Route::post('product-category/store',[produkCategoryController::class,'store'])->name('productcategory.store');
    Route::get('product-category/show/{id}',[produkCategoryController::class,'show'])->name('productcategory.show');
    Route::put('product-category/update/{id}',[produkCategoryController::class,'updateCategory'])->name('productcategory.update');
    Route::delete('product-category/delete/{id}',[produkCategoryController::class,'destroy'])->name('productcategory.delete');
    // Blog
    Route::get('blog',[blogController::class,'index'])->name('blog.index');
    Route::post('blog/store',[blogController::class,'store'])->name('blog.store');
    Route::delete('blog/delete/{id}',[blogController::class,'destroy'])->name('blog.delete');
    Route::put('blog/update/{id}',[blogController::class,'updatePort'])->name('blog.update');
    Route::get('blog/updatePublish/{id}',[blogController::class,'updatePublish'])->name('blog.updatePublish');
    Route::get('blog/updateHighlight/{id}',[blogController::class,'updateHighlight'])->name('blog.updateHighlight');
    Route::get('blog/checkPublish/{id}',[blogController::class,'checkPublish'])->name('blog.checkPublish');
    Route::get('blog/checkHighlight/{id}',[blogController::class,'checkHighlight'])->name('blog.checkHighlight');
    Route::get('blog/show/{id}',[blogController::class, 'show'])->name('blog.show');
    // Produk Category
    Route::get('blog-category',[blogCategoryController::class,'index'])->name('blogcategory.index');
    Route::post('blog-category/store',[blogCategoryController::class,'store'])->name('blogcategory.store');
    Route::get('blog-category/show/{id}',[blogCategoryController::class,'show'])->name('blogcategory.show');
    Route::put('blog-category/update/{id}',[blogCategoryController::class,'updateCategory'])->name('blogcategory.update');
    Route::delete('blog-category/delete/{id}',[blogCategoryController::class,'destroy'])->name('blogcategory.delete');
    // Blog Photo
    Route::get('blog-photo/{id}', [blogPhotoController::class, 'index'])->name('blogphoto.index');
    Route::post('blog-photo/store', [blogPhotoController::class, 'store'])->name('blogphoto.store');
    Route::delete('blog-photo/delete/{id}', [blogPhotoController::class, 'delete'])->name('blogphoto.delete');
    Route::post('blog-photo/store', [blogPhotoController::class, 'store'])->name('blogphoto.store');
    Route::put('blog-photo/update/{id}', [blogPhotoController::class, 'update'])->name('blogphoto.update');
    Route::get('blog-photo/show/{id}', [blogPhotoController::class, 'show'])->name('blogphoto.show');
    // About us
    Route::get('aboutus',[SettingController::class,'aboutus'])->name('aboutus.index');
    Route::put('aboutus',[SettingController::class,'postAboutus'])->name('aboutus.update');
});