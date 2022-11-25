<footer class="footer footer-dark pt50 pb30">
    <div class="container">
        <div class="row justify-content-between">
            <div class="col-lg-3 col-md-6 mb40">
                <h3>About Us</h3>
                <p>
                {!! Str::limit($aboutus, 300, '...') !!}
                </p>
                <a href="{{ route('aboutus') }}" class="btn btn-sm btn-white-outline">Learn More</a>
            </div>
            <div class="col-lg-3 col-md-6 mb40">
                <h3>Recent Blog</h3>
                <ul class="list-unstyled footer-list-item">
                    @foreach($blog as $item)
                    <li>
                        <a href="{{ route('blogdetail',['slug'=> $item->slug ]) }}">
                            {{$item->name}}
                        </a><br>
                        <em>{{date('d-m-Y', strtotime($item->created_at))}}</em>
                    </li>
                    @endforeach
                </ul>
            </div>
            <div class="col-lg-3 col-md-6 mb40">
                <h3>New Arrival</h3>
                <div class="clearfix pr-4 pb-4" >
                    @foreach($newar as $news)
                    <a href="//{{$news->link_to_olsera}}" target="_blank" class="thumb-hover-icon">
                        <img src="/assets/images/product/{{$news->image}}" alt="{{ $news->slug }}" style="height:80px;" class="img-fluid" width="80">
                        <span class="ti-plus"></span>
                    </a><!--/.hover-->
                    @endforeach
                </div><!--/.clearfix-->
            </div>
            <div class="col-lg-3 col-md-6 mb40">
                <h3>Contact Us</h3>
                <ul class="list-unstyled contact-list-item">
                    <li>
                        <i class="ti-home"></i>
                        {{ $address }}
                    </li>
                    <li>
                        <i class="ti-email"></i>
                        {{ $email }}
                    </li>
                    <li>
                        <a href="https://wa.me/{{$replaced = str_replace(' ', '', $phone);}}" style="text-decoration:none;color: currentColor;" target="_blank">
                        <i class="ti-mobile"></i>
                            {{ $phone }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="text-center">
        <ul class="social-icons list-inline">
                <li class="list-inline-item">
                    <a href="//{{ $facebook }}" target="_blank">
                        <i class="fa-brands fa-facebook"></i>Facebook
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="//{{ $tiktok }}" target="_blank">
                        <i class="fa-brands fa-tiktok"></i>Tiktok
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="//{{ $instagram }}" target="_blank">
                        <i class="fa-brands fa-instagram"></i>instagram
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="//{{ $youtube }}" target="_blank">
                        <i class="fa-brands fa-youtube"></i>Youtube
                    </a>
                </li>
            </ul>
        </div>
        <hr class="mb40">
        <div class="row">
            <div class="col-lg-6 ml-auto mr-auto text-center">
                <p>&copy; Developed by CURSORID
            </div>
        </div>
    </div>
</footer><!--/footer-->
