@extends('frontend.template.base')
@section('title', 'Contact Legacy Vape Store')
@section('extra-link')
    <link type="text/css" rel="stylesheet"  href="{{ asset('assets/smart-form/contact/css/smart-forms.css') }}">
@endsection

@section('content')
    <div class="page-titles-img title-space-lg parallax-overlay bg-parallax" data-jarallax='{"speed": 0.4}' style='background-image: url("assets/images/banner/contactus.jpg");background-position:top center;'>
        <div class="container">
            <div class="row">
                <div class=" col-md-12">
                    <h1 class="text-uppercase">Contact us</h1>
                </div>
            </div>
        </div>
    </div><!--page title end-->
    <div class="container pt90 pb50" id="contact-area">
        <div class="row">
            <div class="col-md-6 mb40">
                <h4 class="text-uppercase">Address</h4>
                <p>
                {{ $address }}
                </p>
                <br>
                <h4 class="text-uppercase">Email</h4>
                <p>
                    <a href="#">{{$email}}</a></p>
                <br>
                <h4 class="text-uppercase">Phone</h4>
                <p>
                    <a href="#">{{$phone}}</a></p>
                <br>
                <h4 class="text-uppercase">Social</h4>
                <div class="clearfix pt10">
                    <a href="//{{$facebook}}" class="social-icon si-border si-facebook">
                        <i class="fa-brands fa-facebook"></i>
                        <i class="fa-brands fa-facebook"></i>
                    </a>
                    <a href="//{{$twitter}}" class="social-icon si-border si-twitter">
                        <i class="fa-brands fa-twitter"></i>
                        <i class="fa-brands fa-twitter"></i>
                    </a>
                    <a href="//{{$instagram}}" class="social-icon si-border si-pinterest">
                        <i class="fa-brands fa-instagram"></i>
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                    <a href="//{{$youtube}}" class="social-icon si-border si-g-plus">
                        <i class="fa-brands fa-youtube"></i>
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                    <a href="//{{$tiktok}}" class="social-icon si-border si-github">
                        <i class="fa-brands fa-tiktok"></i>
                        <i class="fa-brands fa-tiktok"></i>
                    </a>
                </div>
            </div>
            <div class="col-md-6 mb40">
                <h2>Nice to hear from you</h2>
                <div class="smart-wrap">
                    <div class="smart-forms smart-container">
                    @if ($message = Session::get('success'))
                        <div class="alert alert-success alert-block">
                            <button type="button" class="close" data-dismiss="alert">×</button>
                            <strong>{{ $message }}</strong>
                        </div>
                    @endif
                        <form method="POST" action="{{ route('contactus.store') }}" id="smart-form">
                            @csrf
                            <div class="form-body">
                                <div class="section">
                                    <label class="field prepend-icon">
                                        <input type="text" name="sendername" id="sendername" class="gui-input" placeholder="Enter name">
                                        <span class="field-icon"><i class="fa fa-user"></i></span>
                                    </label>
                                </div><!-- end section -->

                                <div class="section">
                                    <label class="field prepend-icon">
                                        <input type="email" name="emailaddress" id="emailaddress" class="gui-input" placeholder="Email address">
                                        <span class="field-icon"><i class="fa fa-envelope"></i></span>
                                    </label>
                                </div><!-- end section -->
                            
                                <div class="section">
                                    <label class="field prepend-icon">
                                        <input type="text" name="sendersubject" id="sendersubject" class="gui-input" placeholder="Enter subject">
                                        <span class="field-icon"><i class="fa fa-lightbulb-o"></i></span>
                                    </label>
                                </div><!-- end section -->

                                <div class="section">
                                    <label class="field prepend-icon">
                                        <textarea class="gui-textarea" id="sendermessage" name="sendermessage"  placeholder="Enter message"></textarea>
                                        <span class="field-icon"><i class="fa fa-comments"></i></span>
                                        <span class="input-hint"> <strong>Hint:</strong> Please enter between 80 - 300 characters.</span>
                                    </label>
                                </div><!-- end section -->
                            </div><!-- end .form-body section -->
                            <div class="form-footer">
                                <button type="submit" data-btntext-sending="Sending..." class="button btn btn-primary">Submit</button>
                                <button type="reset" class="button"> Reset </button>
                            </div><!-- end .form-footer section -->
                        </form>
                    </div><!-- end .smart-forms section -->
                </div><!-- end .smart-wrap section -->
            </div>
        </div>
    </div>
    <iframe class="map" src="{{$maps}}" width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
@endsection

@section('extra-script')
    <!--smart-form script-->
    <script src="{{ asset('assets/smart-form/contact/js/jquery.form.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/smart-form/contact/js/jquery.validate.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/smart-form/contact/js/additional-methods.min.js') }}" type="text/javascript"></script>
    <script type="text/javascript" src="{{ asset('assets/smart-form/contact/js/smart-form.js') }}"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAMwVpUj3-oHHW8N21819BhKttOga2Rj2s"></script>
    <script src="{{ asset('assets/js/jquery.gmap.min.js')}}"></script>
    <script>        
    $(document).ready(function () {
            map = new GMaps({
                scrollwheel: false,
                el: '#markermap',
                lat: -6.9208927,
                lng: 107.6171556,
            });
            map.addMarker({
                lat: -6.9208927,
                lng: 107.6171556,
                title: 'Marker with InfoWindow',
                infoWindow: {
                    content: ''
                }
            });
        });
    </script>
@endsection