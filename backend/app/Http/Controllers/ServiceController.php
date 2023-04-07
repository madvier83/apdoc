<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Throwable;

class ServiceController extends Controller
{
    public function index()
    {
        try {
            $service = Service::where('clinic_id', auth()->user()->employee->clinic_id)->get();
    
            return response()->json($service);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $service = Service::find($id);
    
            return response()->json($service);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name'       => 'required|string',
            'price'      => 'required',
            'commission' => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $service = Service::create($data);
    
            return response()->json($service);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
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

        try {
            $data = $request->all();
            $service->fill($data);
            $service->save();
    
            return response()->json($service);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found!'], 404);
        }

        try {
            $service->delete();
    
            return response()->json(['message' => 'Service deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
