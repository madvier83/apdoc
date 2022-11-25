@extends('admin.layout.base')

@section('title', 'Dashboard - Users Management')
@push('custom-css')
    <link href="{{ asset('assets/admin/lib/data-tables/dataTables.bootstrap4.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/lib/data-tables/responsive.bootstrap4.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/lib/sweet-alerts2/sweetalert2.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/css/sweet-alert-custom.css') }}" rel="stylesheet">
@endpush
@section('adminContent')
    <div class="page-subheader mb-30">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-md-7">
                    <div class="list">
                        <div class="list-item pl-0">
                            <div class="list-thumb ml-0 mr-3 pr-3  b-r text-muted">
                                <i class="icon-Checked-User nav-thumbnail"></i>
                            </div>
                            <div class="list-body">
                                <div class="list-title fs-2x">
                                    <h3>Data Users</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-5 d-flex justify-content-end h-md-down">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb no-padding bg-trans mb-0">
                            <li class="breadcrumb-item"><a href="index.html"><i class="icon-Home mr-2 fs14"></i></a></li>
                            <li class="breadcrumb-item">Dashboard</li>
                            <li class="breadcrumb-item active">Users</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    </div>
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
            <div class="alert alert-danger alert-block d-none" id="alerto">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <strong id="pesan"></strong>
            </div>
            @if ($message = Session::get('errors'))
                <div class="alert alert-danger alert-block">
                    <button type="button" class="close" data-dismiss="alert">×</button>
                    <strong>{{ $message }}</strong>
                </div>
            @endif
            <div class="bg-white table-responsive rounded shadow-sm pt-3 pb-3 mb-30">
                <div class="d-flex justify-content-between">
                        <h6 class="pl-3 pr-3 text-capitalize font400 mb-20">Data Users</h6>
                        <button type="button" class="btn btn-success mb-2 mr-3"  data-backdrop="static" data-keyboard="false" data-toggle="modal" data-target="#formModal" onclick="show(null)">Add Users</button>
                </div>
                <table id="datatableuser" class="table mb-0 table-striped" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Roles</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php $no=1?>
                    @foreach($models as $user)
                        <tr>
                            <td>{{$no++}}</td>
                            <td>{{$user->name}}</td>
                            <td>{{$user->username}}</td>
                            <th>{{$user->roles}}</th>
                            <th>
                                @if($user->roles=='admin'||$user->roles=='user_admin')
                                <div class="row d-flex justify-content-first w-100">
                                <a href="{{ route('admin.users.resetPassword',['id' => $user->id]) }}" class="btn btn-warning btn-sm"><i class="fas fa-sync-alt"></i></a>
                                <button class="btn btn-primary btn-sm ml-2" data-toggle="modal" data-target="#formModal" onclick="show({{$user->id}})"><i class="fa fa-pencil-alt"></i></button>
                                <button type="submit" class="btn btn-danger btn-sm ml-2 delete-btn" data-backdrop="static" data-keyboard="false" data-delete="{{ $user->id }}" data-nama="{{ $user->name }}"><i class="fa fa-trash"></i></button>
                                </div>
                                @endif
                            </th>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Add -->
    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="formModal" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
        <div class="modal-header">
                <h4 class="modal-title" id="formModalLabel">
                    Add Users
                </h4>
            </div>
            <div id="formArea">
            <form id="addUserForm" action="{{ route('admin.users.create') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body">
                <div class="page-content">
                    <div class="input-icon-group col-12">
                            <label for="name" class="mt-2">Name</label>
                            <div class='input-icon-append'>
                                <i class="far fa-user"></i>
                                <input placeholder="Name" name="name" type="text" id="name" class="form-control" required>
                            </div>
                            <label for="username" class="mt-2">Username</label>
                            <div class='input-icon-append'>
                                <i class="fa fa-at"></i>
                                <input placeholder="Username" name="username" id="username" type="text" class="form-control" required>
                            </div>
                            <div id="roles">
                            <label for="roles" class="mt-2">Roles</label>
                            <div class='input-icon-append'>
                            <div class="customUi-radio radioUi-primary pb-2">
                                <input id="gr2" type="radio" name="roles" value="admin" required>
                                <label for="gr2">
                                    <span class="label-radio"></span>
                                    <span class="label-helper">Admin</span>
                                </label>
                            </div><br>
                            @if(Auth::user()->roles=='super_admin')
                            <div class="customUi-radio radioUi-primary  pb-2">
                                <input id="gr3" type="radio" name="roles" value="user_admin">
                                <label for="gr3">
                                    <span class="label-radio"></span>
                                    <span class="label-helper">User Admin</span>
                                </label>
                            </div>
                            @endif
                            </div>
                            </div>
                            <label for="password" class="mt-2">Password</label>
                            <div class='input-icon-append'>
                                <i class="fa fa-lock"></i>
                                <input placeholder="Password" type="password" id="password" class="form-control" name="password" required>
                            </div>
                    </div>
                </div>
            <div class="modal-footer d-flex justify-content-center m-0">
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <button class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
            </div>
            </form>
            </div>
        </div>
    </div>
    </div>
    
