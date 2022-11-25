<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    //
    protected $model;
    protected $viewName;
    protected $validatedData;
    protected $currentData;
    protected $rules;
    protected $rulesChange;

    public function index(Request $request){

        $models = $this->model::all();
        return view("admin.{$this->viewName}.index", [
            'models' => $models,
            'viewName' => $this->viewName
        ]);

    }
    
    protected function formData(){}

    public function create(Request $request){

        $this->formData();
        return view("admin.{$this->viewName}.forms", [
            'viewName' => $this->viewName
        ]);

    }

    public function store(Request $request){

        $this->validatedData = $request->validate($this.rules);
        $this->beforeSave($request);
        $this->model::create($this->validatedData);
        $this->afterSave($request);
        return redirect()->back();

    }

    protected function beforeSave(Request $request){}

    protected function afterSave(Request $request){}

    public function edit(Request $request, $id){

        $model = $this->model::find($id);

        if(empty($model)){
            abort(404);
        }

        $this->formData();

        return view("admin.{$this->viewName}.forms", [
            'model' => $model,
            'viewName' => $this->viewName
        ]);
    }

    public function editWithModal(Request $request, $id)
    {
        $model = $this->model::where("id", $id)->get();

        return view("admin.{$this->viewName}.modals", [
            'model' => $model
        ]);
    }

    public function update(Request $request, $id){
        
        $this->validatedData = $request->validate($this->rulesEdit);
        $this->currentData = $this->model::find($id);
        $this->beforeSave($request);
        $this->currentData->update($this->validatedData);
        $this->currentData->save();
        $this->afterSave($request);
        return redirect()->route("admin.{$this->viewName}.index")->with(['success' => 'Successfully Updated data']);
    }

    public function destroy(Request $request,$id){

        $data = $this->model::find($id);
        $data->delete();
        return redirect()->route("admin.{$this->viewName}.index")->with(['success' => 'Successfully Deleted data']);

    }

    public function show($id){
        $data = $this->model::findOrFail($id);
        return view("admin.{$this->viewName}.modals", [
            "data" => $data,
            "viewName" => $this->viewName
        ]);
    }
}
