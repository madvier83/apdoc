@extends('frontend.template.base')
@section('title', 'Blog Legacy Vape Store')
@section('content')
<div class="page-titles-img title-space-lg bg-parallax parallax-overlay mb70" data-jarallax='{"speed": 0.2}' style='background-image: url("/assets/images/banner/news.jpg");background-position:top center;'>
            <div class="container">
                <div class="row">
                    <div class=" col-md-8 ml-auto mr-auto">
                        <h1 class='text-uppercase'>{{ $getName->name }} - Legacy Vape</h1>
                    </div>
                </div>
            </div>
        </div><!--page title end-->
        <div class="container mb30">
            <div class="row" id="blog-masonry">
                @foreach($byCategory as $item)
                @if( $item->is_published == 1 )
                <article class="col-md-4 post-masonry mb40">                      
                        <img src="/assets/images/blog/{{ $item->image }}" alt="" class="img-fluid mb20" >                     
                    <h4 class="masonry-title mb0">{{ $item->blogName }}</h4>
                    <ul class="post-meta list-inline">
                        <li class="list-inline-item">
                            <i class="fa fa-calendar-o"></i>{{date('d, M Y', strtotime($item->created_at))}}
                        </li>
                        <li class="list-inline-item">
                            <i class="fa fa-tags"></i>{{ $item->name }}
                        </li>
                    </ul>
                    <p>
                    {!! Str::limit($item->content, 200, '...' ) !!}
                    </p>
                    <a href="{{ route('blogdetail',['slug'=>$item->slug]) }}" class='btn btn-outline-secondary btn-sm'>Read More</a>
                </article><!--article post-->
                @endif
                @endforeach
            </div>
        </div>
@endsection