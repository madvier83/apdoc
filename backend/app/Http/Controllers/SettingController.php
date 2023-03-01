<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

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
        //
    }

    public function update(Request $request, $id)
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

        if($request->file('logo')) {
            $data['logo'] = $request->file('logo')->store('setting/logo');
        } else {
            $data['logo'] = null;
        }

        $setting->fill($data);

        $setting->save();
        return response()->json($setting);
    }

    public function destroy($id)
    {
        //
    }
}
