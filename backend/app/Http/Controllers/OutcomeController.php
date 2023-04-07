<?php

namespace App\Http\Controllers;

use App\Models\Outcome;
use Illuminate\Http\Request;
use Throwable;

class OutcomeController extends Controller
{
    public function index()
    {
        try {
            $outcome = Outcome::with('categoryOutcome')->where('clinic_id', auth()->user()->employee->clinic_id)->get();
    
            return response()->json($outcome);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $outcome = Outcome::with('categoryOutcome')->find($id);
    
            return response()->json($outcome);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'category_outcome_id' => 'required',
            'nominal'             => 'required',
            'note'                => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $outcome = Outcome::create($data);
    
            return response()->json($outcome);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $outcome = Outcome::find($id);

        if (!$outcome) {
            return response()->json(['message' => 'Outcome not found!'], 404);
        }

        $this->validate($request, [
            'category_outcome_id' => 'required',
            'nominal'             => 'required',
            'note'                => 'required',
        ]);

        try {
            $data = $request->all();
            $outcome->fill($data);
            $outcome->save();
    
            return response()->json($outcome);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $outcome = Outcome::find($id);

        if (!$outcome) {
            return response()->json(['message' => 'Outcome not found!'], 404);
        }

        try {
            $outcome->delete();
    
            return response()->json(['message' => 'Outcome deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
