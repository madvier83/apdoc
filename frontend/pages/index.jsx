import Head from "next/head";
import Script from "next/script";
import React from "react";
import HeaderComponent from "../components/HeaderComponent";
import LayoutComponent from "../components/LayoutComponent";

export default function Home() {
    return (
        <>
            <LayoutComponent title="APDOC | Landing">
                {/* ============================================================= MAIN ============================================================= */}
                <main>
                    {/* ============================================================= SECTION – HERO ============================================================= */}
                    <section id="hero">
                        <div
                            id="owl-main"
                            className="owl-carousel owl-one-item"
                        >
                            <div
                                className="item img-bg-center"
                                style={{
                                    backgroundImage:
                                        "url(./images/art/slider02.jpg)",
                                }}
                            >
                                <div className="container">
                                    <div className="caption vertical-center text-center">
                                        <h1 className="fadeInDown-1 light-color">
                                            Made for Designers
                                        </h1>
                                        <p className="fadeInDown-2 light-color">
                                            Create your online portfolio in
                                            minutes with the professionally and
                                            lovingly designed REEN website
                                            template. Customize your site with
                                            versatile and easy to use features.
                                        </p>
                                        <div className="fadeInDown-3">
                                            <a
                                                href="#"
                                                className="btn btn-large"
                                            >
                                                Get started now
                                            </a>
                                        </div>
                                        {/* /.fadeIn */}
                                    </div>
                                    {/* /.caption */}
                                </div>
                                {/* /.container */}
                            </div>
                            {/* /.item */}
                        </div>
                        {/* /.owl-carousel */}
                    </section>
                    {/* ============================================================= SECTION – HERO : END ============================================================= */}
                    {/* ============================================================= SECTION – FEATURES ============================================================= */}
                    <section id="features">
                        <div className="container inner-top">
                            <div className="row">
                                <div className="col-lg-8 col-md-9 mx-auto text-center">
                                    <header>
                                        <h1>Beautiful. Clean. Responsive.</h1>
                                        <p>
                                            REEN is a high-quality solution for
                                            those who want a beautiful website
                                            in no time. It's fully responsive
                                            and will adapt itself to any mobile
                                            device. iPad, iPhone, Android, it
                                            doesn't matter. Your content will
                                            always looks its absolute best.
                                        </p>
                                    </header>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                            <div className="row inner-top-sm">
                                <div className="col-lg-3 inner-bottom-sm">
                                    <h2>All in one</h2>
                                    <p className="text-small">
                                        Magnis modipsae que lib voloratati
                                        andigen daepeditem quiate re porem aut
                                        labor. Laceaque quiae sitiorem rest non
                                        restibusaes maio es dem tumquam core
                                        posae volor remped modis volor.
                                    </p>
                                    <a href="#" className="txt-btn">
                                        View all possibilities
                                    </a>
                                </div>
                                {/* /.col */}
                                <div className="col-lg-3 inner-bottom-sm">
                                    <h2>Mobile first</h2>
                                    <p className="text-small">
                                        Magnis modipsae que lib voloratati
                                        andigen daepeditem quiate re porem aut
                                        labor. Laceaque quiae sitiorem rest non
                                        restibusaes maio es dem tumquam core
                                        posae volor remped modis volor.
                                    </p>
                                    <a href="#" className="txt-btn">
                                        See for yourself
                                    </a>
                                </div>
                                {/* /.col */}
                                <div className="col-lg-6 inner-left-xs">
                                    <figure>
                                        <img
                                            src="./images/art/service01.jpg"
                                            alt=""
                                        />
                                    </figure>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container */}
                    </section>
                    {/* ============================================================= SECTION – FEATURES : END ============================================================= */}
                    {/* ============================================================= SECTION – SPECIALS ============================================================= */}
                    <section id="specials" className="light-bg">
                        <div className="container inner-top">
                            <div className="row">
                                <div className="col-lg-8 col-md-9 mx-auto text-center">
                                    <header>
                                        <h1>Special features</h1>
                                        <p>
                                            Magnis modipsae que voloratati
                                            andigen daepeditem quiate re porem
                                            aut labor. Laceaque quiae sitiorem
                                            rest non restibusaes maio es dem
                                            tumquam.
                                        </p>
                                    </header>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                            <div className="row inner-top-sm">
                                <div className="col-12">
                                    <div className="tabs tabs-2-big-top tab-container">
                                        <ul className="etabs text-center">
                                            <li className="tab">
                                                <a href="#tab-1">
                                                    <h3>Photo Gallery</h3>
                                                    <p className="text-small">
                                                        Magnis modipsae que lib
                                                        voloratati porem aut
                                                        labor. Laceaque quiae
                                                        sitiorem rest non
                                                        restibusaes es dem
                                                        tumquam core posae volor
                                                        remped modis volor.
                                                    </p>
                                                </a>
                                                {/* /#tab-1 */}
                                            </li>
                                            {/* /.tabs */}
                                            <li className="tab">
                                                <a href="#tab-2">
                                                    <h3>Easy Mockups</h3>
                                                    <p className="text-small">
                                                        Magnis modipsae que lib
                                                        voloratati porem aut
                                                        labor. Laceaque quiae
                                                        sitiorem rest non
                                                        restibusaes es dem
                                                        tumquam core posae volor
                                                        remped modis volor.
                                                    </p>
                                                </a>
                                                {/* /#tab-2 */}
                                            </li>
                                            {/* /.tabs */}
                                        </ul>
                                        {/* /.etabs */}
                                        <div className="panel-container screen-container">
                                            <div
                                                className="tab-content"
                                                id="tab-1"
                                            >
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <figure>
                                                            <img
                                                                src="./images/art/photograph01-lg.jpg"
                                                                alt=""
                                                            />
                                                        </figure>
                                                    </div>
                                                    {/* /.col */}
                                                </div>
                                                {/* /.row */}
                                            </div>
                                            {/* /.tab-content */}
                                            <div
                                                className="tab-content"
                                                id="tab-2"
                                            >
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <figure>
                                                            <img
                                                                src="./images/art/work14-lg.jpg"
                                                                alt=""
                                                            />
                                                        </figure>
                                                    </div>
                                                    {/* /.col */}
                                                </div>
                                                {/* /.row */}
                                            </div>
                                            {/* /.tab-content */}
                                        </div>
                                        {/* /.panel-container */}
                                    </div>
                                    {/* /.tabs */}
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container */}
                    </section>
                    {/* ============================================================= SECTION – SPECIALS : END ============================================================= */}
                    {/* ============================================================= SECTION – SERVICES ============================================================= */}
                    <section id="services">
                        <div className="container inner-top inner-bottom-sm">
                            <div className="row">
                                <div className="col-lg-8 col-md-9 mx-auto text-center">
                                    <header>
                                        <h1>Full customer service</h1>
                                        <p>
                                            Magnis modipsae que voloratati
                                            andigen daepeditem quiate re porem
                                            aut labor. Laceaque quiae sitiorem
                                            rest non restibusaes maio es dem
                                            tumquam.
                                        </p>
                                    </header>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                            <div className="row inner-top-sm text-center">
                                <div className="col-md-4 inner-bottom-xs">
                                    <div className="icon">
                                        <i className="icon-lamp icn lg" />
                                    </div>
                                    {/* /.icon */}
                                    <h2>Strategy</h2>
                                    <p className="text-small">
                                        Magnis modipsae que lib voloratati porem
                                        aut labor. Laceaque quiae sitiorem rest
                                        non restibusaes es dem tumquam core
                                        posae volor remped modis volor.
                                    </p>
                                </div>
                                {/* /.col */}
                                <div className="col-md-4 inner-bottom-xs">
                                    <div className="icon">
                                        <i className="icon-flow-tree icn lg" />
                                    </div>
                                    {/* /.icon */}
                                    <h2>User Experience</h2>
                                    <p className="text-small">
                                        Magnis modipsae que lib voloratati porem
                                        aut labor. Laceaque quiae sitiorem rest
                                        non restibusaes es dem tumquam core
                                        posae volor remped modis volor.
                                    </p>
                                </div>
                                {/* /.col */}
                                <div className="col-md-4 inner-bottom-xs">
                                    <div className="icon">
                                        <i className="icon-beaker icn lg" />
                                    </div>
                                    {/* /.icon */}
                                    <h2>Design</h2>
                                    <p className="text-small">
                                        Magnis modipsae que lib voloratati porem
                                        aut labor. Laceaque quiae sitiorem rest
                                        non restibusaes es dem tumquam core
                                        posae volor remped modis volor.
                                    </p>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                            <div className="row text-center">
                                <div className="col-md-4 inner-bottom-xs">
                                    <div className="icon">
                                        <i className="icon-code icn lg" />
                                    </div>
                                    {/* /.icon */}
                                    <h2>Technology</h2>
                                    <p className="text-small">
                                        Magnis modipsae que lib voloratati porem
                                        aut labor. Laceaque quiae sitiorem rest
                                        non restibusaes es dem tumquam core
                                        posae volor remped modis volor.
                                    </p>
                                </div>
                                {/* /.col */}
                                <div className="col-md-4 inner-bottom-xs">
                                    <div className="icon">
                                        <i className="icon-thumbs-up-1 icn lg" />
                                    </div>
                                    {/* /.icon */}
                                    <h2>Social</h2>
                                    <p className="text-small">
                                        Magnis modipsae que lib voloratati porem
                                        aut labor. Laceaque quiae sitiorem rest
                                        non restibusaes es dem tumquam core
                                        posae volor remped modis volor.
                                    </p>
                                </div>
                                {/* /.col */}
                                <div className="col-md-4 inner-bottom-xs">
                                    <div className="icon">
                                        <i className="icon-megaphone-1 icn lg" />
                                    </div>
                                    {/* /.icon */}
                                    <h2>Marketing</h2>
                                    <p className="text-small">
                                        Magnis modipsae que lib voloratati porem
                                        aut labor. Laceaque quiae sitiorem rest
                                        non restibusaes es dem tumquam core
                                        posae volor remped modis volor.
                                    </p>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container */}
                    </section>
                    {/* ============================================================= SECTION – SERVICES : END ============================================================= */}
                    {/* ============================================================= SECTION – PRICING TABLES ============================================================= */}
                    <section id="pricing-tables">
                        <div className="container inner">
                            <div className="row">
                                <div className="col-lg-8 col-md-9 mx-auto text-center">
                                    <header>
                                        <h1>
                                            Simple pricing, no surprises
                                        </h1>
                                        <p>
                                            Magnis modipsae que voloratati
                                            andigen daepeditem quiate re
                                            porem aut labor. Laceaque quiae
                                            sitiorem rest non restibusaes
                                            maio es dem tumquam.
                                        </p>
                                    </header>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                            <div className="row pricing">
                                <div className="col-lg-4 col-md-6 inner-top-sm">
                                    <div className="plan">
                                        <header>
                                            <h2>Personal</h2>
                                            <div className="price">
                                                <span className="currency">
                                                    $
                                                </span>
                                                <span className="amount">
                                                    9
                                                </span>
                                                <span className="period">
                                                    / Mo
                                                </span>
                                            </div>
                                            {/* /.price */}
                                            <a href="#" className="btn">
                                                Change to this plan
                                            </a>
                                        </header>
                                        <ul className="features">
                                            <li>
                                                <i className="icon-window" />{" "}
                                                20 Pages
                                            </li>
                                            <li>
                                                <i className="icon-hdd" />{" "}
                                                10 GB Storage
                                            </li>
                                            <li>
                                                <i className="icon-switch" />{" "}
                                                500 GB Bandwidth
                                            </li>
                                            <li>
                                                <i className="icon-globe" />{" "}
                                                Custom Domain
                                            </li>
                                            <li>
                                                <i className="icon-users" />{" "}
                                                24/7 Support
                                            </li>
                                        </ul>
                                        {/* /.features */}
                                    </div>
                                    {/* /.plan */}
                                </div>
                                {/* /.col */}
                                <div className="col-lg-4 col-md-6 inner-top-sm">
                                    <div className="plan">
                                        <header>
                                            <h2>Professional</h2>
                                            <div className="price">
                                                <span className="currency">
                                                    $
                                                </span>
                                                <span className="amount">
                                                    14
                                                </span>
                                                <span className="period">
                                                    / Mo
                                                </span>
                                            </div>
                                            {/* /.price */}
                                            <a href="#" className="btn">
                                                Change to this plan
                                            </a>
                                        </header>
                                        <ul className="features">
                                            <li>
                                                <i className="icon-window" />{" "}
                                                100 Pages
                                            </li>
                                            <li>
                                                <i className="icon-hdd" />{" "}
                                                100 GB Storage
                                            </li>
                                            <li>
                                                <i className="icon-switch" />{" "}
                                                2 TB Bandwidth
                                            </li>
                                            <li>
                                                <i className="icon-globe" />{" "}
                                                Custom Domain
                                            </li>
                                            <li>
                                                <i className="icon-users" />{" "}
                                                24/7 Support
                                            </li>
                                        </ul>
                                        {/* /.features */}
                                    </div>
                                    {/* /.plan */}
                                </div>
                                {/* /.col */}
                                <div className="col-lg-4 col-md-6 inner-top-sm">
                                    <div className="plan">
                                        <header>
                                            <h2>Business</h2>
                                            <div className="price">
                                                <span className="currency">
                                                    $
                                                </span>
                                                <span className="amount">
                                                    23
                                                </span>
                                                <span className="period">
                                                    / Mo
                                                </span>
                                            </div>
                                            {/* /.price */}
                                            <a href="#" className="btn">
                                                Change to this plan
                                            </a>
                                        </header>
                                        <ul className="features">
                                            <li>
                                                <i className="icon-window" />{" "}
                                                Unlimited Pages
                                            </li>
                                            <li>
                                                <i className="icon-hdd" />{" "}
                                                Unlimited Storage
                                            </li>
                                            <li>
                                                <i className="icon-switch" />{" "}
                                                Unlimited Bandwidth
                                            </li>
                                            <li>
                                                <i className="icon-globe" />{" "}
                                                Custom Domain
                                            </li>
                                            <li>
                                                <i className="icon-users" />{" "}
                                                24/7 Support
                                            </li>
                                        </ul>
                                        {/* /.features */}
                                    </div>
                                    {/* /.plan */}
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container */}
                    </section>
                    {/* ============================================================= SECTION – TESTIMONIALS ============================================================= */}
                    <section
                        id="testimonials"
                        className="light-bg img-bg-softer"
                        style={{
                            backgroundImage:
                                "url(./images/art/pattern-background01.jpg)",
                        }}
                    >
                        <div className="container inner">
                            <div className="row">
                                <div className="col-lg-8 col-md-9 mx-auto text-center">
                                    <header>
                                        <h1>
                                            Trusted by over 70,000 customers
                                            worldwide
                                        </h1>
                                    </header>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                            <div className="row">
                                <div className="col-lg-8 col-md-9 mx-auto text-center">
                                    <div
                                        id="owl-testimonials"
                                        className="owl-carousel owl-outer-nav owl-ui-md"
                                    >
                                        <div className="item">
                                            <blockquote>
                                                <p>
                                                    Need a professional kickass
                                                    looking portfolio template,
                                                    REEN is the way to go! It is
                                                    simple, beautiful and really
                                                    easy to use. Great product!
                                                </p>
                                                <footer>
                                                    <cite>Steve Gates</cite>
                                                </footer>
                                            </blockquote>
                                        </div>
                                        {/* /.item */}
                                        <div className="item">
                                            <blockquote>
                                                <p>
                                                    REEN is a sleek, beautiful,
                                                    ridiculously easy to use
                                                    multipurpose template. More
                                                    importantly, it’s a huge
                                                    time saver for busy
                                                    creatives!
                                                </p>
                                                <footer>
                                                    <cite>Amber Jones</cite>
                                                </footer>
                                            </blockquote>
                                        </div>
                                        {/* /.item */}
                                        <div className="item">
                                            <blockquote>
                                                <p>
                                                    Been putting off creating my
                                                    portfolio for several years,
                                                    then I found REEN and about
                                                    30 minutes later ... I have
                                                    an awesome looking
                                                    portfolio. Totally love it!
                                                </p>
                                                <footer>
                                                    <cite>Bill Jobs</cite>
                                                </footer>
                                            </blockquote>
                                        </div>
                                        {/* /.item */}
                                    </div>
                                    {/* /.owl-carousel */}
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container */}
                    </section>
                    {/* ============================================================= SECTION – TESTIMONIALS : END ============================================================= */}
                    {/* ============================================================= SECTION – GET STARTED ============================================================= */}
                    <section id="get-started" className="tint-bg">
                        <div className="container inner-sm">
                            <div className="row">
                                <div className="col-md-11 mx-auto text-center">
                                    <h1 className="single-block">
                                        Stop writing code. Start being creative!{" "}
                                        <a href="#" className="btn btn-large">
                                            Get started
                                        </a>
                                    </h1>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container */}
                    </section>
                    {/* ============================================================= SECTION – GET STARTED : END ============================================================= */}
                </main>
                {/* ============================================================= MAIN : END ============================================================= */}
            </LayoutComponent>
        </>
    );
}
