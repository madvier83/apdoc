<?php

namespace App\Http\Controllers\Admin;

use App\Models\Blog;
use App\Models\BlogPhotos;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class blogPhotoController extends BaseController
{
    //
    protected $model = BlogPhotos::class,
    $viewName = "blogphoto",
    $rulesEdit = [
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
    ];

    public function index($id)
    {
        $models   = $this->model::orderBy('seed', 'asc')->where('blog_id', $id)->get();
        $blogName = Blog::where('id', $id)->get("name")->first()->name;

        return view("admin.{$this->viewName}.index", [
            'blog' => Blog::where('id', $id)->get(['id', 'name']),
            'blogName'  => $blogName,
            'models'    => $models,
            'viewName'  => $this->viewName
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048|dimensions:min_width=200,min_height=100',
        ]);
        
        $imageName = time() . '.' . $request->image->extension();
        $request->image->move(public_path('assets/images/blog/photo'), $imageName);

        $model               = new BlogPhotos;
        $model->name         = $request->name;
        $model->blog_id = $request->blog_id;
        $model->image        = $imageName;
        $model->seed         = $request->seed ? $request->seed : 1;
        $model->created_at   = Carbon::now();
        $model->updated_at   = Carbon::now();
        $model->save();

        return back()->with(['success' => 'Successfully Added Data']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data               = $this->model::find($id);
        $data->name         = $request->name;
        $data->blog_id = $request->blog_id;
        $data->seed         = $request->seed ? $request->seed : 1;
        //jika gambar diubah
        if ($request->image != null) {
            //jika gambar diubah hapus gambar terdahulu
            $olderImg = $this->model::find($id)->image;
            File::delete(public_path("assets/images/blog/photo/$olderImg"));

            //simpan gambar Baru
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('assets/images/blog/photo'), $imageName);

            $data->image = $imageName;
        }
        $data->save();

        return back()->with(['success' => 'successfully Updated Data']);
    }

    public function delete($id)
    {
        $imgPath = $this->model::find($id)->image;
        File::delete(public_path("assets/images/blog/photo/$imgPath"));
        $data = $this->model::find($id);
        $data->delete();
        return back()->with(['success' => 'successfully Deleted Data']);
   
    }
}