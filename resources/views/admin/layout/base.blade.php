<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>@yield('title')</title>
    <!-- Bootstrap-->
    <link href="{{ asset('assets/admin/lib/bootstrap/dist/css/bootstrap.min.css') }}" rel="stylesheet">
    <!--Common Plugins CSS -->
    <link href="{{ asset('assets/admin/css/plugins/plugins.css') }}" rel="stylesheet">
    <!--fonts-->
    <link href="{{ asset('assets/admin/lib/line-icons/line-icons.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/lib/font-awesome/css/fontawesome-all.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/lib/chartist/chartist.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/admin/css/chartist-custom.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/admin/lib/summernote/summernote-bs4.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/admin/css/style.css') }}" rel="stylesheet">
    <!-- Custom CSS -->
    @stack('custom-css')
    <!-- jvectormap -->
    <link href="{{ asset('assets/admin/lib/vector-map/jquery-jvectormap-2.0.2.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/admin/css/style.css') }}" rel="stylesheet">
</head>
<body>

<div class="page-wrapper" id="page-wrapper">
    @include('admin.layout.sidemenu')
    <main class="content">
        @include('admin.layout.header')
        @yield('adminContent')
        <footer class="content-footer bg-light b-t">
            <div class="d-flex flex align-items-center pl-15 pr-15">
                <div class="d-flex flex p-3 mr-auto justify-content-end">
                    <div class="text-muted">Developed By <a href="https://cursor.id/" target="_blank">CURSOR.ID</a></div>
                </div>
            </div>
        </footer><!-- footer end-->
    </main><!-- page content end-->
</div><!-- app's main wrapper end -->
<!-- Common plugins -->
<script type="text/javascript" src="{{ asset('assets/admin/js/plugins/plugins.js') }}"></script>
<script type="text/javascript" src="{{ asset('assets/admin/js/appUi-custom.js') }}"></script>
<script type="text/javascript" src="{{ asset('assets/admin/lib/chartjs/dist/chart.min.js') }}"></script>
<script type="text/javascript" src="{{ asset('assets/admin/lib/peity/jquery.peity.min.js') }}"></script>
<script src="{{ asset('assets/admin/lib/bootstrap/dis/js/bootstrap.min.js') }}"></script>
<script src="{{ asset('assets/admin/lib/chartist/chartist.min.js') }}"></script>
<script src="{{ asset('assets/admin/lib/chartist/chartist-tooltip.js') }}"></script>
<script src="{{ asset('assets/admin/lib/summernote/summernote-bs4.min.js') }}"></script>
<!-- custom js -->
@stack('custom-js')
<!-- jvectormap -->
<script src="{{ asset('assets/admin/lib/vector-map/jquery-jvectormap-2.0.2.min.js') }}"></script>
<script src="{{ asset('assets/admin/lib/vector-map/jquery-jvectormap-world-mill-en.js') }}"></script>
<script type="text/javascript" src="{{ asset('assets/admin/js/dashboard.custom.js') }}"></script>
</body>
</html>
