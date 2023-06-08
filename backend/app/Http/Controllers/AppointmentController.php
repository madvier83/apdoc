<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Twilio\Rest\Client;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    protected $tomorrow;
    
    public function __construct(){
        $tomorrow = Carbon::tomorrow();
    }
    
    public function index(Request $request, $clinic, $perPage, $keyword=null)
    {
        $sortBy = $request->sortBy ?? 'id';
        $order  = $request->order ?? 'asc';

        try {
            if ($keyword == null) {
                $appointment = Appointment::with('patient')->where('clinic_id', $clinic)->orderBy($sortBy, $order)->paginate($perPage);
            } else {
                $appointment = Appointment::with('patient')->where(function($query) use ($keyword) {
                    $query->where('appointment_date', 'like', '%'.$keyword.'%')
                        ->orWhere('description', 'like', '%'.$keyword.'%')
                        ->orWhere('created_at', 'like', '%'.$keyword.'%')
                        ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                        ->orWhereRelation('patient' ,'name', 'like', '%'.$keyword.'%');
                    })
                    ->where('clinic_id', $clinic)
                    ->orderBy($sortBy, $order)
                    ->paginate($perPage);
            }
    
            return response()->json($appointment);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function show($id = null){
        try {
            $data = Appointment::with('patient')->findOrFail($id);
            return response()->json($data);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function store(Request $request, $id = null){
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required',
            'description' => 'required',
            'appointment_date' => 'required|date|after:now'
            ],[
            'patient_id.required' => 'patient is required',
            'description.required' => 'description is required',
            'appointment_date.required' => 'date is required',
            'appointment_date.after:now' => 'appointment should tomorrow' 
            ]);
            if($validator->fails()){
                return response()->json(['status' => 'error', 'message' => 'unvalid data', 'errors' => $validator->errors()], 422);
            }
        try {
            $data = Appointment::updateOrCreate([
                'id' => $id
            ],[
                'patient_id' => $request->patient_id,
                'description' => $request->description,
                'appointment_date' => $request->appointment_date,
                'clinic_id' => $request->clinic_id ?? auth()->user()->employee->clinic_id
            ]);   
            return response()->json(['status'=> 'success','message' => 'success create appointment'], 201);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function destroy($id){
        try {
            Appointment::destroy($id);
            return response()->json(['status'=> 'success','message' => 'success delete appointment'], 200);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}