@extends('frontend.template.base')
@section('title', 'Blog Legacy Vape Store')
@section('content')
        <div class="page-titles-img title-space-lg bg-parallax parallax-overlay mb70" data-jarallax='{"speed": 0.2}' style='background-image: url("assets/images/banner/news.jpg")'>
            <div class="container">
                <div class="row">
                    <div class=" col-md-8 ml-auto mr-auto">
                        <h1 class='text-uppercase'> {{ $name->name }} - Legacy Vape </h1>
                    </div>
                </div>
            </div>
        </div><!--page title end-->
        <div class="container pb50">
            <div class="row">
                <div class="col-md-9 mb40">    
                @foreach($detail as $item)
                <article>
                        <div class="carousel-image owl-carousel owl-theme" style="">
                            @foreach($imagePhotos as $items)
                            <img src="/assets/images/blog/photo/{{$items->image}}" class="img-fluid" style="width:100%; height:400px;" alt="">
                            @endforeach
                        </div>
                        <div class="post-content">
                            <h3>{{ $item->Nama }}</h3>
                            <ul class="post-meta list-inline">
                                <li class="list-inline-item">
                                    <i class="fa fa-calendar-o"></i>{{ $item->created_at}}
                                </li>
                                <li class="list-inline-item">
                                    <i class="fa fa-tags"></i><a href="{{ route('blogcategory', ['slug' => $item->slug]) }}">{{ $item->name }}</a>
                                </li>
                            </ul>
                            <div class="content">
                                {!! $item->content !!}
                            </div>
                        </div>
                    </article><!-- post article-->
                    @endforeach
                </div>
                <div class="col-md-3 mb40">
                    <div class="mb40">
                        <h4 class="sidebar-title">Categories</h4>
                        <ul class="list-unstyled categories">
                        @foreach ($blogCategory::where('parent_id', null)->orderBy('seed', 'asc')->get() as $item)
                            <li><a href="{{ route('blogcategory', ['slug' => $item->slug]) }}">{{$item->name}}</a>
                            @foreach($blogCategory::where('parent_id', $item->id)->orderBy('seed', 'asc')->get() as $subItem)
                                <ul class="list-unstyled">
                                    <li><a href="{{ route('blogcategory', ['slug' => $subItem->slug]) }}">{{$subItem->name}}</a></li>
                                </ul>
                            @endforeach
                            </li>
                            @endforeach
                        </ul>
                    </div><!--/col-->
                    <div>
                        <h4 class="sidebar-title">Related post</h4> 
                        <ul class="list-unstyled">
                            @foreach($related as $item)
                            <li class="media mb-2">
                                <img class="d-flex mr-3 img-fluid" width="64" src='/assets/images/blog/{{$item->image}}' alt="Generic placeholder image">
                                <div class="media-body">
                                    <h5 class="mt-0 mb-1"><a href="{{ route('blogdetail', ['slug' => $item->slug]) }}">{{ $item->name }}</a></h5>
                                    {{date('d, M Y', strtotime($item->created_at))}}
                                </div>
                            </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        </div>
@endsection