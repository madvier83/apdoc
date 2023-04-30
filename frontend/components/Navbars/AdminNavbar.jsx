import Link from "next/link";
import React from "react";
import UserDropdown from "../Dropdowns/UserDropdown";
import { useRouter } from "next/router";
// import veri

export default function Navbar({ title }) {
  const router = useRouter();
  return (
    <>
      {/* Navbar */}
      <nav className="top-0 left-0 w-full z-10  md:flex-row md:flex-nowrap md:justify-start flex items-center pt-6 pb-4 px-8">
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap">
          {/* Brand */}
          <Link
            className="text-white text-lg uppercase hidden lg:inline-block font-semibold ml-3"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            {title}
          </Link>
          {/* Form */}
          {/* md:flex */}
          {/* <form className="flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300  rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search here..."
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
          </form> */}
          {/* User */}
          <div className="flex">
            <button
              className="text-slate-500 text-lg hidden lg:inline-block font-normal mx-5"
              onClick={() => router.back()}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            {/* <button
              className="text-white text-sm hidden lg:inline-block font-normal mr-5"
              onClick={() => router.reload()}
            >
              <i className="fas fa-arrow-right"></i>
            </button> */}
          </div>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
