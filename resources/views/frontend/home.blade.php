@extends('frontend.template.base')
@section('title', 'Legacy Vape Store')
@section('content')
    <div class="owl-main-slide owl-carousel carousel-dark owl-theme fullscreen">
        @foreach($headlines as $item)
        <div class="item bg-parallax fullscreen parallax-overlay"
             style='background-image: url("assets/images/headline/{{$item->image}}");'>
            <div class="d-flex align-items-center">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 ml-auto mr-auto text-center">
                            <h3 class="text-white h1 font700 text-capitalize mb20">
                                {{$item->header}}
                            </h3>
                            <p class="text-white-gray">
                                {{$item->caption}}
                            </p>
                            <a href="//{{$item->target_url}}" target="_blank" class="btn btn-white-outline btn-rounded">{{$item->cta_button}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>
{{--    <div class="cta bg-faded pt50 pb50">--}}
{{--        <div class="container">--}}
{{--            <div class="row">--}}
{{--                <div class="col-lg-9">--}}
{{--                    <h3>We provide the great support to our customers</h3>--}}
{{--                </div>--}}
{{--                <div class="col-lg-3">--}}
{{--                    <a href="#" class="btn btn-rounded btn-lg btn-dark">--}}
{{--                        Buy Now--}}
{{--                    </a>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    </div>--}}
    <!-- Product -->
    <div class="container pt90 pb60">
        <div class="title-heading1 mb40">
            <h3>Our Products</h3>
        </div>
        <div class="row">
            @foreach($products as $item)
            <div class="col-md-6 col-lg-3 mb40">
                    <div class="simple-hover" style="cursor:pointer; height:255px;">
                        <img src="assets/images/product/{{ $item->image }}" alt="" class="img-fluid" width={{350}}>
                    </div>
                    <div class="clearfix product-meta">
                        <p class="lead mb0"><a href="#">{{ $item->name }}</a></p>
                        <h4 class=""> Rp. {{$item->price}}</h4>
                        <p>{{ $categoryModel::find($item->category_id)->name }}</p>
                        <a href="//{{ $item->link_to_olsera }}" target="_blank" class="btn btn-primary btn-sm">Link to Olsera</a>
                    </div>
                </div><!--/col-->
            @endforeach
        </div>
    </div>
    <!-- Blog -->
    <div class='bg-gray'>
        <div class='container pt100 pb60'>
            <div class="title-heading1 mb40">
                <h3>Latest News</h3>
            </div>
            <div class="row">
                @foreach($blogg as $item)
                @if($item->is_highlighted == 1)
                <div class="col-lg-4 mb30 wow fadeInUp" data-wow-delay=".4s">
                    <div class="entry-card">
                        <a href="{{ route('blogdetail',['slug'=>$item->slug]) }}" class="entry-thumb" style="height:200px;">
                            <img src="/assets/images/blog/{{$item->image}}" alt="{{$item->slug}}" class="img-fluid">
                            <span class="thumb-hover ti-back-right"></span>
                        </a><!--/entry thumb-->
                        <div class="entry-content">
                            <div class="entry-meta mb5">
                                    <span>
                                        {{date('d, M Y', strtotime($item->created_at))}}
                                    </span>
                            </div>
                            <h4 class="entry-title text-capitalize">
                                <span>
                                    {{$item->name}}
                                </span>
                            </h4>
                            <p>
                            {!! Str::limit($item->content, 200, '...') !!}
                            </p>
                            <div class="text-right">
                                <a href="{{ route('blogdetail',['slug'=>$item->slug]) }}" class="btn-link btn">Read More</a>
                            </div>
                        </div><!--/entry content-->
                    </div>
                </div><!--/.col-->
                @endif
                @endforeach
            </div>
        </div>
    </div>
@endsection