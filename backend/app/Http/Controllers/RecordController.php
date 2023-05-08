<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Record;
use App\Models\RecordDiagnose;
use App\Models\RecordFile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Throwable;

class RecordController extends Controller
{
    public function index($clinic, $perPage, $keyword=null)
    {
        try {
            if ($keyword == null) {
                $record = Record::with('recordFiles', 'recordDiagnoses', 'recordDiagnoses.diagnose')->where('clinic_id', $clinic)->orderBy('updated_at', 'desc')->paginate($perPage);
            } else {
                $record = Record::with('recordFiles', 'recordDiagnoses', 'recordDiagnoses.diagnose')->where(function($query) use ($keyword) {
                    $query->where('complaint', 'like', '%'.$keyword.'%')
                        ->orWhere('inspection', 'like', '%'.$keyword.'%')
                        ->orWhere('therapy', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                        ->orWhereRelation('recordDiagnoses.diagnose', 'code', 'like', '%'.$keyword.'%')
                        ->orWhereRelation('recordDiagnoses.diagnose', 'description', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy('updated_at', 'desc')
                    ->paginate($perPage);
            }
    
            return response()->json($record);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function addImageRecord(Request $request, $record)
    {
        $record = Record::find($record);

        if (!$record) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        $this->validate($request, [
            'files' => 'required|image',
        ]);

        try {
            if ($request->file('files')) {
                $patient = Patient::find($record->patient_id);
    
                $recordFileName = time() . '_' . $request->file('files')->getClientOriginalName();
                $path = 'img/record/recordFile/' . $patient->nik . '/' . Carbon::now()->format('Y-m-d');
                $request->file('files')->move($path, $recordFileName);
    
                $recordFile = [
                    'record_id' => $record->id,
                    'file'      => $path . '/' . $recordFileName
                ];
    
                $recordFile = RecordFile::create($recordFile);
                return response()->json($recordFile);
            }
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function deleteImageRecord($id)
    {
        $recordFile = RecordFile::find($id);

        if (!$recordFile) {
            return response()->json(['message' => 'Record file not found!'], 404);
        }

        try {
            $recordFile->delete();
            File::delete($recordFile->file);
    
            return response()->json(['message' => 'Image deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($patient)
    {
        $record = Record::with('recordFiles', 'recordDiagnoses', 'recordDiagnoses.diagnose')->where("patient_id", $patient)->latest()->get();
        return response()->json($record);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'files'      => 'image',
            'patient_id' => 'required',
            'complaint'  => 'required',
            'inspection' => 'required',
            'therapy'    => 'required',
        ]);

        try {
            $data = $request->all();
            $data['clinic_id'] = auth()->user()->employee->clinic_id;
            $data['employee_id'] = auth()->user()->employee_id ?? null;
    
            $record = Record::create($data);
    
            // Record File
            if ($request->file('files')) {
                $patient = Patient::find($request->patient_id);
    
                // foreach ($request->file('files') as $data) {
                    $recordFileName = time() . '_' . $request->file('files')->getClientOriginalName();
                    $path = 'img/record/recordFile/' . $patient->nik . '/' . Carbon::now()->format('Y-m-d');
                    $request->file('files')->move($path, $recordFileName);
    
                    $recordFile = [
                        'record_id' => $record->id,
                        'file'      => $path . '/' . $recordFileName
                    ];
    
                    RecordFile::create($recordFile);
                // }
            }
            
            // Record Diagnosa
            if ($request->diagnoses) {
                $diagnose = json_decode($request->diagnoses);
                for ($i = 0; $i < count($diagnose); $i++) {
                    if ($diagnose[$i]) {
                        $data = [
                            'record_id'     => $record->id,
                            'diagnose_id'  => $diagnose[$i],
                        ];
                        RecordDiagnose::create($data);
                    }
                }
            }
    
            return response()->json($record);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $record = Record::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        $this->validate($request, [
            'files'      => 'image',
            'patient_id' => 'required',
            'complaint'  => 'required',
            'inspection' => 'required',
            'therapy'    => 'required',
        ]);

        try {
            $data = $request->all();
            $data['employee_id'] = auth()->user()->employee_id ?? null;
    
            $record->fill($data);
            $record->save();
    
            // Record File
            if ($request->file('files')) {
                foreach ($record->recordFiles as $rf) {
                    File::delete($rf->file);
                }
                RecordFile::where('record_id', $record->id)->delete();
    
                $patient = Patient::find($request->patient_id);
    
                // foreach ($request->file('files') as $data) {
                    $recordFileName = time() . '_' . $request->file('files')->getClientOriginalName();
                    $path = 'img/record/recordFile/' . $patient->nik . '/' . Carbon::now()->format('Y-m-d');
                    $request->file('files')->move($path, $recordFileName);
    
                    $recordFile = [
                        'record_id' => $record->id,
                        'file'      => $path . '/' . $recordFileName
                    ];
    
                    RecordFile::create($recordFile);
                // }
            }
    
            // Record Diagnosa
            if ($request->diagnoses) {
                RecordDiagnose::where('record_id', $record->id)->delete();
                $diagnose = json_decode($request->diagnoses);
                for ($i = 0; $i < count($diagnose); $i++) {
                    if ($diagnose[$i]) {
                        $data = [
                            'record_id'     => $record->id,
                            'diagnose_id'  => $diagnose[$i],
                        ];
                        RecordDiagnose::create($data);
                    }
                }
            } else {
                RecordDiagnose::where('record_id', $record->id)->delete();
            }
    
            return response()->json($record);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function updateEditable($id)
    {
        $record = Record::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        try {
            $record->fill(['is_editable' => ($record->is_editable == 0) ? 1 : 0]);
            $record->save();
    
            return response()->json(['message' => 'Record updated successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $record = Record::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        try {
            $record->fill(['is_delete' => true]);
            $record->save();
    
            return response()->json(['message' => 'Record deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
