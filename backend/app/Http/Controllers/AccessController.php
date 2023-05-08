<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Menu;
use App\Models\Access;
use Throwable;

class AccessController extends Controller
{
    public function index()
    {
        try {
            $access = Access::with('role')->where('role_id', '>', 2)->where('clinic_id', auth()->user()->employee->clinic_id)->get();
    
            return response()->json($access);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function getByRole($role)
    {
        try {
            $access = Access::where('role_id', $role)->get();
    
            return response()->json($access);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'role'      =>  'required',
            'accesses'  =>  'required',
        ]);

        try {
            $role = Role::create([
                'name' => $request->role
            ]);
    
            $data = [
                'role_id'   => $role->id,
                'accesses'  => $request->accesses,
                'clinic_id' => $request->clinic_id ?? auth()->user()->employee->clinic_id
            ];
            $access = Access::create($data);
    
            return response()->json($access);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $access = Access::where('id', $id)->first();
        
        if (!$access) {
            return response()->json(['message' => 'Access role not found!'], 404);
        }
        
        if ($id == 1 || $id == 2) {
            return response()->json(['message' => 'Access role not found!'], 404);
        }

        $this->validate($request, [
            'role'      =>  'required',
            'accesses'  =>  'required',
        ]);

        try {
            $data = [
                'accesses'  => $request->accesses
            ];
            $access->fill($data);
            $access->save();
    
            Role::where('id', $access->role_id)->update(['name' => $request->role]);
    
            return response()->json($access);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $access = Access::find($id);

        if (!$access) {
            return response()->json(['message' => 'Access not found!'], 404);
        }

        try {
            $access->delete();
            Role::where('id', $access->role_id)->delete();
            User::where('role_id', $access->role_id)->update(['role_id' => null]);
    
            return response()->json(['message' => 'Access deleted successfully!']);
        } catch (Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
