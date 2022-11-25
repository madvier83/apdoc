@extends('admin.layout.base')

@section('title', 'Users Management')
@section('adminContent')
    <div class="page-subheader mb-30">
            <div class="container-fluid">
                <div class="row align-items-center">
                    <div class="col-md-7">
                        <div class="list">
                            <div class="list-item pl-0">
                                <div class="list-thumb ml-0 mr-3 pr-3  b-r text-muted">
                                    Profile
                                </div>
                                <div class="list-body">
                                    <div class="list-title fs-2x">
                                        <h3>{{ Auth::user()->name }}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 d-flex justify-content-end">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb no-padding bg-trans mb-0">
                                <li class="breadcrumb-item"><a href="{{ url('dashboard')}}"><i class="icon-Home mr-2 fs14"></i></a></li>
                                <li class="breadcrumb-item">Users</li>
                                <li class="breadcrumb-item active">Profile</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
    </div><!-- page-sub-Header end-->
    <div class="page-content">
        <div class="container-fluid">
        <div class="alert alert-success alert-block d-none" id="alerto">
            <button type="button" class="close" data-dismiss="alert">×</button>
            <strong id="pesan"></strong>
        </div>
        @if ($message = Session::get('success'))
            <div class="alert alert-success alert-block">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <strong>{{ $message }}</strong>
            </div>
        @endif
        <div class="row">
            <div class="col-12">
                <div class="portlet-box portlet-gutter ui-buttons-col mb-20">
                    <div class="portlet-header flex-row flex d-flex align-items-center b-b">
                        <div class="flex d-flex flex-column">
                            <h3>Change Profile</h3> 
                        </div>
                    </div>
                    <div class="portlet-body">
                        @if(Auth::user()->id == $model->id)
                        <form id="validateForm" action="{{ route('admin.users.change',['id'=>$model->id]) }}" method="POST">
                            @csrf
                            {{ method_field('PUT') }}
                            <div class="input-icon-group">
                                <label for="name">Name</label>
                                <div class="input-icon-append">
                                    <i class="fa fa-user-circle"></i>
                                    <input id="name" type="text" name="name" value="{{$model->name}}" class="form-control" placeholder="Name">
                                </div>
                            </div>
                            <div class="input-icon-group">
                                <label for="userName">Username</label>
                                <div class="input-icon-append">
                                    <i class="fa fa-user-circle"></i>
                                    <input id="username" type="text" name="username" value="{{ $model->username }}" class="form-control" placeholder="Username">
                                </div>
                            </div>
                            <div class="input-icon-group">
                                <label for="password">New Password</label>
                                <div class="input-icon-append">
                                    <i class="fa fa-eye" id="seePassword" style="cursor:pointer;"></i>
                                    <input id="newPassword" type="password" name="password" class="form-control" placeholder="Password">
                                </div>
                            </div>
                            <div class="input-icon-group mb-0">
                                <label for="passwordConfirm">Confirm New Password</label>
                                <div class="input-icon-append">
                                    <i class="fa fa-lock"></i>
                                    <input id="passwordConfirm" type="password" name="passwordConfirm" class="form-control" placeholder="Confirm password">
                                    <span id="myFeedBack" class="ml-5 mb-0 text-uppercase font-weight-bold text-muted" style="font-size: 10pt;"></span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-gradient-primary notify-success mt-1" id="btnSubmit">Submit</button>
                        </form>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@push("custom-js")
    <script>
        // simple password dan konfirmasi password validasi
        const seePassword = document.getElementById("seePassword");
        const newPassword = document.getElementById("newPassword");
        const cNewPassword = document.getElementById("passwordConfirm");
        const btnSubmit = document.getElementById("btnSubmit");
        let vNewPassword;
        const myFeedBack = document.getElementById('myFeedBack');
        
        seePassword.addEventListener("click", () => {
            if (newPassword.type == "password") {
                newPassword.type = "text";
            } else {
                newPassword.type = "password";
            }
        });
        
        newPassword.addEventListener("input", (e) =>{
            vNewPassword = e.target.value;
            if (e.target.value != "") {
                btnSubmit.classList.remove('btn-primary')
                btnSubmit.classList.add('btn-secondary')
                btnSubmit.type = "button"
            }else{
                btnSubmit.classList.remove('btn-secondary')
                btnSubmit.classList.add('btn-primary')
                btnSubmit.type = "submit"
            }
        })

        cNewPassword.addEventListener("input", (e) =>{
            if (e.target.value != "") {
                if (vNewPassword == e.target.value) {
                    myFeedBack.classList.remove("text-danger");
                    myFeedBack.classList.add("text-primary");
                    myFeedBack.innerText = "Matched";
                    btnSubmit.classList.remove('btn-secondary')
                    btnSubmit.classList.add('btn-primary')
                    btnSubmit.type = "submit"
                } else{
                    myFeedBack.classList.remove("text-success");
                    myFeedBack.classList.add("text-danger");
                    myFeedBack.innerText = "Your password doens't match";
                    btnSubmit.classList.remove('btn-primary')
                    btnSubmit.classList.add('btn-secondary')
                    btnSubmit.type = "button"
                }
            }else{
                myFeedBack.innerText = "";
                btnSubmit.classList.remove('btn-primary')
                btnSubmit.classList.add('btn-secondary')
                btnSubmit.type = "button"
            }
        })
    </script>
@endpush