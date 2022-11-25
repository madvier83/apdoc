<?php
use App\Models\Blog;
?>

<form id="editphotoForm" action="{{ route('admin.blogphoto.update',['id'=>$data->id]) }}" method="POST" enctype="multipart/form-data">
        @csrf
        {{ method_field('PUT') }}
        <div class="modal-body">
        <div class="page-content">
        <div class="input-icon-group col-12">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" name="name" required value="{{$data->name}}">
                </div>
                <div class="form-group">
                    <label for="image">Image</label>
                    <input type="file" class="form-control" id="image" accept="image/*" name="image">
                </div>
                <div class="form-group d-none">
                <label for="blog">blog</label>
                    <select class="custom-select mb-3" name="blog_id" required>
                        @foreach ( Blog::where("id", $data->blog_id)->get(["id" , "name"]) as $item)
                                <option selected value="{{$item->id}}">{{$item->name}}</option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group">
                    <label for="seed">Seed</label>
                    <input type="number" class="form-control" id="seed" name="seed" min="1" required value="{{$data->seed}}">
                </div>
            </div>
        </div>
        </div>
        <div class="modal-footer d-flex justify-content-center m-0">
                <button type="submit" class="btn btn-primary">Submit</button>
                <button class="btn btn-danger" data-dismiss="modal">Close</button>
        </div>
</form>