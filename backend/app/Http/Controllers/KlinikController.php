<?php

namespace App\Http\Controllers;

use App\Models\Klinik;
use Illuminate\Http\Request;

class KlinikController extends Controller
{
    public function index()
    {
        $klinik = Klinik::all();
        return response()->json($klinik);
    }

    public function show($id)
    {
        $klinik = Klinik::find($id);
        return response()->json($klinik);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name'        => 'required|string',
            'address'     => 'required|string',
            'province'    => 'required|string',
            'city'        => 'required|string',
            'district'    => 'required|string',
            'postal_code' => 'required|string',
            'phone'       => 'required|string',
        ]);

        $data = $request->all();
        $klinik = Klinik::create($data);

        return response()->json($klinik);
    }

    public function update(Request $request, $id)
    {
        $klinik = Klinik::find($id);

        if (!$klinik) {
            return response()->json(['message' => 'Klinik not found!'], 404);
        }

        $this->validate($request, [
            'name'        => 'required|string',
            'address'     => 'required|string',
            'province'    => 'required|string',
            'city'        => 'required|string',
            'district'    => 'required|string',
            'postal_code' => 'required|string',
            'phone'       => 'required|string',
        ]);

        $data = $request->all();

        $klinik->fill($data);

        $klinik->save();
        return response()->json($klinik);
    }

    public function destroy($id)
    {
        $klinik = Klinik::find($id);

        if (!$klinik) {
            return response()->json(['message' => 'Klinik not found!'], 404);
        }

        $klinik->delete();
        return response()->json(['message' => 'Klinik deleted successfully!']);
    }
}
