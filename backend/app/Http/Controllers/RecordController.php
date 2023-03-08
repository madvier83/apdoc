<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Record;
use App\Models\RecordDiagnose;
use App\Models\RecordFile;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RecordController extends Controller
{
    public function index()
    {
        $record = Record::with('recordFiles', 'recordDiagnoses', 'recordDiagnoses.diagnose')->get();
        return response()->json($record);
    }

    public function show($patient)
    {
        $record = Record::with('recordFiles', 'recordDiagnoses', 'recordDiagnoses.diagnose')->where("patient_id", $patient)->latest()->get();
        return response()->json($record);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'patient_id' => 'required',
            'complaint'  => 'required',
            'inspection' => 'required',
            'therapy'    => 'required',
        ]);

        $data = $request->all();
        $data['employee_id'] = auth()->user()->employee_id ?? null;

        $record = Record::create($data);

        // Record File
        if ($request->file('file')) {
            $patient = Patient::find($request->patient_id);

            $recordFileName = time() . '_' . $request->file('files')->getClientOriginalName();
            $request->file('files')->move('img/record/recordFile', $recordFileName);
            
            $recordFile = [
                'record_id' => $record->id,
                'file'      => 'img/record/recordFile/'. $patient->nik . '/' . Carbon::now() . '/' . $recordFileName
            ];

            RecordFile::create($recordFile);
        }

        if ($request->file('files')) {
            $patient = Patient::find($request->patient_id);

            foreach ($request->file('files') as $data) {
                $recordFileName = time() . '_' . $data->getClientOriginalName();
                $data->move('img/record/recordFile', $recordFileName);
                
                $recordFile = [
                    'record_id' => $record->id,
                    'file'      => 'img/record/recordFile/'. $patient->nik . '/' . Carbon::now() . '/' . $recordFileName
                ];

                RecordFile::create($recordFile);
            }
        }

        // Record Diagnosa
        if ($request->diagnoses) {
            $diagnose = count($request->diagnoses);
            for ($i = 0; $i < $diagnose; $i++) {
                if ($request->diagnoses[$i]) {
                    $data = [
                        'record_id'     => $record->id,
                        'diagnose_id'  => $request->diagnoses[$i],
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
            'patient_id' => 'required',
            'complaint'  => 'required',
            'inspection' => 'required',
            'therapy'    => 'required',
        ]);

        $data = $request->all();
        $data['employee_id'] = auth()->user()->employee_id ?? null;

        // return $record = Record::where('id', $id)->update($data);
        $record->fill($data);
        $record->save();

        // Record File
        if ($request->file('file')) {
            RecordFile::where('record_id', $record->id)->delete();
            $patient = Patient::find($request->patient_id);

            $recordFileName = time() . '_' . $request->file('files')->getClientOriginalName();
            $request->file('files')->move('img/record/recordFile', $recordFileName);
            
            $recordFile = [
                'record_id' => $record->id,
                'file'      => 'img/record/recordFile/'. $patient->nik . '/' . Carbon::now() . '/' . $recordFileName
            ];

            RecordFile::create($recordFile);
        }

        if ($request->file('files')) {
            RecordFile::where('record_id', $record->id)->delete();
            $patient = Patient::find($request->patient_id);

            foreach ($request->file('files') as $data) {
                $recordFileName = time() . '_' . $data->getClientOriginalName();
                $data->move('img/record/recordFile', $recordFileName);
                
                $recordFile = [
                    'record_id' => $record->id,
                    'file'      => 'img/record/recordFile/'. $patient->nik . '/' . Carbon::now() . '/' . $recordFileName
                ];

                RecordFile::create($recordFile);
            }
        }

        // Record Diagnosa
        if ($request->diagnoses) {
            RecordDiagnose::where('record_id', $record->id)->delete();
            $diagnose = count($request->diagnoses);
            for ($i = 0; $i < $diagnose; $i++) {
                if ($request->diagnoses[$i]) {
                    $data = [
                        'record_id'     => $record->id,
                        'diagnose_id'  => $request->diagnoses[$i],
                    ];
                    RecordDiagnose::create($data);
                }
            }
        }

        return response()->json($record);
    }

    public function updateEditable($id)
    {
        $record = Record::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        // $record->delete();
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

        // $record->delete();
        $record->fill(['is_delete' => true]);
        $record->save();
        return response()->json(['message' => 'Record deleted successfully!']);
    }
}
