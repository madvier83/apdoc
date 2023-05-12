<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Throwable;

class ClinicController extends Controller
{
    public function index()
    {
        try {
            $clinic = Clinic::where('apdoc_id', auth()->user()->apdoc_id)->get();
    
            return response()->json($clinic);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function getByApdocId($id)
    {
        try {
            $clinic = Clinic::where('apdoc_id', $id)->get();
    
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
            $clinic = Clinic::find($id);

            return response()->json($clinic);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name'        => 'required',
            'address'     => 'required',
            'province'    => 'required',
            'city'        => 'required',
            'district'    => 'required',
            'postal_code' => 'required',
            'phone'       => 'required',
        ]);

        try {
            $data = $request->all();
            $data['apdoc_id'] = auth()->user()->apdoc_id;
            $clinic = Clinic::create($data);
    
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
            'name'        => 'required',
            'address'     => 'required',
            'province'    => 'required',
            'city'        => 'required',
            'district'    => 'required',
            'postal_code' => 'required',
            'phone'       => 'required',
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
            $clinic->delete();
    
            return response()->json(['message' => 'Clinic deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
