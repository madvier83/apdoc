<?php
function set_active( $route ) {
    if( is_array( $route ) ){
        return in_array(Request::path(), $route) ? 'active' : '';
    }
    return Request::path() == $route ? 'active' : '';
}
?>
<nav class="navbar navbar-expand-lg navbar-light navbar-transparent bg-faded nav-sticky">
    <div class="container">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand" href="{{ url('/') }}">
            <img style="max-height: 40px" class='logo logo-dark' src="{{ asset('assets/images/logo.png') }}" alt="">
            <img style="max-height: 40px" class='logo logo-light hidden-md-down' src="{{ asset('assets/images/logo-light.png') }}" alt="">
        </a>
        <div  id="navbarNavDropdown" class="navbar-collapse collapse">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item {{ set_active('/') }}">
                    <a class="nav-link" href="{{ url('/') }}">Home</a>
                </li>
                <li class="nav-item dropdown {{ set_active('product') }} {{ (request()->is('product/category*')) ? 'active' : '' }}">
                    <a class="nav-link dropdown-toggle" tabindex="-1" data-toggle="dropdown"
                       aria-haspopup="true" aria-expanded="false" href="{{ url('product') }}">Products</a>
                    <ul class="dropdown-menu dropdown-menu-right">
                    @foreach($produkCategory::where('parent_id',null)->orderBy('seed', 'asc')->get() as $item)
                        @foreach($productCategoryChild as $id_parent)
                            @if($loop->first)
                            <li class="{{ $item->id == $id_parent->parent_id ? 'dropdown-submenu' : '' }} dropdown"><a href="{{ route('productcategory', ['slug' => $item->slug]) }}" class="dropdown-item">{{$item->name}}</a>
                                <ul class="dropdown-menu">
                                    @foreach($produkCategory::where('parent_id', $item->id)->orderBy('seed', 'asc')->get() as $subItem) 
                                        <li>
                                            <a href="{{ route('productcategory', ['slug' => $subItem->slug]) }}" class="dropdown-item">{{ $subItem->name }}</a>
                                        </li>
                                    @endforeach
                                </ul>
                            </li>
                            @endif
                        @endforeach
                    @endforeach
                    </ul>
                </li>
                <li class="nav-item dropdown {{ set_active('blog') }} {{ (request()->is('blog/category*')) ? 'active' : '' }}">
                    <a class="nav-link dropdown-toggle" data-toggle="dropdown"
                       aria-haspopup="true" aria-expanded="false" href="{{ url('blog') }}">Blog</a>
                    <ul class="dropdown-menu dropdown-menu-right">
                    @foreach ($blogCategory::where('parent_id', null)->orderBy('seed', 'asc')->get() as $item)
                        @foreach($blogCategoryChild as $id_parent)
                            @if($loop->first)
                            <li class="{{ $item->id == $id_parent->parent_id ? 'dropdown-submenu' : '' }} dropdown"><a href="{{ route('blogcategory', ['slug' => $item->slug]) }}" class="dropdown-item">{{$item->name}}</a>
                                <ul class="dropdown-menu">
                                @foreach($blogCategory::where('parent_id', $item->id)->orderBy('seed', 'asc')->get() as $subItem)
                                    <li>
                                        <a href="{{ route('blogcategory', ['slug' => $subItem->slug]) }}" class="dropdown-item">{{ $subItem->name }}</a>
                                    </li>
                                @endforeach
                                </ul>
                            </li>
                            @endif
                        @endforeach
                    @endforeach
                    </ul>
                </li>
                <li class="nav-item {{ set_active('about-us') }}">
                    <a class="nav-link" href="{{ url('about-us') }}">About Us</a>
                </li>
                <li class="nav-item {{ set_active('contact-us') }}">
                    <a class="nav-link" href="{{ url('contact-us') }}">Contact Us</a>
                </li>
            </ul>
        </div>
        <div class=" navbar-right-elements">
            <ul class="list-inline">
            <li class="list-inline-item"><a href="//{{$linkstore}}" target="_blank" class=" menu-btn"><i class="ti-shopping-cart"></i> <span class="badge badge-default"></span></a></li>
            </ul>
        </div><!--right nav icons-->
    </div>
</nav>
