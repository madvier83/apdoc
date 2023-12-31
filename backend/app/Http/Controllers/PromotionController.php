<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Throwable;

class PromotionController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $promotion = Promotion::where('is_delete', false)->where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $promotion = Promotion::where(function($query) use ($keyword) {
                    $query->where('name', 'like', '%'.$keyword.'%')
                        ->orWhere('discount', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('is_delete', false)
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
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
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
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
            $promotion->fill(['is_delete' => true]);
            $promotion->save();
    
            return response()->json(['message' => 'Promotion deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
