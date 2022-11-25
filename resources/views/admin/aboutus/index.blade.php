@extends('admin.layout.base')
@section('title', 'Dashboard - About Us')
@push('custom-css')
@endpush
@section('adminContent')
<div class="page-content">
    <div class="container-fluid">
        <form action="{{ route('admin.aboutus.update') }}" method="POST" enctype="multipart/form-data">
        @csrf
        {{ method_field('PUT') }}
        <div class="form-group">
            <h4 for="summernote" class="mt-3 text-center">About Us</h4>
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
            <textarea id="summernote-init" class="summernote-init" name="content">{{$models->value}}</textarea>
        </div>
        <div class="text-right">
        <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
        </form>
    </div>
</div>
@endsection
    @push('custom-js')
        <script>
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
        </script>
    @endpush