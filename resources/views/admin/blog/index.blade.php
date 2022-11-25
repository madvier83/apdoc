@extends('admin.layout.base')

@section('title', 'Dashboard - blog')
@push('custom-css')
    <link href="{{ asset('assets/admin/lib/data-tables/dataTables.bootstrap4.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/lib/data-tables/responsive.bootstrap4.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/lib/sweet-alerts2/sweetalert2.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/css/sweet-alert-custom.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/css/plugins/plugins.css') }}" rel="stylesheet">
@endpush
@section('adminContent')
    <div class="page-subheader mb-30">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-md-7">
                    <div class="list">
                        <div class="list-item pl-0">
                            <div class="list-thumb ml-0 mr-3 pr-3  b-r text-muted">
                                <i class="nav-thumbnail">DP</i>
                            </div>
                            <div class="list-body">
                                <div class="list-title fs-2x">
                                    <h3>Blog</h3>
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
                            <li class="breadcrumb-item active">blog</li>
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
                        <h6 class="pl-3 pr-3 text-capitalize font400 mb-20">blog</h6>
                        <button type="button" class="btn btn-success mb-2 mr-3" data-toggle="modal" data-backdrop="static" data-keyboard="false" data-target="#formModal" onclick="show(null)">Add blog</button>
                </div>
                <table id="datatableblog" class="table mb-0 table-striped" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Photo</th>
                            <th>Highlight Status</th>
                            <th>Publish Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $no=1;?>
                        @foreach($models as $item)
                        <tr>
                            <td>{{$no++}}</td>
                            <td>{{$item->name}}</td>
                            <td><img src="/assets/images/blog/{{$item->image}}" alt="{{$item->image}}" style="width:100px;"></td>
                            <td>
                                @if ($item->is_highlighted == 1)
                                    <div class="customUi-switchToggle switchToggle-primary">
                                        <input type="checkbox" id="switch2{{$item->id}}" oninput="updateHighlight({{$item->id}})" name="is_highlighted" value="{{$item->id}}" checked="true">
                                        <label for="switch2{{$item->id}}">
                                            <span class="label-switchToggle"></span>
                                            <span class="label-helper"></span>
                                        </label>
                                    </div>
                                @else
                                <div class="customUi-switchToggle switchToggle-primary">
                                        <input type="checkbox" id="switch2{{$item->id}}" oninput="updateHighlight({{$item->id}})" name="is_highlighted" value="{{$item->id}}">
                                        <label for="switch2{{$item->id}}">
                                            <span class="label-switchToggle"></span>
                                            <span class="label-helper"></span>
                                        </label>
                                    </div>
                                @endif
                            </td>
                            <td>
                                @if ($item->is_published == 1)
                                    <div class="customUi-switchToggle switchToggle-primary">
                                        <input type="checkbox" id="switch{{$item->id}}" oninput="updatePublish({{$item->id}})" name="is_published" value="{{$item->id}}" checked="true">
                                        <label for="switch{{$item->id}}">
                                            <span class="label-switchToggle"></span>
                                            <span class="label-helper"></span>
                                        </label>
                                    </div>
                                @else
                                <div class="customUi-switchToggle switchToggle-primary">
                                        <input type="checkbox" id="switch{{$item->id}}" oninput="updatePublish({{$item->id}})" name="is_published" value="{{$item->id}}">
                                        <label for="switch{{$item->id}}">
                                            <span class="label-switchToggle"></span>
                                            <span class="label-helper"></span>
                                        </label>
                                    </div>
                                @endif
                            </td>
                            <th>
                            <div class="row d-flex justify-content-first">
                                <a href="{{ route('admin.blogphoto.index', ['id' => $item->id]) }}" class="btn btn-success ml-2 btn-sm"><i class="fas fa-images"></i></a>
                                <button class="btn btn-primary btn-sm ml-2" data-toggle="modal" data-target="#formModal" data-backdrop="static" data-keyboard="false" onclick="show({{$item->id}})"><i class="fa fa-pencil-alt"></i></button>
                                <!-- <form method="POST" action="{{route('admin.blog.delete',['id'=>$item->id])}}">
                                    @method('delete')
                                    @csrf
                                    <button type="submit" class="btn btn-danger btn-sm ml-2" onclick="return confirm('Do you really want to delete {{$item->name}} ?')"><i class="fa fa-trash"></i></button>
                                </form> -->
                                <button type="submit" class="btn btn-danger btn-sm ml-2 delete-btn" data-delete="{{ $item->id}}" data-nama="{{ $item->name }}" ><i class="fa fa-trash"></i></button>
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
                    Add blog
                </h4>
            </div>
            <div id="formArea">
            <form id="addblogForm" action="{{ route('admin.blog.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body">
                <div class="page-content">
                    <div class="input-icon-group col-12">
                    <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="image">Image</label>
                            <input type="file" required class="form-control" accept="image/*" id="image" name="image">
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <select class="custom-select mb-3" name="category_id" required>
                                <option selected disabled>Select Category</option>
                                @foreach ($category as $item)
                                    <option value="{{ $item->id }}">{{ $item->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="summernote">Content Description</label>
                            <textarea id="summernote-init" class="summernote-init" required name="content"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="custom-switch ">
                                <input type="checkbox" name="is_published" class="custom-switch-input"
                                    name="is_published">
                                <span class="custom-switch-indicator"></span>
                                <span class="custom-switch-description">Is Published</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="custom-switch ">
                                <input type="checkbox" name="is_highlighted" class="custom-switch-input">
                                <span class="custom-switch-indicator"></span>
                                <span class="custom-switch-description">Is Highlighted</span>
                            </label>
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
        <script type="text/javascript" src="{{ asset('assets/admin/lib/sweet-alerts2/sweetalert2.min.js') }}"></script>
        <script src="{{ asset('assets/admin/js/plugins-custom/sweetalert2-custom.js') }}"></script>
        <script src="{{ asset('assets/admin/js/plugins-custom/datatables-custom.js') }}"></script>
        <script>
            $(document).ready(function() {
                $('#datatableblog').DataTable({responsive:true});
            });

            function show(id) {
                $(document).ready(function() {
                    $('.summernote-init').summernote({
                        height: 150,
                        minHeight: null,
                        maxHeight: null,
                        focus: true,
                        dialogsFade: true,
                        dialogsInBody: true,
                        placeholder:'Your Message Here'
                    });
                });
                if (id == null) {
                    console.log('bisa')
                    $("#formModalLabel").html("Add Blog");
                    $("#formArea").html(`
                    <form id="addblogForm" action="{{ route('admin.blog.store') }}" method="POST" enctype="multipart/form-data">
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
                                <input type="file" required class="form-control" id="image" name="image" accept="image/*">
                            </div>
                            <div class="form-group">
                                <label for="category">Category</label>
                                <select class="custom-select mb-3" required name="category_id">
                                    <option selected disabled value="">Select Category</option>
                                    @foreach ($category as $item)
                                        <option value="{{ $item->id }}">{{ $item->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="summernote">Content Description</label>
                                <textarea id="summernote-init" class="summernote-init" required name="content"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="custom-switch ">
                                    <input type="checkbox" name="is_published" class="custom-switch-input"
                                        name="is_published">
                                    <span class="custom-switch-indicator"></span>
                                    <span class="custom-switch-description">Is Published</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="custom-switch ">
                                    <input type="checkbox" name="is_highlighted" class="custom-switch-input">
                                    <span class="custom-switch-indicator"></span>
                                    <span class="custom-switch-description">Is Highlighted</span>
                                </label>
                            </div>
                        </div>
                    </div>
                <div class="modal-footer d-flex justify-content-center m-0">
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button class="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
                </div>
                </form>`);
                $('#summernote').summernote('destroy');
                } else {
                    $.get("{{ url("dashboard/blog/show") }}/" + id, {}, function(data, status) {
                        console.log(status);
                        $(document).ready(function() {
                            $('.summernote-init').summernote({
                                height: 150,
                                minHeight: null,
                                maxHeight: null,
                                focus: true,
                                dialogsFade: true,
                                dialogsInBody: true,
                                placeholder:'Your Message Here'
                            });
                        });
                        $('#summernote').summernote('destroy');
                        $("#formModalLabel").html("Update Blog");
                        $("#formArea").html(data);
                        $("#formModal").modal("show");
                    });
                }
            }

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
                        url: `{{ url('/dashboard/blog/delete/${id}') }}`,
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

            function updatePublish(id, stats) {
            $.get("{{ url("dashboard/blog/checkHighlight") }}/" + id, {}, function(data, status) {
                    if (data == "highlighted") {
                        $.get("{{ url("dashboard/blog/updatePublish") }}/" + id, {}, function(data, status) {})
                        location.reload();
                    } else {
                        $.get("{{ url("dashboard/blog/updatePublish") }}/" + id, {}, function(data, status) {})
                        // location.reload();
                    }
                });
            }

            function updateHighlight(id, stats) {
                $.get("{{ url("dashboard/blog/checkPublish") }}/" + id, {}, function(data, status) {
                    if (data == "not_published") {
                        $.get("{{ url("dashboard/blog/updateHighlight") }}/" + id, {}, function(data,status) {})
                        location.reload();
                    } else {
                        $.get("{{ url("dashboard/blog/updateHighlight") }}/" + id, {}, function(data,status) {})
                        // location.reload();
                    }
                });
            }
        </script>
    @endpush