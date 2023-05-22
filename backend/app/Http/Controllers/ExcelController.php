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
        return Excel::import(new PatientImport, $request->file('file'));
    }
}
