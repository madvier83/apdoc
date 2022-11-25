<form  method="POST" id="editUserForm" action="{{ route('admin.users.update',['id'=>$data->id]) }}" enctype="multipart/form-data">
    @csrf
    {{ method_field('PUT') }}
            <div class="modal-body">
                <div class="page-content">
                    <div class="input-icon-group col-12">
                            <label for="name" class="mt-2">Name</label>
                            <div class='input-icon-append'>
                                <i class="far fa-user"></i>
                                <input placeholder="Name" name="name" id="name" value="{{ $data->name }}" type="text" class="form-control" required>
                            </div>
                            <label for="username" class="mt-2">Username</label>
                            <div class='input-icon-append'>
                                <i class="fa fa-at"></i>
                                <input placeholder="Username" name="username" id="username" value="{{ $data->username }}" type="text" class="form-control" required>
                            </div>
                            <label for="newpassword" class="mt-2">New Password</label>
                            <div class='input-icon-append'>
                                <i class="fa fa-lock"></i>
                                <input placeholder="Password" type="password" id="password" class="form-control" name="password" required>
                            </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-center m-0">
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <button class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
</form>