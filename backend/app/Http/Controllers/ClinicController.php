<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\Setting;
use App\Models\UserSlot;
use Illuminate\Http\Request;
use Throwable;

class ClinicController extends Controller
{
    public function index()
    {
        try {
            $clinic = Clinic::with(['province', 'city', 'district', 'village'])->where('apdoc_id', auth()->user()->apdoc_id)->where('is_delete', false)->get();
    
            return response()->json($clinic);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function getByApdocId($id)
    {
        try {
            $clinic = Clinic::with(['province', 'city', 'district', 'village'])->where('apdoc_id', $id)->where('is_delete', false)->get();
    
            return response()->json($clinic);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function updateStatus($id)
    {
        $clinic = clinic::find($id);

        if (!$clinic) {
            return response()->json(['message' => 'Clinic not found!'], 404);
        }

        try {
            $data = [
                'status' => ($clinic->status == 'pending') ? 'active' : 'pending'
            ];
            $clinic->fill($data);
            $clinic->save();
    
            return response()->json(['message' => 'Clinic updated successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $clinic = Clinic::with(['province', 'city', 'district', 'village'])->find($id);

            return response()->json($clinic);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
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
            $data['apdoc_id'] = auth()->user()->apdoc_id;
            $clinic = Clinic::create($data);

            Setting::create([
                'logo'        => null,
                'name'        => $clinic->name,
                'phone'       => $clinic->phone,
                'province_id' => $clinic->province_id,
                'city_id'     => $clinic->city_id,
                'district_id' => $clinic->district_id,
                'village_id'  => $clinic->village_id,
                'address'     => $clinic->address,
                'rt'          => $clinic->rt,
                'rw'          => $clinic->rw,
                'postal_code' => $clinic->postal_code,
                'clinic_id'   => $clinic->id
            ]);

            for($i=0; $i<10; $i++) {
                UserSlot::create([
                    'clinic_id' => $clinic->id
                ]);
            }
    
            return response()->json($clinic);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $clinic = Clinic::find($id);

        if (!$clinic) {
            return response()->json(['message' => 'Clinic not found!'], 404);
        }

        $this->validate($request, [
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
            $clinic->fill($data);
            $clinic->save();
    
            return response()->json($clinic);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $clinic = Clinic::find($id);

        if (!$clinic) {
            return response()->json(['message' => 'Clinic not found!'], 404);
        }

        try {
            // $clinic->delete();
            $clinic->fill(['is_delete' => true]);
            $clinic->save();
    
            return response()->json(['message' => 'Clinic deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
