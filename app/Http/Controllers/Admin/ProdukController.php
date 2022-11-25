<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\Produk;
use App\Models\ProdukCategory;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Carbon\Carbon;
use phpDocumentor\Reflection\Types\Parent_;


class ProdukController extends BaseController
{
    //
    protected $model = Produk::class,
    $viewName = "product",
    $rulesEdit = [
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048' 
    ];

    public function index(Request $request){
        
        $models = $this->model::orderBy('id','DESC')->get();
        $model = Produk::class;
        $category = ProdukCategory::all();

        return view("admin.{$this->viewName}.index", [
            'models' => $models,
            'model' => $model,
            'category' => $category,
            'viewName' => $this->viewName,

        ]);
    }

    public function store(Request $request){
        
        if($request->is_published == "on"){
            $isPublished = 1;
        }
        else{
            $isPublished = 0;    
        }

        if($request->is_highlighted == "on"){
            $isHighlighted = 1;
        }
        else{
            $isHighlighted = 0;
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048' 
        ]);

        $imageName = time().'.'.$request->image->extension();

        $request->image->move(public_path('assets/images/product'),$imageName);
        
        $model = new Produk;
        $model->name = $request->name;
        $model->image = $imageName;
        $model->price = $request->price;
        $model->link_to_olsera = $request->link_to_olsera;
        $model->category_id = $request->category_id;
        $model->slug = Str::slug($request->name, '-');
        $model->is_published = $isPublished;
        $model->is_highlighted = $isHighlighted;
        $model->created_at = Carbon::now();
        $model->updated_at = Carbon::now();
        $model->save();

        return back()->with(['success' => 'Successfully Added Data']);
    }

    public function delete(Request $request, $id)
    {
        $imgPath = $this->model::find($id)->image;

        File::delete(public_path("assets/images/product/$imgPath"));

        Parent::destroy($request, $id);

        return back()->with(['success' => 'successfully Deleted Data']);
    }

    public function updatePublish($id){

        $status = $this->model::findOrFail($id);

        if ($status->is_published == 1 ) {
            if ($status->is_published == 0) {
                $status->is_published = 1;
            } else{
                $status->is_published = 0;
                $status->is_highlighted = 0;
            }
        }else {
            if ($status->is_published == 0) {
                $status->is_published = 1;
            } else{
                $status->is_published = 0;
            }
        }
        $status->save();
    }

    public function checkPublish($id)
    {
        $status = $this->model::findOrFail($id);

        if ($status->is_published == 1) {
            return "Published";
        }else{
            return "not_Published";
        }
    }
    
    public function checkHighlight($id)
    {
        $status = $this->model::findOrFail($id);

        if ($status->is_highlighted == 1) {
            return "Highlighted";
        }else{
            return "not_Highlighted";
        }
    }

    public function updateHighlight($id)
    {
        $status = $this->model::findOrFail($id);

        if ($status->is_published == 0) {
            if ($status->is_highlighted == 0) {
                $status->is_highlighted = 1;
                $status->is_published = 1;
            } else {
                $status->is_highlighted = 0;
            }
        }else {
            if ($status->is_highlighted == 0) {
                $status->is_highlighted = 1;
            } else {
                $status->is_highlighted = 0;
            }
        }

        $status->save();
    }

    public function updatePort(Request $request, $id)
    {
        $data = $this->model::find($id);
        $data->name = $request->name;
        $data->price = $request->price;
        $data->link_to_olsera = $request->link_to_olsera;
        $data->category_id = $request->category_id;
        $data->slug = Str::slug($request->name, '-');

        //jika gambar diubah
        if ($request->image != null) {
            //jika gambar diubah hapus gambar terdahulu
            $olderImg = $this->model::find($id)->image;
            File::delete(public_path("assets/images/product/$olderImg"));

            //simpan gambar Baru
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('assets/images/product'), $imageName);
            // dd($imageName, $olderImg);

            $data->image = $imageName;
        }
        $data->save();

        return back()->with(['success' => 'Successfully Updated Data']);
    }
}
