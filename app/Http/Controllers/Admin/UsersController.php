<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Session;

use function PHPUnit\Framework\isNull;

class UsersController extends BaseController
{
    //
    protected $model = User::class;

    protected $viewName = 'users';

    protected $rules = [
        'name' => 'required|string',
        'roles' => 'required',
        'username' => 'required|unique:users,username',
        'password' => 'required'
    ];

    protected $rulesEdit = [
        'name' => 'required|string',
        'username' => 'required|unique:users,username',
    ];

    public function index(Request $request)
    {
        $role = Auth::user()->roles;
        if ($role == "super_admin") {
            $models = $this->model::all()->except(1);
        } else {
            $models = $this->model::where("roles", "admin")->get();
        }
        return view("admin.{$this->viewName}.index", [
            'models' => $models,
            'viewName' => $this->viewName
        ]);
    }

    public function store(Request $request)
    {
        $model = new User;
        $model->name = $request->name;
        $model->roles = $request->roles;
        $model->username = $request->username;
        $this->validate($request, [
            'username' => 'required|unique:users',
        ]);
        $model->password = bcrypt($request->password);
        $model->created_at = Carbon::now();
        $model->updated_at = Carbon::now();
        $model->save();
        return redirect('/dashboard/users')->with(['success' => 'Account has been created']);
    }

    public function changePassword($id)
    {
        $this->validate($request, [
            'username' => 'required|unique:users',
        ]);
        $model = User::findOrFail($id);
        return view('admin.profile', compact('model'));
    }

    public function postPassword(Request $request, $id)
    {
        $request->validate([
            'name' => 'string',
            'roles' => 'bail'
        ]);
        
        $this->validate($request, [
            'username' => 'required|unique:users',
        ]);

        $model =  User::findOrFail($id);
        if ($request->password == null) {
            $model->update([
                'name' => $request->name,
                'username' => $request->username
            ]);
        } else {
            $model->update([
                'name' => $request->name,
                'username' => $request->username,
                'password' => bcrypt($request->password)
            ]);
        }
        return back()->with(["success" => "Success change data"]);
    }

    public function resetPassword($id)
    {
        $data = $this->model::find($id);
        $data->password = bcrypt('123456');
        $data->save();

        return back()->with(["success" => "successfully reset password"]);
    }
}
