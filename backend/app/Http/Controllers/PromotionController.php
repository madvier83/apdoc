<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Throwable;

class PromotionController extends Controller
{
    public function index()
    {
        try {
            $promotion = Promotion::where('clinic_id', auth()->user()->employee->clinic_id)->get();
    
            return response()->json($promotion);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $promotion = Promotion::find($id);
    
            return response()->json($promotion);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name'     => 'required',
            'discount' => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $promotion = Promotion::create($data);
    
            return response()->json($promotion);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found!'], 404);
        }

        $this->validate($request, [
            'name'     => 'required',
            'discount' => 'required',
        ]);

        try {
            $data = $request->all();
            $promotion->fill($data);
            $promotion->save();
    
            return response()->json($promotion);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found!'], 404);
        }

        try {
            $promotion->delete();
    
            return response()->json(['message' => 'Promotion deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
