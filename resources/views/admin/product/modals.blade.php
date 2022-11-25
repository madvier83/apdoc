<?php
use App\Models\ProdukCategory;
?>
<form action="{{ route('admin.product.update',['id'=>$data->id]) }}" id="editProductForm"  method="post" enctype="multipart/form-data">
    @csrf
    {{ method_field('PUT') }}
    <div class="modal-body">
        <div class="form-group">
            <label for="exampleInputEmail1">Name</label>
            <input type="text" class="form-control" id="name" name="name" value="{{$data->name}}">
        </div>
        <div class="form-group">
            <label for="image">Image</label>
            <input type="file" class="form-control" id="image" accept="image/*" name="image">
        </div>
        <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" id="price" name="price" value="{{$data->price}}">
        </div>
        <div class="form-group">
            <label for="link">Link Olsera</label>
            <input type="text" class="form-control" id="link_to_olsera" name="link_to_olsera" value="{{$data->link_to_olsera}}">
        </div>
        <div class="form-group">
            <label for="category">Category</label>
            <select class="custom-select mb-3" name="category_id">
                <option disabled>Select Category</option>
                @foreach (ProdukCategory::all() as $item)
                    @if ($item->id == $data->category_id)
                        <option selected value="{{$item->id}}">{{$item->name}}</option>
                    @else
                        <option value="{{$item->id}}">{{$item->name}}</option>
                    @endif
                @endforeach
            </select>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-success">Update Data</button>
    </div>
</form>
