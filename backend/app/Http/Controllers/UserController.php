<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Throwable;

class UserController extends Controller
{
    public function index()
    {
        $user = User::with(['employee.province', 'employee.city', 'employee.district', 'employee.village'])->get();
        return response()->json($user);
    }

    public function getClient($perPage, $keyword=null)
    {
        try {
            $user = User::with(['employee.province', 'employee.city', 'employee.district', 'employee.village'])->where('role_id', 2)->orderBy('updated_at', 'desc')->paginate($perPage);

            if ($keyword == null) {
                $user = User::with(['employee.province', 'employee.city', 'employee.district', 'employee.village'])->where('role_id', 2)->orderBy('updated_at', 'desc')->paginate($perPage);
            } else {
                $user = User::with('employee')->where('role_id', 2)
                    ->where('name', 'like', '%'.$keyword.'%')
                    ->orWhere('email', 'like', '%'.$keyword.'%')
                    ->orWhere('phone', 'like', '%'.$keyword.'%')
                    ->orWhereRelation('role', 'name', 'like', '%'.$keyword.'%')
                    ->orWhereRelation('employee', 'name', 'like', '%'.$keyword.'%')
                    ->orWhere('created_at', 'like', '%'.$keyword.'%')
                    ->orWhere('updated_at', 'like', '%'.$keyword.'%')
                    ->orderBy('updated_at', 'desc')
                    ->paginate($perPage);
            }
    
            return response()->json($user);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function setStatus(Request $request){
        try {
            $this->validate($request, [
                'daily_sales_status'     => 'required|boolean',
                'daily_inventory_status'     => 'required|boolean'
            ]);

            $data = User::find(auth()->guard('api')->user()->id);
            if($request->daily_sales_status == 1){
                $data->daily_sales_summary_status = 1;
            }
            if($request->daily_sales_status == 0){
                $data->daily_sales_summary_status = 0;
            }
            if($request->daily_inventory_status == 1){
                $data->daily_inventory_alerts_status = 1;   
            }
            if($request->daily_inventory_status == 0){
                $data->daily_inventory_alerts_status = 0;
            }
            $data->save();
            return response()->json(['message'=> 'Success change status!']);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        $user = User::with(['employee.province', 'employee.city', 'employee.district', 'employee.village'])->find($id);
        return response()->json($user);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'email'     => 'required|email|unique:users'
        ]);

        $data = $request->all();
        $data['password'] = app('hash')->make($request->password);
        $data['role'] = 3;

        $user = User::create($data);

        return response()->json(['status'=> 'OK' ,'data' => $user, 'message'=> 'Success created account!'], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        $this->validate($request, [
            'email'     => $request->email == $user->email ? 'required|email' : 'required|email|unique:users',
        ]);

        $data = $request->all();

        $user->fill($data);

        $user->save();
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully!']);
    }
}
