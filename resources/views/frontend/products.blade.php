@extends('frontend.template.base')
@section('title', 'Product Legacy Vape Store')
@section('content')
    <div class="page-titles-img title-space-lg parallax-overlay bg-parallax" data-parallax='{"speed": 0.4}' style='background-image: url("assets/images/banner/product.jpg");background-position:top center;'>
        <div class="container">
            <div class="row">
                <div class=" col-md-12">
                    <h1 class="text-uppercase">Legacy Products</h1>
                </div>
            </div>
        </div>
    </div><!--page title end-->
    <div class="container pt90 pb60">
            <div class="title-heading1 mb40">
                <h2>Products</h2>
            </div>
            <div class="row">
                <div class="col-lg-3 col-md-4 mb40">
                    <div class="mb40">
                        <h4 class="sidebar-title">Categories</h4>
                        <ul class="list-unstyled categories">
                            @foreach ($produkCategory::where('parent_id', null)->orderBy('seed', 'asc')->get() as $item)
                                <li><a href="{{ route('productcategory', ['slug' => $item->slug]) }}">{{ $item->name }}</a>
                                @foreach($produkCategory::where('parent_id', $item->id)->orderBy('seed', 'asc')->get() as $subItem)
                                    <ul class="list-unstyled">
                                        <li><a href="{{ route('productcategory', ['slug' => $subItem->slug]) }}">{{ $subItem->name }}</a></li>
                                    </ul>
                                @endforeach
                                </li>
                            @endforeach
                        </ul>
                    </div><!--/col-->
                </div>
                <div class="col-lg-9">
                    <div class="row">
                    @foreach($produks as $item)
                    <div class="col-md-4 col-lg-3 mb40">
                        <div class="simple-hover" style="cursor:pointer;">
                            <img src="assets/images/product/{{ $item->image }}" alt="" class="img-fluid" width={{350}}>
                        </div>
                        <div class="clearfix product-meta">
                            <p class="lead mb0"><a href="#">{{ $item->name }}</a></p>
                            <h4 class=""> Rp. {{$item->price}}</h4>
                            <a href="//{{ $item->link_to_olsera }}" target="_blank" class="btn btn-primary btn-sm">Link to Olsera</a>
                        </div>
                    </div><!--/col-->
                    @endforeach
                    </div>
                </div>
            </div>
    </div>
@endsection