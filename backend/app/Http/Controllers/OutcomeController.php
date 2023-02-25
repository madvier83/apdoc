<?php

namespace App\Http\Controllers;

use App\Models\Outcome;
use Illuminate\Http\Request;

class OutcomeController extends Controller
{
    public function index()
    {
        $outcome = Outcome::with('categoryOutcome')->get();
        return response()->json($outcome);
    }

    public function show($id)
    {
        $outcome = Outcome::with('categoryOutcome')->find($id);
        return response()->json($outcome);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'category_outcome_id' => 'required',
            'nominal'             => 'required',
            'note'                => 'required',
        ]);

        $data = $request->all();
        $outcome = Outcome::create($data);

        return response()->json($outcome);
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

        $data = $request->all();

        $outcome->fill($data);

        $outcome->save();
        return response()->json($outcome);
    }

    public function destroy($id)
    {
        $outcome = Outcome::find($id);

        if (!$outcome) {
            return response()->json(['message' => 'Outcome not found!'], 404);
        }

        $outcome->delete();
        return response()->json(['message' => 'Outcome deleted successfully!']);
    }
}
