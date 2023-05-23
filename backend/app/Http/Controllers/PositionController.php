<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;
use Throwable;

class PositionController extends Controller
{
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'updated_at';
        $order  = $request->order ?? 'desc';

        try {
            if ($keyword == null) {
                $position = Position::where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $position = Position::where(function($query) use ($keyword) {
                    $query->where('name', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }

            return response()->json($position);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $position = Position::find($id);

            return response()->json($position);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:32',
        ]);

        $unique = Position::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('name', $request->name)->first();

        if ($unique) {
            return response()->json(['message' => 'The name has already been taken.'], 422);
        }

        try {
            $data = $request->all();
            $data['clinic_id'] = $request->clinic_id ?? auth()->user()->employee->clinic_id;
            $position = Position::create($data);
    
            return response()->json($position);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
        
    }

    public function update(Request $request, $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found!'], 404);
        }

        $this->validate($request, [
            'name' => 'required|string',
        ]);

        if($position->name != $request->name) {
            $unique = Position::where('clinic_id', $request->clinic_id ?? auth()->user()->employee->clinic_id)->where('name', $request->name)->first();
    
            if ($unique) {
                return response()->json(['message' => 'The name has already been taken.'], 422);
            }
        }

        try {
            $data = $request->all();
            $position->fill($data);
            $position->save();

            return response()->json($position);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found!'], 404);
        }

        try {
            $position->delete();
            Employee::where('position_id', $id)->update(['position_id' => null]);
            
            return response()->json(['message' => 'Position deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
