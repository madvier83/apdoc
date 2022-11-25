<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>@yield('title')</title>
    <link rel="icon" href="{{ asset('assets/images/favicon.png') }}" sizes="16x16" type="image/png">
    <!-- Plugins CSS -->
    <link href="{{ asset('assets/css/plugins/plugins.css') }}" rel="stylesheet">
    <!-- load css for cubeportfolio -->
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/cubeportfolio/css/cubeportfolio.min.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/brands.min.css" integrity="sha512-nvJNGNsQy69Ogs4KBn+nu1x42OzCTxjOIKL3S2H9BYqUQImQ5hfDMcbh71l/6O0oRjTVUAlTLFZJA8gvWrJnmQ==" crossorigin="anonymous" referrerpolicy="no-referrer" /><link href="{{ asset('assets/css/style.css') }}" rel="stylesheet">
    @yield('extra-link')
</head>

<body onload="checkCookie()">
<div id="preloader">
    <div id="preloader-inner"></div>
</div><!--/preloader-->
@include('frontend.template.header')

@yield('content')
{{--<div class="elfsight-app-ead264a2-f69a-4b80-b863-513d8319dc45"></div>--}}
<!--page on load modal start-->
<div id="popup"></div>
@include('frontend.template.footer')
<!--back to top-->
<a href="#" class="back-to-top hidden-xs-down" id="back-to-top"><i class="ti-angle-up"></i></a>
<!-- jQuery first, then Tether, then Bootstrap JS. -->
<script src="{{ asset('assets/js/plugins/plugins.js') }}"></script>
<script src="{{ asset('assets/js/assan.custom.js') }}"></script>

<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6268c5ca7b967b11798cb3b8/1g1kk984r';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->

<!-- load cubeportfolio -->
<script type="text/javascript" src="{{ asset('assets/cubeportfolio/js/jquery.cubeportfolio.min.js') }}"></script>
<script src="https://apps.elfsight.com/p/platform.js" defer></script>
<script>
    // function setCookie(cvalue, days) {
    // const d = new Date();
    // d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    // let cd = days * 24 * 60 * 60 * 1000;
    // let expires = d.toUTCString();
    // console.log(cd.toUTCString());
    // alert(days+' '+cd);
    // document.cookie = cvalue + ";" + expires + ";path=/";
    // const dataobj = {'value': cvalue,'exdays': days};
    // localStorage.setItem('AgeVerify',JSON.stringify(dataobj));
    // }

    // function getCookie(cvalue) {
    // let value = cvalue;
    // return alert('cookie ada');
    // }

    // function checkCookie() {
    // let value = getCookie({'value':true});
    // if (value != "") {
    //     alert("Welcome again ");
    // } else {
    //     const d = new Date();
    //     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    //     let expires = "expires="+d.toUTCString();
    //     user = prompt("Please enter your name:", "");
    //     if (value != "" && value != null) {
    //     setCookie({'value':value,'exdays':expires});
    //     }
    // }
    // }  
    
    function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*1*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    let expired = d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    const dataobj = {'value': cvalue,'exdays': expired};
    localStorage.setItem('AgeVerify',JSON.stringify(dataobj));
    }

    function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
    }

    function checkCookie() {
    let user = getCookie("AgeVerify");
    if (user != "") {
        return "";
    } else {
        user = true;
        if (user != "" && user != null) {
        document.getElementById('popup').innerHTML = `<div id="onloadModal" class="mfp-hide popup-content-area white-popup text-center">
        <div class="alert alert-danger" role="alert" style="display:none;">
            Maaf Anda Belum Cukup Umur
        </div>
        <h4>
            Apakah Anda Berusia Diatas 18 Tahun
        </h4>
        <p>
            Dengan menyetujui ini, Anda menyatakan bahwa telah berusia di atas 18 tahun dan akan memyetujui serta mematuhi sesuai dengan aturan yang berlaku.
        </p>
        <button type="close" id="popupclose" data-dismiss="#onloadModal" aria-hidden="true" class="btn btn-success btn-rounded btn-lg">Yes</button>
        <button type="button" id="btno" class="btn btn-danger btn-rounded btn-lg">No</button>
        </div>`;
        setCookie("AgeVerify", user, 30);
        }
    }
    }

    //testimonials
    (function ($, window, document, undefined) {
        'use strict'; 
        // init cubeportfolio
        $('#js-grid-slider-testimonials').cubeportfolio({
            layoutMode: 'slider',
            drag: true,
            auto: false,
            autoTimeout: 5000,
            autoPauseOnHover: true,
            showNavigation: true,
            showPagination: true,
            rewindNav: true,
            scrollByPage: false,
            gridAdjustment: 'responsive',
            mediaQueries: [{
                width: 0,
                cols: 1
            }],
            gapHorizontal: 0,
            gapVertical: 0,
            caption: '',
            displayType: 'default'
        });
    })(jQuery, window, document);

    //projects
    {{--(function ($, window, document, undefined) {--}}
    {{--    'use strict';--}}

    {{--    // init cubeportfolio--}}
    {{--    $('#js-grid-lightbox-gallery').cubeportfolio({--}}
    {{--        filters: '#js-filters-lightbox-gallery1, #js-filters-lightbox-gallery2',--}}
    {{--        layoutMode: 'grid',--}}
    {{--        mediaQueries: [{--}}
    {{--            width: 1500,--}}
    {{--            cols: 4--}}
    {{--        }, {--}}
    {{--            width: 1100,--}}
    {{--            cols: 3--}}
    {{--        }, {--}}
    {{--            width: 800,--}}
    {{--            cols: 3--}}
    {{--        }, {--}}
    {{--            width: 480,--}}
    {{--            cols: 2,--}}
    {{--            options: {--}}
    {{--                caption: ''--}}
    {{--            }--}}
    {{--        }],--}}
    {{--        defaultFilter: '*',--}}
    {{--        animationType: 'flipOutDelay',--}}
    {{--        gapHorizontal: 0,--}}
    {{--        gapVertical: 0,--}}
    {{--        gridAdjustment: 'responsive',--}}
    {{--        caption: 'overlayBottomAlong',--}}
    {{--        displayType: 'sequentially',--}}
    {{--        displayTypeSpeed: 100,--}}
    {{--        // lightbox--}}
    {{--        lightboxDelegate: '.cbp-lightbox',--}}
    {{--        lightboxGallery: true,--}}
    {{--        lightboxTitleSrc: 'data-title',--}}
    {{--        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>'--}}
    {{--    });--}}
    {{--})(jQuery, window, document);--}}
</script>
@yield('extra-script')
</body>
</html>
