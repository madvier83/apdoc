<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        //
    }

    public function show($id)
    {
        $setting = Setting::first();
        return response()->json($setting);
    }

    public function create(Request $request)
    {
        $setting = Setting::first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found!'], 404);
        }

        $this->validate($request, [
            'logo'        => 'image',
            'name'        => 'required',
            'phone'       => 'required',
            'address'     => 'required',
            'city'        => 'required',
            'country'     => 'required',
            'postal_code' => 'required',
        ]);

        $data = $request->all();

        if ($request->file('logo')) {
            $logo = time() . '_' . $request->file('logo')->getClientOriginalName();
            $data['logo'] = $request->file('logo')->move('img/setting/logo', $logo);
            File::delete($setting->logo);
        } else {
            $data['logo'] = null;
        }

        $setting->fill($data);

        $setting->save();
        return response()->json(Setting::first());
    }

    public function update(Request $request)
    {
       //
    }

    public function destroy($id)
    {
        //
    }
}
