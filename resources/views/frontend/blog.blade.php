@extends('frontend.template.base')
@section('title', 'Blog Legacy Vape Store')
@section('content')
<div class="page-titles-img title-space-lg bg-parallax parallax-overlay mb70" data-jarallax='{"speed": 0.2}' style='background-image: url("assets/images/banner/news.jpg");'>
            <div class="container">
                <div class="row">
                    <div class=" col-md-8 ml-auto mr-auto">
                        <h1 class='text-uppercase'>Blog - Legacy Vape</h1>
                    </div>
                </div>
            </div>
        </div><!--page title end-->
        <div class="container mb30">
            <div class="row" id="blog-masonry">
            @foreach($blogs as $item)
                <article class="col-md-4 post-masonry mb40">                      
                    <a href="#"> <img src="/assets/images/blog/{{ $item->image }}" alt="" class="img-fluid mb20" style="height:200px;"></a>                       
                    <a href="#"><h4 class="masonry-title mb0">{{ $item->name }}</h4></a>
                    <ul class="post-meta list-inline">
                        <li class="list-inline-item">
                            <i class="fa fa-calendar-o"></i> <a href="#">{{ $item->created_at }}</a>
                        </li>
                        <li class="list-inline-item">
                            <i class="fa fa-tags"></i> <a href="#"></a>
                        </li>
                    </ul>
                    <p>
                    {!! Str::limit($item->content, 200, '' ) !!}
                    </p>
                    <a href="{{route('blogdetail', ['slug' => $item->slug]) }}" class='btn btn-outline-secondary btn-sm'>Read More</a>
                </article><!--article post-->
                @endforeach
            </div>
        </div>
@endsection