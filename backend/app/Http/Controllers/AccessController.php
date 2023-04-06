<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Menu;
use App\Models\Access;

class AccessController extends Controller
{
    public function index()
    {
        $access = Access::with('role')->where('id', '>', 2)->where('clinic_id', auth()->user()->employee->clinic_id)->get();
        return response()->json($access);
    }

    public function getByRole($role)
    {
        $access = Access::where('role_id', $role)->get();
        return response()->json($access);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'role'      =>  'required',
            'accesses'  =>  'required',
        ]);

        $role = Role::create([
            'name' => $request->role
        ]);

        $data = [
            'role_id'   => $role->id,
            'accesses'  => $request->accesses,
            'clinic_id' => auth()->user()->employee->clinic_id
        ];

        $access = Access::create($data);

        return response()->json($access);
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

        $data = [
            'accesses'  => $request->accesses
        ];

        $access->fill($data);

        $access->save();

        Role::where('id', $access->role_id)->update(['name' => $request->role]);

        return response()->json($access);
    }

    public function destroy($id)
    {
        $access = Access::find($id);

        if (!$access) {
            return response()->json(['message' => 'Access not found!'], 404);
        }

        $access->delete();
        User::where('role_id', $id)->update(['role_id' => null]);

        return response()->json(['message' => 'Access deleted successfully!']);
    }
}
