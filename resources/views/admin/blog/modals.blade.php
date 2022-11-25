<?php
use App\Models\BlogCategory;
?>
<form id="editBlogForm" action="{{ route('admin.blog.update',['id'=>$data->id]) }}" method="POST" enctype="multipart/form-data">
            @csrf
            {{ method_field('PUT') }}
            <div class="modal-body">
            <div class="page-content">
                <div class="input-icon-group col-12">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" id="name" name="name" value="{{$data->name}}" required>
                    </div>
                    <div class="form-group">
                        <label for="image">Image</label>
                        <input type="file" class="form-control" id="image" name="image" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select class="custom-select mb-3" name="category_id">
                            <option disabled>Select Category</option>
                            @foreach (BlogCategory::all() as $item)
                                @if ($item->id == $data->category_id)
                                    <option selected value="{{$item->id}}">{{$item->name}}</option>
                                @else
                                    <option value="{{$item->id}}">{{$item->name}}</option>
                                @endif
                            @endforeach 
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="summernote">Content Description</label>
                        <textarea id="summernote-init" class="summernote-init" name="content">{{ $data->content }}</textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer d-flex justify-content-center m-0">
                <button type="submit" class="btn btn-primary">Submit</button>
                <button class="btn btn-danger" data-dismiss="modal">Close</button>
        </div>
</form>