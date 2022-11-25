<?php
function set_active( $route ) {
    if( is_array( $route ) ){
        return in_array(Request::path(), $route) ? 'active' : '';
    }
    return Request::path() == $route ? 'active' : '';
}
?>
<aside id="page-aside" class=" page-aside aside-fixed">
    <div class="sidenav darkNav">
        <a href="{{ url('dashboard') }}" class="app-logo d-flex flex flex-row align-items-center overflow-hidden justify-content-center">
            <img src="{{asset('assets/images/favicon.png')}}" width={{20}} alt="">
            <span class="logo-text d-inline-flex"> <span class='font700 d-inline-block mr-1'>Legacy</span> Vapestore</span>
        </a>
        <div class="flex">
            <div class="aside-content slim-scroll">
                <ul class="metisMenu" id="metisMenu">
                    <li class="nav-title">Main</li>
                    <li class="{{ set_active('dashboard') }}"> <i class="icon-Gaugage nav-thumbnail"></i>
                        <a href="{{ url('dashboard') }}">
                            <span class="nav-text">Dashboard</span>
                        </a>
                    </li><!--Dashboard-->

                    <li class="{{ set_active('dashboard/product-category') }} {{ set_active('dashboard/product') }}"> <i class="icon-Tablet nav-thumbnail"></i>
                        <a class="has-arrow" href="javascript:void(0)">
                            <span class="nav-text">
                                Manage Products
                            </span>
                        </a>
                        <ul aria-expanded="true">
                            <li class="{{ set_active('dashboard/product-category') }}"><span class="nav-thumbnail">Cp</span>
                                <a href="{{ url('dashboard/product-category')}}">Category Product</a>
                            </li>
                            <li class="{{ set_active('dashboard/product') }}"><span class="nav-thumbnail">Dp</span>
                                <a href="{{ url('dashboard/product') }}">Detail Product</a>
                            </li>
                        </ul>
                    </li><!--Manage Product-->

                    <li class="{{ set_active('dashboard/blog-category') }} {{ set_active('dashboard/blog') }} {{ set_active('dashboard/blog-photo/*') }}"><i class="icon-Tablet nav-thumbnail"></i>
                        <a class="has-arrow" href="javascript:void(0)">
                            <span class="nav-text">
                                Manage Blog
                            </span>
                        </a>
                        <ul aria-expanded="false">
                            <li class="{{ set_active('dashboard/blog-category') }}"><span class="nav-thumbnail">Cb</span>
                                <a href="{{ url('dashboard/blog-category') }}">Category Blog</a>
                            </li>
                            <li class="{{ set_active('dashboard/blog') }} {{ set_active('dashboard/blog-photo/*') }}"><span class="nav-thumbnail">Db</span>
                                <a href="{{ url('dashboard/blog') }}">Detail Blog</a>
                            </li>
                        </ul>
                    </li><!--Manage Blog-->

                    <li class="nav-title">Company Profile</li>
                    <li class="{{ set_active('dashboard/headlines') }}"> <i class="icon-Duplicate-Window nav-thumbnail"></i>
                        <a href="{{ url('dashboard/headlines') }}">
                            <span class="nav-text">Manage Headline</span>
                        </a>
                    </li><!--Manage Headline-->

                    <li class="{{ set_active('dashboard/contactus') }}"> <i class="icon-Mail nav-thumbnail"></i>
                        <a href="{{ url('dashboard/contactus') }}">
                            <span class="nav-text">Contact Us</span>
                        </a>
                    </li><!--Manage Contact Us-->

                    @if(Auth::user()->roles=='super_admin'||Auth::user()->roles=='user_admin')
                    <li class="nav-title">Users</li>
                    <li class="{{ set_active('dashboard/users') }}"> <i class="icon-Checked-User nav-thumbnail"></i>
                        <a href="{{ url('dashboard/users') }}">
                            <span class="nav-text">Manage Users</span>
                        </a>
                    </li><!--Manage users-->
                    @endif
                    
                    <li class="nav-title">Settings</li>
                    <li class="{{ set_active('dashboard/settings') }}"> <i class="icon-Settings-Window nav-thumbnail"></i>
                        <a href="{{ url('/dashboard/settings') }}" class="{{ Request::is('dashboard/settings') ? 'active' : '' }}">
                            <span class="nav-text">Settings</span>
                        </a>
                    </li><!--Manage Settings-->


                    <li class="{{ set_active('dashboard/aboutus') }}"> <i class="icon-Security-Check nav-thumbnail"></i>
                        <a href="{{ url('/dashboard/aboutus') }}">
                            <span class="nav-text">About Us</span>
                        </a>
                    </li><!--Manage About Us-->
                </ul>
            </div><!-- aside content end-->
        </div><!-- aside hidden scroll end-->
        <div class="aside-footer p-3 pl-25">
            <div class="">
                App Version - 1.0
            </div>
        </div><!-- aside footer end-->
    </div><!-- sidenav end-->
</aside><!-- page-aside end-->
