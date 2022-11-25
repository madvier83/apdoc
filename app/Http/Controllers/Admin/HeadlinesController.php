<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Headline;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class HeadlinesController extends BaseController
{
    protected $model = Headline::class;
    
    protected $viewName = 'headlines';

    public function index(Request $request)
    {
        $models = $this->model::all();
        return view("admin.{$this->viewName}.index", [
            'models' => $models,
            'viewName' => $this->viewName
        ]);
    }

    public function store(Request $request)
    {
        if ($request->is_published == "on") {
            $isPublished = 1;
        } else {
            $isPublished = 0;
        }

        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        //buat nama image berdasarkan waktu agar tidak terjadi duplikasi data
        $imageName = time() . '.' . $request->image->extension();
        // dd($imageName1, $imageName2);

        $request->image->move(public_path('assets/images/headline'), $imageName);

        $model = new Headline();
        $model->name = $request->name;
        $model->seed = $request->seed;
        $model->header = $request->header;
        $model->caption = $request->caption;
        $model->cta_button = $request->cta_button;
        $model->is_published = $isPublished;
        $model->target_url = str_replace('https://', '', $request->target_url);
        $model->image = $imageName;
        $model->created_at = Carbon::now();
        $model->updated_at = Carbon::now();
        $model->save();

        return back()->with(['success' => 'Successfully Added Data']);
    }

    public function delete(Request $request, $id)
    {
        $data = $this->model::find($id);
        $imgPath = $data->image;

        File::delete(public_path("assets/images/headline/$imgPath"));

        Parent::destroy($request, $id);

        return back()->with(['success' => 'successfully Deleted Data']);
    }

    public function updatePublish($id)
    {
        $status = $this->model::findOrFail($id);
        if ($status->is_published == 0) {
            $status->is_published = 1;
        } else {
            $status->is_published = 0;
        }
        $status->save();
    }

    public function update(Request $request, $id)
    {
        $data = $this->model::find($id);
        $data->name = $request->name;
        $data->seed = $request->seed;
        $data->header = $request->header;
        $data->caption = $request->caption;
        $data->cta_button = $request->cta_button;
        $data->target_url = $request->target_url;

        if ($request->image != null) {
            //jika gambar diubah hapus gambar terdahulu
            $imgData = $this->model::find($id);
            $olderImg = $imgData->image;

            File::delete(public_path("assets/images/headline/$olderImg"));

            //simpan gambar Baru
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('assets/images/headline'), $imageName);
            // dd($imageName, $olderImg);

            $data->image = $imageName;
        } else if ($request->image != null) {
            //jika gambar diubah hapus gambar terdahulu
            $imgData = $this->model::find($id);
            $olderImg = $imgData->image;

            File::delete(public_path("assets/images/headline/$olderImg"));

            //simpan gambar Baru
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('assets/images/headline'), $imageName);
            // dd($imageName, $olderImg);

            $data->image = $imageName;
        }

        $data->save();

        return back()->with(['success' => 'successfully Deleted Data']);
    }
}
