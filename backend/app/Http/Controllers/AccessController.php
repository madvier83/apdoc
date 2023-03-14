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
        $this->authorize('admin_access');

        return view('admin.access.index',[
            'users'     => User::with(['role', 'employees'])->get(),
            'roles'     => Role::all(),
            'menus'     => Menu::all(),
            'accesses'  => Access::with('submenu')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        if($request->menu) {
            Access::where('user_id', $id)->update(['status' => false]);
            
            $menu = count($request->menu);
            for($i = 0; $i < $menu; $i++){
                if($request->menu[$i]) { 
                    Access::where('user_id', $id)->where('submenu_id', $request->menu[$i])->update(['status' => true]); 
                }
            }
        } else {
            Access::where('user_id', $id)->update(['status' => false]);
        }

        return redirect('access')->with('success', 'Access updated successfully.');
    }
}
