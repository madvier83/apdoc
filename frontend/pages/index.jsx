import React from "react";

// components

import LandingLayout from "../layouts/LandingLayout";
import Link from "next/link";
import hero from "../public/hero.png";
import hero2 from "../public/hero2.png";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  return (
    <>
      <LandingLayout>
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${hero2.src})`,
              backgroundPosition: "center center",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>

          <div className="container px-0 relative">
            <div className="items-center flex flex-wrap">
              <div className="flex flex-col lg:flex-row justify-center items-center mt-16 lg:mt-32 mb-8">
                <div className="lg:w-1/2">
                  <Image
                    alt=""
                    width={1000}
                    height={700}
                    src={"/mockup1.png"}
                  ></Image>
                </div>

                <div className="lg:w-1/2 px-8 lg:px-0 lg:ml-16 mt-8 lg:mt-0">
                  <h1 className="text-white font-semibold text-2xl lg:text-5xl capitalize">
                    Solusi terbaik untuk mencatat rekam medis elektronik anda
                  </h1>
                  <p className="mt-8 text-lg text-blueGray-400">
                    APDOC Clinic System hadir untuk membantu Anda mengoptimalkan
                    efisiensi dan pengelolaan klinik Anda.
                  </p>
                  <a
                    href={`https://wa.me/6287722388857`}
                    target="_blank"
                    className="btn bg-emerald-400 text-black mt-8 font-bold"
                  >
                    Hubungi Kami
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-16"
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
        </div>

        <section className="pb-36 bg-emerald-300 pt-28">
          <h1 className="text-center text-black font-semibold text-5xl mb-12">
            Fitur Utama
          </h1>
          <div className="container mx-auto px-8">
            <div className="flex flex-wrap">
              <div className="lg:pt-0 pt-0 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-amber-400">
                      <i className="fas fa-cash-register"></i>
                    </div>
                    <h6 className="text-xl font-semibold">
                      Point of sales & Sistem Kasir
                    </h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Fitur POS (Point of Sale) adalah solusi lengkap untuk
                      mengelola transaksi dan penjualan dengan mudah dan
                      efisien.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                      <i className="fas fa-book-medical"></i>
                    </div>
                    <h6 className="text-xl font-semibold">
                      Rekam Medis Elektronik (RME)
                    </h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Rekam Medis Elektronik adalah penyimpanan dan pengelolaan
                      informasi medis pasien dalam bentuk digital.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-0 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-sky-400">
                      <i className="fas fa-hospital-user"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Database Pasien</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Database pasien adalah kumpulan informasi medis dan
                      administratif tentang pasien yang disimpan dalam format
                      digital.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:pt-0 pt-0 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <i className="fas fa-award"></i>
                    </div>
                    <h6 className="text-xl font-semibold">
                      Sistem Resepsionis
                    </h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Fitur untuk meningkatkan efisiensi, pengalaman pasien, dan
                      koordinasi antara staf medis, dan tim administratif.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-400">
                      <i className="fas fa-clock"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Sistem antrean</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Sistem yang digunakan untuk mengelola antrean pasien atau
                      layanan dengan cara yang lebih teratur dan efisien.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-0 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                      <i className="fas fa-mortar-pestle"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Farmasi</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Sitem yang efisien dalam mencatat informasi obat, jumlah
                      stok, distribusi, penggunaan, dan penyesuaian stok.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LandingLayout>
    </>
  );
}
