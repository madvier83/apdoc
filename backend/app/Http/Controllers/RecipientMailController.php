<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RecipientMail;
use Throwable;

class RecipientMailController extends Controller
{
    public function index(){
        try {
            $data = RecipientMail::where('apdoc_id', auth()->guard('api')->user()->apdoc_id)->get();
            return response()->json($data);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function store(Request $request){
        try {
            $this->validate($request, [
                'email'     => 'required|email|unique:recipient_mail'
            ]);
            $data = new RecipientMail();
            $data->email = $request->email;
            $data->apdoc_id = auth()->guard('api')->user()->apdoc_id;
            $data->save();
            return response()->json(['status' => 'success', 'data' => $data, 'message' => 'new recipient added!'], 200);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id){
        $data = RecipientMail::find($id);
        $data->delete();
        return response()->json(['message' => 'recipient deleted!']);
    }
}
