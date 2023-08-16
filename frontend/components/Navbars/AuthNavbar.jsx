import React from "react";
import { useState } from "react";

// components

import Link from "next/link";
// import LoginModal from "../landing/LoginModal";
import PagesDropdown from "../Dropdowns/PagesDropdown";
import RegisterModal from "../Landing/RegisterModal";

export default function Navbar(props) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  return (
    <>
      {/* modals */}
      {/* <LoginModal showModal={loginModal} setShowModal={setLoginModal} />
      <RegisterModal showModal={registerModal} setShowModal={setRegisterModal} /> */}

      <nav className="top-0 absolute z-20 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              className="fredoka tracking-wider text-emerald-400 px-3 py-4 lg:py-2 flex items-center text-4xl uppercase font-bold"
              href="/"
            >
              {/* <i className="far fa-file-alt text-lg leading-lg mr-2" />{" "} */}
              APDOC
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="text-white fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block rounded shadow-lg" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none mr-auto">
              <li className="flex items-center">
                <Link
                  className="lg:hidden fredoka tracking-wider text-emerald-400 px-3 py-4 lg:py-2 flex items-center text-4xl uppercase font-bold"
                  href="/"
                >
                  {/* <i className="far fa-file-alt text-lg leading-lg mr-2" />{" "} */}
                  APDOC
                </Link>
              </li>
            </ul>

            <ul className="flex flex-col lg:flex-row list-none lg:mx-auto text-slate-900 font-semibold lg:text-white mx-4 gap-4 lg:gap-8">
              {/* <li className="flex items-center">
                <PagesDropdown />
              </li> */}
              <li className="flex items-center">
                <Link href="#">Beranda</Link>
              </li>
              <li className="flex items-center">
                <Link href="#">Layanan</Link>
              </li>
              <li className="flex items-center">
                <Link href="#">Hardware</Link>
              </li>
              <li className="flex items-center">
                <Link href="#">Lainnya</Link>
              </li>
            </ul>

            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto mt-4 mb-4 lg:mt-0 gap-4 lg:gap-0">
              <li className="flex items-center">
                <Link
                  className="bg-gray-200 lg:text-black text-blueGray-700 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none lg:mb-0 ml-3 ease-linear transition-all duration-150"
                  type="button"
                  // onClick={()=>setLoginModal(p=>!p)}
                  href="/auth/login"
                >
                  {/* <i className="fas fa-arrow-alt-circle-down"></i>  */}
                  Masuk
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  className="bg-emerald-400 text-blueGray-700 active:bg-blueGray-50 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 ease-linear transition-all duration-150"
                  type="button"
                  // onClick={()=>setRegisterModal(p=>!p)}
                  href="/auth/register"
                >
                  {/* <i className="fas fa-arrow-alt-circle-down"></i>  */}
                  Daftar
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
