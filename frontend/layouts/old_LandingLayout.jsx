import Head from "next/head";
import Script from "next/script";
import React from "react";
import FooterComponent from "../components/Landing/FooterComponent";
import HeaderComponent from "../components/Landing/HeaderComponent";

// import '../public/css/bootstrap.min.css'
// import '../public/css/main.css'
// import '../public/css/green.css'
// import '../public/css/owl.carousel.css'
// import '../public/css/owl.transitions.css'
// import '../public/css/animate.min.css'
// import '../public/css/aos.css'
// import '../public/css/custom.css'
// import '../public/fonts/fontello.css'
// import '../styles/tailwind.css'

export default function LandingLayout({ title, children }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                {/* Meta */}
                {/* <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, user-scalable=no"
                />
                <meta name="description" content="" />
                <meta name="author" content="" /> */}

                {/* Core CSS */}
                <link href="./css/bootstrap.min.css" rel="stylesheet" />
                <link href="./css/main.css" rel="stylesheet" />
                {/* AddOn/Plugin CSS */}
                <link href="./css/green.css" rel="stylesheet" title="Color" />
                <link href="./css/owl.carousel.css" rel="stylesheet" />
                <link href="./css/owl.transitions.css" rel="stylesheet" />
                <link href="./css/animate.min.css" rel="stylesheet" />
                <link href="./css/aos.css" rel="stylesheet" />
                {/* Custom CSS */}
                <link href="./css/custom.css" rel="stylesheet" />
                {/* Fonts */}
                <link
                    href="http://fonts.googleapis.com/css?family=Lato:400,900,300,700"
                    rel="stylesheet"
                />
                <link
                    href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic,700italic"
                    rel="stylesheet"
                />
                {/* Icons/Glyphs */}
                <link href="./fonts/fontello.css" rel="stylesheet" />
                {/* Favicon */}
                <link rel="shortcut icon" href="./images/favicon.ico" />
            </Head>

            <HeaderComponent />
            {children}
            <FooterComponent />

            {/* JavaScripts placed at the end of the document so the pages load faster */}
            <Script strategy="beforeInteractive" src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/jquery.min.js"></Script>

            <Script strategy="beforeInteractive" src="/js/jquery.easing.1.3.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/jquery.form.js"></Script>
            <Script strategy="beforeInteractive" src="/js/jquery.validate.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/popper.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/bootstrap.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/affix.js"></Script>
            <Script strategy="beforeInteractive" src="/js/aos.js"></Script>
            <Script strategy="beforeInteractive" src="/js/owl.carousel.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/jquery.isotope.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/imagesloaded.pkgd.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/jquery.easytabs.min.js"></Script>
            <Script strategy="beforeInteractive" src="/js/viewport-units-buggyfill.js"></Script>
            <Script strategy="beforeInteractive" src="/js/selected-scroll.js"></Script>
            <Script strategy="afterInteractive" src="/js/scripts.js"></Script>
            <Script strategy="afterInteractive" src="/js/custom.js"></Script>
        </>
    );
}
