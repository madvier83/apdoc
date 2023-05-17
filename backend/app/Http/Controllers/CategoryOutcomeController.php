<?php

namespace App\Http\Controllers;

use App\Models\CategoryOutcome;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Throwable;

class CategoryOutcomeController extends Controller
{
    public function index($clinic, $perPage, $keyword=null)
    {
        try {
            if ($keyword == null) {
                $category = CategoryOutcome::with('outcomes')->where('clinic_id', $clinic)->orderBy('updated_at', 'desc')->paginate($perPage);
            } else {
                $category = CategoryOutcome::with('outcomes')->where(function($query) use ($keyword) {
                    $query->where('name', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy('updated_at', 'desc')
                    ->paginate($perPage);
            }
    
            return response()->json($category);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $category = CategoryOutcome::with('outcomes')->find($id);
    
            return response()->json($category);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
        ]);

        $unique = CategoryOutcome::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('name', $request->name)->first();

        if ($unique) {
            return response()->json(['message' => 'The name has already been taken.'], 422);
        }

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $category = CategoryOutcome::create($data);
    
            return response()->json($category);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $category = CategoryOutcome::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found!'], 404);
        }

        $this->validate($request, [
            'name' => 'required|string',
        ]);

        if($category->name != $request->name) {
            $unique = CategoryOutcome::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('name', $request->name)->first();

            if ($unique) {
                return response()->json(['message' => 'The name has already been taken.'], 422);
            }
        }

        try {
            $data = $request->all();
            $category->fill($data);
            $category->save();
    
            return response()->json($category);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $category = CategoryOutcome::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found!'], 404);
        }

        try {
            $category->delete();
            Outcome::where('category_outcome_id', $id)->update(['category_outcome_id' => null]);
    
            return response()->json(['message' => 'Category deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
