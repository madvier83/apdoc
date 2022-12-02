import React from "react";

export default function FooterComponent() {
    return (
        <>
            {/* ============================================================= FOOTER ============================================================= */}
            <footer className="dark-bg">
                <div className="container inner">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 inner">
                            <h4>Who we are</h4>
                            <a href="index.html">
                                <img
                                    className="logo img-intext"
                                    src="./images/logo-white.svg"
                                    alt=""
                                />
                            </a>
                            <p>
                                Magnis modipsae voloratati andigen daepeditem
                                quiate re porem que aut labor. Laceaque
                                eictemperum quiae sitiorem rest non restibusaes
                                maio es dem tumquam.
                            </p>
                            <a href="about.html" className="txt-btn">
                                More about us
                            </a>
                        </div>
                        {/* /.col */}
                        <div className="col-lg-3 col-md-6 inner">
                            <h4>Latest works</h4>
                            <div className="row thumbs gap-xs">
                                <div className="col-6 thumb">
                                    <figure className="icon-overlay icn-link">
                                        <a href="portfolio-post.html">
                                            <img
                                                src="./images/art/work02.jpg"
                                                alt=""
                                            />
                                        </a>
                                    </figure>
                                </div>
                                {/* /.thumb */}
                                <div className="col-6 thumb">
                                    <figure className="icon-overlay icn-link">
                                        <a href="portfolio-post.html">
                                            <img
                                                src="./images/art/work03.jpg"
                                                alt=""
                                            />
                                        </a>
                                    </figure>
                                </div>
                                {/* /.thumb */}
                                <div className="col-6 thumb">
                                    <figure className="icon-overlay icn-link">
                                        <a href="portfolio-post.html">
                                            <img
                                                src="./images/art/work07.jpg"
                                                alt=""
                                            />
                                        </a>
                                    </figure>
                                </div>
                                {/* /.thumb */}
                                <div className="col-6 thumb">
                                    <figure className="icon-overlay icn-link">
                                        <a href="portfolio-post.html">
                                            <img
                                                src="./images/art/work01.jpg"
                                                alt=""
                                            />
                                        </a>
                                    </figure>
                                </div>
                                {/* /.thumb */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.col */}
                        <div className="col-lg-3 col-md-6 inner">
                            <h4>Get In Touch</h4>
                            <p>
                                Doloreiur quia commolu ptatemp dolupta oreprerum
                                tibusam eumenis et consent accullignis dentibea
                                autem inisita.
                            </p>
                            <ul className="contacts">
                                <li>
                                    <i className="icon-location contact" /> 84
                                    Street, City, State 24813
                                </li>
                                <li>
                                    <i className="icon-mobile contact" /> +00
                                    (123) 456 78 90
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="icon-mail-1 contact" />{" "}
                                        info@reen.com
                                    </a>
                                </li>
                            </ul>
                            {/* /.contacts */}
                        </div>
                        {/* /.col */}
                        <div className="col-lg-3 col-md-6 inner">
                            <h4>Free updates</h4>
                            <p>
                                Conecus iure posae volor remped modis aut lor
                                volor accabora incim resto explabo.
                            </p>
                            <form
                                id="newsletter"
                                className="form-inline newsletter"
                                role="form"
                            >
                                <label
                                    className="sr-only"
                                    htmlFor="exampleInputEmail"
                                >
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail"
                                    placeholder="Enter your email address"
                                />
                                <button
                                    type="submit"
                                    className="btn btn-submit"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                </div>
                {/* .container */}
                <div className="footer-bottom">
                    <div className="container inner clearfix">
                        <p className="float-left">
                            © 2019 REEN. All rights reserved.
                        </p>
                        <ul className="footer-menu float-right">
                            <li>
                                <a href="index.html">Home</a>
                            </li>
                            <li>
                                <a href="portfolio.html">Portfolio</a>
                            </li>
                            <li>
                                <a href="blog.html">Blog</a>
                            </li>
                            <li>
                                <a href="about.html">About</a>
                            </li>
                            <li>
                                <a href="services.html">Services</a>
                            </li>
                            <li>
                                <a href="contact.html">Contact</a>
                            </li>
                        </ul>
                        {/* .footer-menu */}
                    </div>
                    {/* .container */}
                </div>
                {/* .footer-bottom */}
            </footer>
            {/* ============================================================= FOOTER : END ============================================================= */}
        </>
    );
}
