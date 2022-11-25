<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class blogCategoryController extends BaseController
{
    protected $model = BlogCategory::class;

    protected $viewName = "blogcategory";

    protected $rules = [
        "name" => "required|string",
        "parent_id" => "required|integer",
        "seed" => "required|integer",
        "slug" => "required|string"
    ];

    protected $rulesEdit = [];

    public function index(Request $request)
    {
        $models = $this->model;
        $parent = $this->model::where("parent_id", null)->get();

        return view("admin.{$this->viewName}.index", [
            'models' => $models,
            'parent' => $parent,
            'viewName' => $this->viewName
        ]);
    }

    public function store(Request $request)
    {
        $model = new BlogCategory;
        $model->name = $request->name;
        $model->parent_id = $request->parent_id;
        $model->seed = $request->seed;
        $model->slug = Str::slug($request->name);
        $model->created_at = Carbon::now();
        $model->updated_at = Carbon::now();
        $model->save();
        return back()->with(['success' => 'successfully Added Data']);
    }

    public function updateCategory(Request $request, $id)
    {
        $data = $this->model::find($id);
        $data->name = $request->name;
        $data->parent_id = $request->parent_id;
        $data->slug = Str::slug($request->name);
        $data->seed = $request->seed;

        $data->save();

        return back()->with(['success' => 'successfully Updated Data']);
    }
}
