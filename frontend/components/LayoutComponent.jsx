import Head from "next/head";
import Script from "next/script";
import React from "react";
import FooterComponent from "./FooterComponent";
import HeaderComponent from "./HeaderComponent";

export default function LayoutComponent({ title, children }) {
    return (
        <>
            <Head>
                <title>{title}</title>
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
