@extends('admin.layout.base')

@section('title', 'Dashboard - Category Product')
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
                                <i class="nav-thumbnail">CP</i>
                            </div>
                            <div class="list-body">
                                <div class="list-title fs-2x">
                                    <h3>Category Product</h3>
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
                            <li class="breadcrumb-item active">Category Product</li>
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
                        <h6 class="pl-3 pr-3 text-capitalize font400 mb-20">Category Product</h6>
                        <button type="button" class="btn btn-success mb-2 mr-3" data-toggle="modal" data-backdrop="static" data-keyboard="false" data-target="#formModal" onclick="show(null)">Add Category</button>
                </div>
                <table id="datatableheadline" class="table mb-0 table-striped" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Parent</th>
                            <th>Seed</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $no=1;
                    ?>
                    @foreach($models::all() as $item)
                        <tr>
                            <td>{{$no++}}</td>
                            <td>{{$item->name}}</td>
                            <td>
                            <?php $parentName = $models
                                    ::select('name')
                                    ->where('id', $item->parent_id)
                                    ->get(); ?>
                                @foreach ($parentName as $name)
                                    {{ $name->name }}
                                @endforeach
                            </td>
                            <td>{{$item->seed}}</td>
                            <th>
                            <div class="row d-flex justify-content-first">
                                <button class="btn btn-primary btn-sm ml-2" data-toggle="modal" data-target="#formModal" onclick="show({{$item->id}})"><i class="fa fa-pencil-alt"></i></button>
                                {{--<form method="POST" action="{{route('admin.productcategory.delete',['id'=>$item->id])}}">
                                    @method('delete')
                                    @csrf
                                    <button type="submit" class="btn btn-danger btn-sm ml-2" onclick="return confirm('Do you really want to delete {{$item->name}} ?')"><i class="fa fa-trash"></i></button>
                                </form>--}}
                                <button type="submit" class="btn btn-danger btn-sm ml-2 delete-btn" data-backdrop="static" data-keyboard="false" data-delete="{{ $item->id}}" data-nama="{{ $item->name }}" ><i class="fa fa-trash"></i></button>
                            </div>
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
                    Add Category
                </h4>
            </div>
            <div id="formArea">
            <form id="addCategoryForm" action="{{ route('admin.productcategory.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body">
                <div class="page-content">
                    <div class="input-icon-group col-12">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="parent">Parent</label>
                            <select class="custom-select" required name="parent_id">
                                    <option selected disabled>Parent</option>
                                    @foreach ($parent as $item)
                                        <option value="{{ $item->id }}">{{ $item->name }}</option>
                                    @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="seed">Seed</label>
                            <input type="number" class="form-control" id="seed" name="seed" min="1" required>
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
        <script type="text/javascript" src="{{ asset('assets/admin/lib/data-tables/responsive.bootstrap4.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('assets/admin/lib/sweet-alerts2/sweetalert2.min.js') }}"></script> 
        <script src="{{ asset('assets/admin/js/plugins-custom/sweetalert2-custom.js') }}"></script>
        <script src="{{ asset('assets/admin/js/plugins-custom/datatables-custom.js') }}"></script>
        <script>
            $(document).ready(function() {
                $('#datatablecategory').DataTable({responsive:true});
            });

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
                        url: `{{ url('/dashboard/product-category/delete/${id}') }}`,
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
                $("#formModalLabel").html("Add Category");
                $("#formArea").html(`
                <form id="addCategoryForm" action="{{ route('admin.productcategory.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body">
                <div class="page-content">
                <div class="input-icon-group col-12">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="parent">Parent</label>
                            <select class="custom-select" name="parent_id">
                                    <option selected value={{null}}>Parent</option>
                                    @foreach ($parent as $item)
                                        <option value="{{ $item->id }}">{{ $item->name }}</option>
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
                $.get("{{ url("dashboard/product-category/show") }}/" + id, {}, function(data, status) {
                    console.log(status);
                    $("#formModalLabel").html("Update Category");
                    $("#formArea").html(data);
                    $("#formModal").modal("show");
                });
            }
        }
        </script>
    @endpush