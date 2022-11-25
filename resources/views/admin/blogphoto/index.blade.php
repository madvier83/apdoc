@extends('admin.layout.base')

@section('title', 'Dashboard - photo blog')
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
                                <i class="nav-thumbnail">CB</i>
                            </div>
                            <div class="list-body">
                                <div class="list-title fs-2x">
                                    <h3>photo Blog</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-5 d-flex justify-content-end h-md-down">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb no-padding bg-trans mb-0">
                            <li class="breadcrumb-item"><a href="{{ url('dashboard') }}"><i class="icon-Home mr-2 fs14"></i></a></li>
                            <li class="breadcrumb-item">Dashboard</li>
                            <li class="breadcrumb-item active">photo Blog</li>
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
            <div class="bg-white table-responsive rounded shadow-sm pt-3 pb-3 mb-30">
                <div class="d-flex justify-content-between">
                        <a href="{{ route('admin.blog.index') }}" class="btn btn-primary mb-2 ml-3">Back</a>
                        <h6 class="pl-3 pr-3 text-capitalize font400 mb-20">{{$blogName}} Photos</h6>
                        <button type="button" class="btn btn-success mb-2 mr-3" data-backdrop="static" data-keyboard="false" data-toggle="modal" data-target="#formModal" onclick="show(null)">Add photo</button>
                </div>
                <table id="datatablephoto" class="table mb-0 table-striped" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Seed</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php $no = 1; ?>
                    @foreach ($models as $item)
                        <tr>
                            <td>{{ $no++ }}</td>
                            <td>{{ $item->name }}</td>
                            <td>
                                <img src="/assets/images/blog/photo/{{ $item->image }}" alt="" srcset=""
                                    class="img-thumbnail" width="100" height="100">
                            </td>
                            <td>{{ $item->seed }}</td>
                            <td class="d-flex justify-content-center">
                                <button class="btn btn-danger btn-sm delete-btn" data-delete="{{ $item->id }}" data-nama="{{ $item->name }}"><i
                                    class="fas fa-trash"></i></button>
                                <button type="button" data-toggle="modal" data-target="#editModal" data-backdrop="static" data-keyboard="false"
                                    onclick="show({{ $item->id }})" class="btn btn-warning btn-sm ml-2">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                            </td>
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
                    Add Photo
                </h4>
            </div>
            <div id="formArea">
            <form id="addphotoForm" action="{{ route('admin.blogphoto.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body">
                <div class="page-content">
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
        <script type="text/javascript" src="{{ asset('assets/admin/lib/sweet-alerts2/sweetalert2.min.js') }}"></script> 
        <script src="{{ asset('assets/admin/js/plugins-custom/sweetalert2-custom.js') }}"></script>
        <script src="{{ asset('assets/admin/js/plugins-custom/datatables-custom.js') }}"></script>
        <script>
            $(document).ready(function() {
                $('#datatablephoto').DataTable({responsive:true});
            });
            
            $('.delete-btn').click(function (e) {
            e.preventDefault();
            let id = $(this).data('delete');
            let nama = $(this).data('nama');
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
                        url: `{{ url('/dashboard/blog-photo/delete/${id}') }}`,
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
                $("#formModalLabel").html("Add Photo");
                $("#formArea").html(`
                <form id="addphotoForm" action="{{ route('admin.blogphoto.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body">
                <div class="page-content">
                <div class="input-icon-group col-12">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="image">Image (Recomend Landscape Image)</label>
                            <input type="file" accept="image/*" class="form-control" id="image" name="image" required>
                        </div>
                        <div class="form-group">
                            <select class="custom-select d-none mb-3" name="blog_id" required >
                                @foreach ($blog as $item)
                                    <option selected value="{{ $item->id }}">{{ $item->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="seed">Seed</label>
                            <input type="number" class="form-control" id="seed" name="seed" min="1" required>
                        </div>
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
                $.get("{{ url("dashboard/blog-photo/show") }}/" + id, {}, function(data, status) {
                    console.log(status);
                    $("#formModalLabel").html("Update photo");
                    $("#formArea").html(data);
                    $("#formModal").modal("show");
                });
            }
        }
        </script>
    @endpush