<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Record;
use App\Models\RecordDiagnose;
use App\Models\RecordFile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class RecordController extends Controller
{
    public function index()
    {
        $record = Record::with('recordFiles', 'recordDiagnoses', 'recordDiagnoses.diagnose')->get();
        return response()->json($record);
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
    }

    public function deleteImageRecord($id)
    {
        $recordFile = RecordFile::find($id);
        File::delete($recordFile->file);
        return response()->json(['message' => 'Image deleted successfully!']);
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

        $data = $request->all();
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
    }

    public function updateEditable($id)
    {
        $record = Record::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        $record->fill(['is_editable' => ($record->is_editable == 0) ? 1 : 0]);
        $record->save();
        return response()->json(['message' => 'Record updated successfully!']);
    }

    public function destroy($id)
    {
        $record = Record::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        // foreach($record->recordFiles as $rf) {
        //     File::delete($rf->file);
        // }

        $record->fill(['is_delete' => true]);
        $record->save();
        return response()->json(['message' => 'Record deleted successfully!']);
    }
}
