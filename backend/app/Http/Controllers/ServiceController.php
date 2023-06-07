<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Throwable;

class ServiceController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'updated_at';
        $order  = $request->order ?? 'desc';

        try {
            if ($keyword == null) {
                $service = Service::with('categoryService')->where('is_delete', false)->where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $service = Service::with('categoryService')->where(function($query) use ($keyword) {
                    $query->where('code', 'like', '%'.$keyword.'%')
                        ->orWhere('name', 'like', '%'.$keyword.'%')
                        ->orWhere('price', 'like', '%'.$keyword.'%')
                        ->orWhere('commission', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('is_delete', false)
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
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
        $unique = Service::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('code', $request->code)->first();

        if ($unique) {
            return response()->json(['message' => 'The code has already been taken.'], 400);
        }

        $this->validate($request, [
            'code'       => 'required',
            'name'       => 'required',
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
            'code'       => 'required',
            'name'       => 'required',
            'price'      => 'required',
            'commission' => 'required',
        ]);

        if($service->code != $request->code) {
            $unique = Service::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('code', $request->code)->first();
    
            if ($unique) {
                return response()->json(['message' => 'The code has already been taken.'], 400);
            }
        }

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
            // $service->delete();
            $service->fill(['is_delete' => true]);
            $service->save();
    
            return response()->json(['message' => 'Service deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
