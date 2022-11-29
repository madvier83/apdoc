import React from "react";
import Link from "next/link";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import ForgotPassword from "./ForgotPassword";

export default function HeaderComponent() {
    return (
        <>
            {/* ============================================================= HEADER ============================================================= */}
            <header>
                <div className="navbar">
                    <div className="navbar-header">
                        <div className="container">
                            <ul className="info">
                                <li>
                                    <a href="#">
                                        <i className="icon-mail-1 contact" />{" "}
                                        info@reen.com
                                    </a>
                                </li>
                                <li>
                                    <i className="icon-mobile contact" /> +00
                                    (123) 456 78 90
                                </li>
                            </ul>
                            {/* /.info */}
                            <ul className="social">
                                <li>
                                    <a href="#">
                                        <i className="icon-s-facebook" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="icon-s-gplus" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="icon-s-twitter" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="icon-s-pinterest" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="icon-s-behance" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="icon-s-dribbble" />
                                    </a>
                                </li>
                            </ul>
                            {/* /.social */}
                            {/* ============================================================= LOGO MOBILE ============================================================= */}
                            <a className="navbar-brand" href="index.html">
                                <img
                                    src="./images/logo.svg"
                                    className="logo"
                                    alt=""
                                />
                            </a>
                            {/* ============================================================= LOGO MOBILE : END ============================================================= */}
                            <a
                                className="navbar-toggler btn responsive-menu float-right"
                                data-toggle="collapse"
                                data-target=".navbar-collapse"
                            >
                                <i className="icon-menu-1" />
                            </a>
                        </div>
                    </div>
                    {/* /.navbar-header */}
                    <div className="yamm">
                        <div className="navbar-collapse collapse">
                            <div className="container">
                                {/* ============================================================= LOGO ============================================================= */}
                                <a className="navbar-brand" href="index.html">
                                    {/* <img
                                        src="./images/logo.svg"
                                        className="logo"
                                        alt=""
                                    /> */}
                                    <h1 className="green p-0 my-3 font-weight-bold logo">
                                        APDOC
                                    </h1>
                                </a>
                                {/* ============================================================= LOGO : END ============================================================= */}
                                {/* ============================================================= MAIN NAVIGATION ============================================================= */}
                                <ul className="nav navbar-nav mt-1 mr-auto">
                                    <li className="dropdown">
                                        <a
                                            href="#"
                                            className="dropdown-toggle"
                                            data-toggle="dropdown"
                                        >
                                            Layanan
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <a href="index.html">
                                                    Point Of Sales
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index2.html">
                                                    Payment
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index3.html">
                                                    Manajemen Stok
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index4.html">
                                                    Manajemen Pelanggan
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index5.html">
                                                    Manajemen Karyawan
                                                </a>
                                            </li>
                                        </ul>
                                    </li>

                                    <li>
                                        <a href="">Hardware</a>
                                    </li>
                                    <li>
                                        <a href="">Harga</a>
                                    </li>
                                    <li>
                                        <a href="">Hubungi Kami</a>
                                    </li>

                                    <li className="d-flex ml-auto mb-2 mr-2">
                                        <a
                                            href="#modal-login"
                                            className=""
                                            data-toggle="modal"
                                        >
                                            Login
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#modal-register"
                                            data-toggle="modal"
                                            className="btn btn-green mt-2 px-3 py-2"
                                        >
                                            Register
                                        </a>
                                    </li>
                                </ul>
                                {/* ============================================================= MAIN NAVIGATION : END ============================================================= */}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* ============================================================= HEADER : END ============================================================= */}

            {/* modals */}
            <LoginModal />
            <RegisterModal />
            <ForgotPassword />
        </>
    );
}