@endsection
    @push('custom-js')
        <script type="text/javascript" src="{{ asset('assets/admin/lib/data-tables/jquery.dataTables.min.js') }}"></script> 
        <script type="text/javascript" src="{{ asset('assets/admin/lib/data-tables/dataTables.bootstrap4.min.js') }}"></script> 
        <script type="text/javascript" src="{{ asset('assets/admin/lib/data-tables/dataTables.responsive.min.js') }}"></script> 
        <script type="text/javascript" src="{{ asset('assets/admin/lib/data-tables/responsive.bootstrap4.min.js') }}"></script> 
        <script type="text/javascript" src="{{ asset('assets/admin/lib/bootstrap-notify/bootstrap-notify.min.js') }}"></script> 
        <script type="text/javascript" src="{{ asset('assets/admin/lib/sweet-alerts2/sweetalert2.min.js') }}"></script> 
        <script src="{{ asset('assets/admin/js/plugins-custom/sweetalert2-custom.js') }}"></script> 
        <script src="{{ asset('assets/admin/js/plugins-custom/datatables-custom.js') }}"></script>
        <script src="{{ asset('assets/admin/js/plugins-custom/bs-notify-custom.js') }}"></script>
        <script>
                
                $('#datatableuser').DataTable({responsive:true});

                $('.delete-btn').click(function (e) {
                e.preventDefault();
                let id = $(this).data('delete');
                let nama = $(this).data('nama');
                console.log(id);
                console.log(nama);
                swal({
                    title: 'Are you sure want to delete '+nama+' ?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-confirm mt-2',
                    cancelButtonClass: 'btn btn-secondary ml-2 mt-2',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if(result){
                        $.ajax({
                            url: `{{ url('/dashboard/users/${id}') }}`,
                            type: "DELETE",
                            dataType: "JSON",
                            data: {
                                "_token": "{{ csrf_token() }}"
                            }
                        });
                    }
                    else{
                        console.log("error");
                    }
                }).then(()=>{
                    swal({
                    title: 'Deleted',
                    text: 'Your file has been deleted',
                    type: 'success',
                    confirmButtonClass: 'btn btn-confirm mt-2'
                }).then(()=>{
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })})
                })

            function show(id) {
            if (id == null) {
                console.log('bisa')
                $("#formModalLabel").html("Add Users");
                $("#formArea").html(`
                <form id="addUserForm" action="{{ route('admin.users.create') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body">
                <div class="page-content">
                    <div class="input-icon-group col-12">
                            <label for="name" class="mt-2">Name</label>
                            <div class='input-icon-append'>
                                <i class="far fa-user"></i>
                                <input placeholder="Name" name="name" type="text" id="name" class="form-control" required>
                            </div>
                            <label for="username" class="mt-2">Username</label>
                            <div class='input-icon-append'>
                                <i class="fa fa-at"></i>
                                <input placeholder="Username" name="username" id="username" type="text" class="form-control" required>
                            </div>
                            <div id="roles">
                            <label for="roles" class="mt-2">Roles</label>
                            <div class='input-icon-append'>
                            <div class="customUi-radio radioUi-primary pb-2">
                                <input id="gr2" type="radio" name="roles" value="admin">
                                <label for="gr2">
                                    <span class="label-radio"></span>
                                    <span class="label-helper">Admin</span>
                                </label>
                            </div><br>
                            @if(Auth::user()->roles=='super_admin')
                            <div class="customUi-radio radioUi-primary pb-2">
                                <input id="gr3" type="radio" name="roles" value="user_admin">
                                <label for="gr3">
                                    <span class="label-radio"></span>
                                    <span class="label-helper">User Admin</span>
                                </label>
                            </div>
                            @endif
                            </div>
                            </div>
                            <label for="password" class="mt-2">Password</label>
                            <div class='input-icon-append'>
                                <i class="fa fa-lock"></i>
                                <input placeholder="Password" type="password" id="password" class="form-control" name="password" required>
                            </div>
                    </div>
                </div>
            <div class="modal-footer d-flex justify-content-center m-0">
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <button class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
            </div>
            </form>
                `);
            } else {
                $.get("{{ url("dashboard/users/show") }}/" + id, {}, function(data, status) {
                    $("#formModalLabel").html("Update User");
                    $("#formArea").html(data);
                    $("#roles").classList.add('display:none;');
                    $("#formModal").modal("show");
                });
            }
        }
        </script>
@endpush