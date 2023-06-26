<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Throwable;

class SettingController extends Controller
{
    public function index()
    {
        //
    }

    public function show($clinic)
    {
        try {
            $setting = Setting::where('clinic_id', $clinic)->first();
    
            return response()->json($setting);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
       //
    }

    public function update(Request $request, $id)
    {
        $setting = Setting::find($id);

        if (!$setting) {
            return response()->json(['message' => 'Setting not found!'], 404);
        }

        $this->validate($request, [
            'logo'              => 'image',
            'name'              => 'required',
            'phone'             => 'required',
            'province_id'       => 'required',
            'city_id'           => 'required',
            'district_id'       => 'required',
            'village_id'        => 'required',
            'address'           => 'required',
            'rt'                => 'required',
            'rw'                => 'required',
            'postal_code'       => 'required',
        ]);

        try {
            $data = $request->all();
    
            if ($request->file('logo')) {
                $logo = time() . '_' . $request->file('logo')->getClientOriginalName();
                $data['logo'] = $request->file('logo')->move('img/setting/logo', $logo);
                File::delete($setting->logo);
            }
    
            $setting->fill($data);
            $setting->save();
    
            return response()->json($setting);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        //
    }
}
