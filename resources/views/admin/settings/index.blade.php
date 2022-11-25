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
                                <i class="icon-Settings-Window nav-thumbnail"></i>
                            </div>
                            <div class="list-body">
                                <div class="list-title fs-2x">
                                    <h3>Settings</h3>
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
                            <li class="breadcrumb-item active">Settings</li>
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
            <div class="bg-white table-reponsive rounded shadow-sm pt-3 pb-3 mb-30">
                <div class="d-flex justify-content-between">
                        <h6 class="pl-3 pr-3 text-capitalize font400 mb-20">Settings</h6>
                        @if ($wa && $lk && $ma && $em && $ad && $ig && $tt && $yt && $fb)
                        @else
                        <a href="javascript:void(0);" name="tambah" role="button" id="btnTambah" class="btn btn-success mb-2 mr-3"
                data-toggle="modal" data-backdrop="static" data-keyboard="false" data-target="#formModal">Add Settings</a>
                        @endif
                </div>
                <table id="datatableuser" class="table mb-0 table-striped" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Key</th>
                            <th style="width:60%;">Value</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php $no=1?>
                    @foreach($models as $item)
                        <tr>
                            @if($item->type=='longtext')
                            @else
                            <td>{{$no++}}</td>
                            <td>{{$item->key}}</td>
                            <th>{!! Str::limit($item->value, 60, '...') !!}</th>
                            <th>
                                <div class="row d-flex justify-content-first w-100">
                                <button class="btn btn-primary btn-sm ml-2 editconfirm" data-toggle="modal" data-setting="{{ $item->id }}" data-key="{{ $item->key }}"><i class="fa fa-pencil-alt"></i></button>
                                {{--    <form method="POST" action="{{route('admin.settings.delete',['id'=>$item->id])}}">
                                    @method('delete')
                                    @csrf
                                    <button type="submit" class="btn btn-danger btn-sm ml-2" data-backdrop="static" data-keyboard="false" onclick="return confirm('Do you really want to delete {{$item->key}} ?')"><i class="fa fa-trash"></i></button>
                                </form> --}}
                                <button class="btn btn-danger btn-sm ml-2 delete-btn " data-delete="{{ $item->id }}"><i class="fas fa-trash"></i></button>
                                </div>
                            </th>
                            @endif
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="formModalLabel"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="form-settings" class="clearform">
                            <input type="hidden" name="metode" id="metode">
                            <input type="hidden" name="id" id="id">
                            @csrf
                            <div class="form-group">
                                <select class="custom-select keys" id="keys" name="keys" required
                                    oninvalid="this.classList.add('is-invalid')">
                                    <option value="" selected disabled>Key</option>
                                    @if (!$wa)
                                        <option value="whatsapp_number">Whatsapp Number</option>
                                    @endif
                                    @if (!$ma)
                                        <option value="map_address">Map Addres</option>
                                    @endif
                                    @if (!$lk)
                                        <option value="link_yt">Link Youtube</option>
                                    @endif
                                    @if (!$em)
                                        <option value="email">Email</option>
                                    @endif
                                    @if (!$ad)
                                        <option value="address">Address</option>
                                    @endif
                                    @if (!$ig)
                                        <option value="instagram">Instagram</option>
                                    @endif
                                    @if (!$tt)
                                        <option value="tiktok">Tiktok</option>
                                    @endif
                                    @if (!$yt)
                                        <option value="youtube">Youtube</option>
                                    @endif
                                    @if (!$fb)
                                        <option value="address">Facebook</option>
                                    @endif
                                    @if (!$ls)
                                        <option value="link_store">Link Store</option>
                                    @endif
                                    @if (!$tw)
                                        <option value="twitter">Twitter</option>
                                    @endif
                                </select>
                                <div class="invalid-feedback">
                                    Please choose the key.
                                </div>
                            </div>
                                <div class="form-group mt-4">
                                    <input type="text" class="form-control editss" id="datavalue" name="text" required>
                                </div>
                          {{--<div class="form-group">
                                <select class="custom-select mt-4" id="type" name="type" required
                                    oninvalid="this.classList.add('is-invalid')">
                                    <option value="" selected disabled>Type</option>
                                    <option value="number">Number</option>
                                    <option value="text">String</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please choose the type.
                                </div>
                            </div>--}}
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="cls" data-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" id="btn-save">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
                $('#datatableuser').DataTable({responsive:true});
            });
            $('#btnTambah').click(() => {
            $('#formModalLabel').html("Create Settings");
            $('#btn-save').html("Save Data");
            $('#metode').val('tambah');
            })
            $('#btn-save').click((e) => {
            e.preventDefault();
            let form = $('#form-settings').serialize();
            $.ajax({
                url: "{{ route('admin.settings.store') }}",
                type: "POST",
                data: form,
                dataType: "JSON",
                success: function() {
                    $('#formModal').modal('hide')
                    $("#form-settings")[0].reset();
                    $('#alerto').removeClass("d-none")
                    $('#pesan').text("Successfully Creating/Updating Data")
                    setInterval(() => {
                        location.href = "{{ route('admin.settings.index') }}"
                    }, 1000);
                },
                error: () => {

                }
            })
            });
            //    Edit Post
            $('body').on('click', '.editconfirm', function() {
            let data_id = $(this).data('setting')
            let data_key = $(this).data('key')
            let dynamic = document.getElementById('dynamic-option');
            $('#keys').html(`<option value="${data_key}">${data_key}</option>`)
            $.get('/dashboard/settings/edit/' + data_id, function(data) {
                $('#crudModalLabel').html("Edit Settings");
                
                $('#btn-save').html("Save Data");
                $('#formModal').modal('show')
                $('#id').val(data.id)
                $('#keys').val(data.key)
                $('#datavalue').val(data.value);
                $('#type').val(data.type)
                let template = `<div class="form-group">
                    <input type="text" class="form-control editss" name="text" required value="${data.value}">
                    </div>`;
                dynamic.innerHTML = template
                $('editss').val(data.value)
                })
            });

            $('#cls').click(()=>{
                document.getElementById('form-settings').reset();
                console.log("clear");
            })

            $('.delete-btn').click(function (e) {
            e.preventDefault();
            let id = $(this).data('delete');
            console.log(id);
            swal({
                title: 'Are you sure want to delete ?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn btn-confirm mt-2',
                cancelButtonClass: 'btn btn-secondary ml-2 mt-2',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if(result){
                    $.ajax({
                        url: `{{ url('/dashboard/settings/delete/${id}') }}`,
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

            $('#keys').change(function() {
                let s = $(this).find(":selected").val();
                let val = document.getElementById('datavalue');
                val.value('');
            });
            // $('#type').change(function() {
            // let template = '';
            // let value = $(this).find(":selected").val();
            // let dynamic = document.getElementById('dynamic-option');
            // if (value == 'number') {
            //     console.log('number')
            //     template += ` <div class="form-group mt-4">
            //         <input type="number" class="form-control editss" name="text" required >
            //         </div>`
            // } else {
            //     template += ` <div class="form-group mt-4">
            //         <input type="text" class="form-control editss" name="text" required>
            //         </div>`
            // }
            // dynamic.innerHTML = template;
            // });
        </script>
@endpush