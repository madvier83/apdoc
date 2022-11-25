<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Response;
use Validator;
use Session;

class SettingController extends BaseController
{
    //
    protected $model = Setting::class;
    protected $viewName = 'settings';

    public function index(Request $request)
    {
        $models = $this->model::where('type', '!=', 'rich_text')->get();
        $wa = $this->model::where('key', '=', 'whatsapp_number')->first();
        $ma = $this->model::where('key', '=', 'map_address')->first();
        $lk = $this->model::where('key', '=', 'link_yt')->first();
        $em = $this->model::where('key', '=', 'email')->first();
        $ad = $this->model::where('key', '=', 'address')->first();
        $ig = $this->model::where('key', '=', 'instagram')->first();
        $tt = $this->model::where('key', '=', 'tiktok')->first();
        $fb = $this->model::where('key', '=', 'facebook')->first();
        $yt = $this->model::where('key', '=', 'youtube')->first();
        $ls = $this->model::where('key', '=', 'link_store')->first();
        $tw = $this->model::where('key', '=', 'twitter')->first();
        return view("admin.{$this->viewName}.index", [
            'models' => $models,
            'viewName' => $this->viewName,
            'wa' => $wa,
            'ma' => $ma,
            'lk' => $lk,
            'em' => $em,
            'ad' => $ad,
            'ig' => $ig,
            'tt' => $tt,
            'fb' => $fb,
            'yt' => $yt,
            'ls' => $ls,
            'tw' => $tw,
        ]);
    }

    public function store(Request $request)
    {
        $id = $request->id;
        $model = Setting::updateOrCreate(
            [
                'id' => $id
            ],
            [
                'key' => $request->keys,
                'type' => 'text',
                'value' => $request->text
            ]
        );
        return response()->json($model, 200);
    }
    public function edit(Request $request, $id)
    {
        $model = $this->model::findOrFail($id);
        return Response::json($model);
    }

    public function aboutus(){
        $models = DB::table('settings')->where('key', 'about_us')->orderBy('id', 'DESC')->first();
        return view("admin.aboutus.index",compact('models'));
    }

    public function postAboutus(Request $request){
        DB::table('settings')->updateOrInsert(
        ['key' => 'about_us', 'type' => 'longtext'],
        ['value' => $request->content]);
        return back()->with(['success' => 'Successfully Updated Data']);
    }
}