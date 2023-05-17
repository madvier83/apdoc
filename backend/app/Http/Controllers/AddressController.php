<?php

namespace App\Http\Controllers;

class AddressController extends Controller
{
    public function index(){
        try {
            $provinces = \Indonesia::allProvinces();
            return response()->json(['status' => 'success', 'data' => $provinces], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()], 400);
        }
    }
    public function cities($id){
        try {
            $cities = \Indonesia::findProvince($id, ['cities'])->cities;
            return response()->json(['status' => 'success', 'data' => $cities], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()], 400);
        }
    }
    public function districts($id){
        try {
            $district = \Indonesia::findCity($id, ['districts'])->districts;
            return response()->json(['status' => 'success', 'data' => $district], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()], 400);
        }
    }
    public function villages($id){
        try {
            $district = \Indonesia::findDistrict($id, ['villages'])->villages;
            return response()->json(['status' => 'success', 'data' => $district], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()], 400);
        }
    }
}
