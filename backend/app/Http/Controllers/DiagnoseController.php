<?php

namespace App\Http\Controllers;

use App\Models\Diagnose;
use Illuminate\Http\Request;
use Throwable;

class DiagnoseController extends Controller
{
    public function index($perPage)
    {
        try {
            $diagnose = Diagnose::where('clinic_id', auth()->user()->employee->clinic_id)->paginate($perPage);
    
            return response()->json($diagnose);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $diagnose = Diagnose::find($id);
    
            return response()->json($diagnose);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'code'        => 'required',
            'description' => 'required|string',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $diagnose = Diagnose::create($data);
    
            return response()->json($diagnose);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $diagnose = Diagnose::find($id);

        if (!$diagnose) {
            return response()->json(['message' => 'Diagnose not found!'], 404);
        }

        $this->validate($request, [
            'code'        => 'required',
            'description' => 'required|string',
        ]);

        try {
            $data = $request->all();
            $diagnose->fill($data);
            $diagnose->save();
    
            return response()->json($diagnose);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $diagnose = Diagnose::find($id);

        if (!$diagnose) {
            return response()->json(['message' => 'Diagnose not found!'], 404);
        }

        try {
            $diagnose->delete();
    
            return response()->json(['message' => 'Diagnose deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
