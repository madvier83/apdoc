{{ - <form  method="POST" id="editHeadlinesForm" action="{{ route('admin.headlines.update',['id'=>$data->id]) }}" enctype="multipart/form-data">
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
                            <label for="seed">Seed</label>
                            <input type="number" class="form-control" id="seed" name="seed" value="{{$data->seed}}" required>
                        </div>
                        <div class="form-group">
                            <label for="image">Image</label>
                            <input type="file" class="form-control" id="image" name="image">
                        </div>
                        <div class="form-group">
                            <label for="header">Header</label>
                            <input type="text" class="form-control" id="header" name="header" value="{{$data->header}}" required>
                        </div>
                        <div class="form-group">
                            <label for="caption">Caption</label>
                            <input type="text" class="form-control" id="caption" name="caption" value="{{$data->caption}}">
                        </div>
                        <div class="form-group">
                            <label for="cta_button">CTA Button Text ( Optional )</label>
                            <input type="text" class="form-control" id="cta_button" name="cta_button" value="{{$data->cta_button}}">
                        </div>
                        <div class="form-group">
                            <label for="target_url">Target Url ( Optional )</label>
                            <input type="text" class="form-control" id="target_url" name="target_url" value="{{$data->target_url}}" >
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-center m-0">
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <button class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
</form> - }}