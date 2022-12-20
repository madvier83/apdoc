<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;

class KlinikController extends Controller
{
    public function index()
    {
        $clinic = Clinic::all();
        return response()->json($clinic);
    }

    public function show($id)
    {
        $clinic = Clinic::find($id);
        return response()->json($clinic);
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
        $clinic = Clinic::create($data);

        return response()->json($clinic);
    }

    public function update(Request $request, $id)
    {
        $clinic = Clinic::find($id);

        if (!$clinic) {
            return response()->json(['message' => 'Clinic not found!'], 404);
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

        $clinic->fill($data);

        $clinic->save();
        return response()->json($clinic);
    }

    public function destroy($id)
    {
        $clinic = Clinic::find($id);

        if (!$clinic) {
            return response()->json(['message' => 'Clinic not found!'], 404);
        }

        $clinic->delete();
        return response()->json(['message' => 'Clinic deleted successfully!']);
    }
}
