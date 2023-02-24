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
        $this->tomorrow = Carbon::tomorrow();
    }
    
    public function index(){
        try {
            $data = Appointment::with('patient')->paginate(10);
            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function show($id = null){
        try {
            $data = Appointment::with('patient')->findOrFail($id);
            return response()->json($data);
        } catch (\Throwable $th) {
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
                'appointment_date' => $request->appointment_date
            ]);   
            return response()->json(['status'=> 'success','message' => 'success create appointment'], 201);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function destroy($id){
        try {
            Appointment::destroy($id);
            return response()->json(['status'=> 'success','message' => 'success delete appointment'], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}