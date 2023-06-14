<?php

namespace App\Http\Controllers;

use App\Exports\DiagnoseExport;
use App\Exports\EmployeeExport;
use App\Exports\ItemExport;
use App\Exports\PatientExport;
use App\Exports\PositionExport;
use App\Imports\EmployeeImport;
use App\Imports\ItemImport;
use App\Imports\PatientImport;
use App\Imports\PositionImport;
use App\Models\Position;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExcelController extends Controller
{
    // DIAGNOSE
    public function exportDiagnose(Request $request) 
    {
        return Excel::download(new DiagnoseExport($request), 'Diagnose.xlsx');
    }

    public function importDiagnose(Request $request)
    {
        $file = $request->file('file');

        if ($file) {
            Excel::import(new PatientImport($request), $file);

            return response()->json(['message' => 'Data imported successfully']);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }

    // POSITION

    public function exportPosition(Request $request) 
    {
        return Excel::download(new PositionExport($request), 'Position.xlsx');
    }

    public function importPosition(Request $request)
    {
        $file = $request->file('file');

        if ($file) {
            Excel::import(new PositionImport($request), $file);

            return response()->json(['message' => 'Data imported successfully']);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }

    // EMPLOYEE

    public function exportEmployee(Request $request) 
    {
        return Excel::download(new EmployeeExport($request), 'Employee.xlsx');
    }

    public function importEmployee(Request $request)
    {
        $file = $request->file('file');

        if ($file) {
            Excel::import(new EmployeeImport($request), $file);

            return response()->json(['message' => 'Data imported successfully']);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }

    // PATIENT

    public function exportPatient(Request $request) 
    {
        return Excel::download(new PatientExport($request), 'Patient.xlsx');
    }

    public function importPatient(Request $request)
    {
        $file = $request->file('file');

        if ($file) {
            Excel::import(new PatientImport($request), $file);

            return response()->json(['message' => 'Data imported successfully']);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }

    // ITEM

    public function exportItem(Request $request) 
    {
        return Excel::download(new ItemExport($request), 'Item.xlsx');
    }

    public function importItem(Request $request)
    {
        $file = $request->file('file');

        if ($file) {
            Excel::import(new ItemImport($request), $file);

            return response()->json(['message' => 'Data imported successfully']);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }
}
