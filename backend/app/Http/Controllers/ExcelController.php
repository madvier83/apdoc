<?php

namespace App\Http\Controllers;

use App\Exports\PatientExport;
use App\Imports\PatientImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExcelController extends Controller
{
    public function exportPatient(Request $request) 
    {
        return Excel::download(new PatientExport($request), 'Patient.xlsx');
    }

    public function importPatient(Request $request)
    {
        $file = $request->file('file');

        if ($file) {
            Excel::import(new PatientImport, $file);

            return response()->json(['message' => 'Data imported successfully']);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }
}
