<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $service = Service::where('clinic_id', auth()->user()->employee->clinic_id)->get();
        return response()->json($service);
    }

    public function show($id)
    {
        $service = Service::find($id);
        return response()->json($service);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name'       => 'required|string',
            'price'      => 'required',
            'commission' => 'required',
        ]);

        $data = $request->all();
        $data['clinic_id'] = auth()->user()->employee->clinic_id;
        $service = Service::create($data);

        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found!'], 404);
        }

        $this->validate($request, [
            'name'       => 'required|string',
            'price'      => 'required',
            'commission' => 'required',
        ]);

        $data = $request->all();

        $service->fill($data);

        $service->save();
        return response()->json($service);
    }

    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found!'], 404);
        }

        $service->delete();
        return response()->json(['message' => 'Service deleted successfully!']);
    }
}
