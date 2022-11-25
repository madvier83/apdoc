@extends('frontend.template.base')
@section('title', 'About Legacy Vape Store')
@section('content')
    <div class="page-titles-img title-space-lg parallax-overlay bg-parallax" data-jarallax='{"speed": 0.4}' style='background-image: url("assets/images/banner/aboutus.jpg");background-position:top center;'>
        <div class="container">
            <div class="row">
                <div class=" col-md-12">
                    <h1 class="text-uppercase">About us</h1>
                </div>
            </div>
        </div>
    </div><!--page title end-->
    <div class="container mb40"></div>
    <div class="container mb40">
        <div class="row">
            <div class="col-md-10 ml-auto mr-auto">
                <p class="lead tritary-font mb50 text-center">
                {!! $aboutus !!}
                </p>
            </div>
        </div>
    </div>
@endsection