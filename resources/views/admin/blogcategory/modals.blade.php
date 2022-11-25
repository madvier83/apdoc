<?php
use App\Models\BlogCategory;
?>
<form  method="POST" id="editCategoryForm" action="{{ route('admin.blogcategory.update',['id'=>$data->id]) }}" enctype="multipart/form-data">
    @csrf
    {{ method_field('PUT') }}
            <div class="modal-body">
                <div class="page-content">
                <div class="input-icon-group col-12">
                <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" id="name" name="name" value="{{ $data->name}}" required>
                        </div>
                        <div class="form-group">
                            <label for="parent_">Parent</label>
                            <select class="custom-select" required name="parent_id">
                                @if ($data->parent_id == null)
                                    <option selected disabled>Select Parent</option>
                                @else
                                    <option disabled>Select Parent</option>
                                @endif
                                @foreach(BlogCategory::where('parent_id', null)->get() as $item)
                                    @if ($data->parent_id != null)
                                        @if ($item->id == $data->parent_id)
                                            <option selected value="{{$item->id}}">{{$item->name}}</option>
                                        @else
                                            <option value="{{$item->id}}">{{$item->name}}</option>
                                        @endif
                                    @else
                                        @if(BlogCategory::where('parent_id','=','id'))
                                        <option value="{{$item->id}}">{{$item->name}}</option>
                                        @endif
                                    @endif
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="seed">Seed</label>
                            <input type="number" class="form-control" id="seed" value="{{ $data->seed}}" name="seed" min="1" required>
                        </div>
                </div>
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-center m-0">
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <button class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
</form>