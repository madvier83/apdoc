<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Throwable;

class ServiceController extends Controller
{
    public function index($clinic, $perPage, $keyword=null)
    {
        try {
            if ($keyword == null) {
                $service = Service::where('clinic_id', $clinic)->orderBy('updated_at', 'desc')->paginate($perPage);
            } else {
                $service = Service::where(function($query) use ($keyword) {
                    $query->where('name', 'like', '%'.$keyword.'%')
                        ->orWhere('price', 'like', '%'.$keyword.'%')
                        ->orWhere('commission', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy('updated_at', 'desc')
                    ->paginate($perPage);
            }
    
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
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
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
