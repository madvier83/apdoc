import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-emerald-200 pt-16 pb-6">
        <div
          className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-emerald-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap text-center lg:text-left">
            <div className="w-full lg:w-6/12 px-4">
              <h4 className="text-3xl font-semibold">
                Untuk informasi lebih lanjut hubungi
              </h4>

              <div className="mt-2 lg:mb-0 mb-6 flex items-center">
                {/* <button
                  className="bg-emerald-900 text-lightBlue-400 shadow-lg font-normal h-10 px-3 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 flex"
                  type="button"
                >
                  <i className="fab fa-whatsapp text-white"></i>
                </button> */}
                  <h5 className="tracking-wider text-lg font-semibold text-black">
                    +62 8772 2388 857
                  </h5>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="flex flex-wrap items-top mb-6">
                <div className="w-full lg:w-4/12 px-4 ml-auto">
                  <span className="block uppercase text-emerald-600 text-sm font-semibold mb-2">
                    Link
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <Link
                        className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="https://www.creative-tim.com/presentation?ref=nnjs-footer"
                      >
                        Daftar
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="https://blog.creative-tim.com?ref=nnjs-footer"
                      >
                        Masuk
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-emerald-600" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-emerald-600 font-semibold py-1">
                Copyright © {new Date().getFullYear()} Cursor ID{" "}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
