<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Throwable;

class ClinikController extends Controller
{
    public function index()
    {
        try {
            $clinic = Clinic::all();
    
            return response()->json($clinic);
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
            'name'        => 'required|string',
            'address'     => 'required|string',
            'province'    => 'required|string',
            'city'        => 'required|string',
            'district'    => 'required|string',
            'postal_code' => 'required|string',
            'phone'       => 'required|string',
        ]);

        try {
            $data = $request->all();
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
            'name'        => 'required|string',
            'address'     => 'required|string',
            'province'    => 'required|string',
            'city'        => 'required|string',
            'district'    => 'required|string',
            'postal_code' => 'required|string',
            'phone'       => 'required|string',
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
