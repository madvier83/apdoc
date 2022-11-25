<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Dashboard</title>
    <!-- Bootstrap-->
    <link href="{{ asset('assets/admin/lib/bootstrap/dist/css/bootstrap.min.css') }}" rel="stylesheet">
    <!--Common Plugins CSS -->
    <link href="{{ asset('assets/admin/css/plugins/plugins.css') }}" rel="stylesheet">
    <!--fonts-->
    <link href="{{ asset('assets/admin/lib/line-icons/line-icons.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/lib/font-awesome/css/fontawesome-all.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/css/style.css') }}" rel="stylesheet">
</head>
<body class='bg-light'>

<div class="page-wrapper" id="page-wrapper">

    <main class="content">

        <div class="container flex d-flex">
            <div class='row flex align-items-center'>
                <div class='col-lg-4 mt-60 mb-60 col-md-6 col-sm-12 ml-auto mr-auto'>
                    <div class="bg-white shadow-sm overflow-hidden rounded">
                        @if ($message = Session::get('fail'))
                            <div class="alert alert-danger alert-block">
                                <strong>{{ $message }}</strong>
                            </div>
                        @endif
                        <div class="p-4 text-center bg-dark-active text-white">
                            <a href="index.html" class="avatar avatar60 ml-auto mr-auto bg-gradient-primary text-white rounded-circle">
                                <i class="icon-Paper-Plane"></i> </a>
                            <h5 class='text-center h5 pt-10 mb-0 text-white'>Welcome to Legacy Vape Store Admin Dashboard, Please login!</h5>
                        </div>
                        <div class="p-3 pt-30 pb-30">
                            <form action="{{ route('signin') }}" role="form" method="POST">
                                {{ @csrf_field() }}
                                <div class="input-icon-group">
                                    <div class="d-flex flex flex-row">
                                        <label class="flex d-flex mr-auto" for='pass'>Username</label>
                                    </div>
                                    <div class='input-icon-append'>
                                        <i class="fa fa-user"></i>
                                        <input placeholder="Username" type="text" class="form-control" name="username">
                                    </div>
                                </div>
                                <div class="input-icon-group">
                                    <div class="d-flex flex flex-row">
                                        <label class="flex d-flex mr-auto" for='pass'>password</label>
                                    </div>
                                    <div class='input-icon-append'>
                                        <i class="fa fa-lock"></i>
                                        <input id="pass" placeholder="Password" type="password" class="form-control" name="password">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-gradient-primary btn-block btn-lg">Sign In</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div><!-- main end-->
        <footer class="content-footer bg-light b-t">
            <div class="d-flex flex align-items-center pl-15 pr-15">
                <div class="d-flex flex p-3 mr-auto ml-auto justify-content-center">
                    <div class="text-muted">2022 Developed By <a href="https://cursor.id/" target="_blank">CUURSOR ID</a></div>
                </div>
            </div>
        </footer><!-- footer end-->
    </main><!-- page content end-->
</div><!-- app's main wrapper end -->
<!-- Common plugins -->
<script type="text/javascript" src="{{ asset('assets/admin/js/plugins/plugins.js') }}"></script>
<script type="text/javascript" src="{{ asset('assets/admin/js/appUi-custom.js') }}"></script>
</body>
</html>
