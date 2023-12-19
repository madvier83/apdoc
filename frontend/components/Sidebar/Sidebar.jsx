import React, { useEffect, useRef, useState, useReducer } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import ModalBox from "../Modals/ModalBox";
import axios from "../../pages/api/axios";
import { DeleteAllCookies, GetCookieChunk } from "../../services/CookieChunk";

export default function Sidebar() {
  const router = useRouter();
  const pwdRef = useRef();
  const [accesses, setAccesses] = useState([]);

  // const { isFallback, events } = useRouter()

  // const googleTranslateElementInit = () => {
  //   new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element')
  // }

  // useEffect(() => {
  //   const id = 'google-translate-script'

  //   const addScript = () => {
  //     const s = document.createElement('script')
  //     s.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit')
  //     s.setAttribute('id', id)
  //     const q = document.getElementById(id)
  //     if (!q) {
  //       document.body.appendChild(s)
  //       window.googleTranslateElementInit = googleTranslateElementInit
  //     }
  //   }

  //   const removeScript = () => {
  //     const q = document.getElementById(id)
  //     if (q) q.remove()
  //     const w = document.getElementById('google_translate_element')
  //     if (w) w.innerHTML = ''
  //   }

  //   isFallback || addScript()

  //   events.on('routeChangeStart', removeScript)
  //   events.on('routeChangeComplete', addScript)

  //   return () => {
  //     events.off('routeChangeStart', removeScript)
  //     events.off('routeChangeComplete', addScript)
  //   }
  // }, [])

  //  Translate

  const initialAccess = [
    {
      name: "admin",
      route: "/dashboard/admin",
      access: true,
      description:
        "Kontrol penuh pusat. Manajemen pengguna, konfigurasi sistem, dan manajemen layanan.",
      submenu: [
        {
          name: "jabatan",
          route: "/dashboard/admin/position",
          access: true,
          description: "Buat jabatan kustom untuk karyawan.",
        },
        {
          name: "karyawan",
          route: "/dashboard/admin/employee",
          access: true,
          description: "Mengelola rekrutmen dan karyawan Anda.",
        },
        {
          name: "kategori-pembayaran",
          route: "/dashboard/admin/category-payment",
          access: true,
          description: "Mengelola kategori untuk metode pembayaran.",
        },
        {
          name: "pembayaran",
          route: "/dashboard/admin/payment",
          access: true,
          description: "Sesuaikan pilihan pembayaran untuk transaksi.",
        },
        {
          name: "kategori-pengeluaran",
          route: "/dashboard/admin/category-outcome",
          access: true,
          description: "Mengelola kategori untuk pengeluaran.",
        },
        {
          name: "pengeluaran",
          route: "/dashboard/admin/outcome",
          access: true,
          description:
            "Atur pengeluaran Anda dan buat keputusan berdasarkan informasi.",
        },
        {
          name: "promosi",
          route: "/dashboard/admin/promotion",
          access: true,
          description:
            "Desain dan konfigurasi diskon menarik, serta penawaran khusus untuk menarik dan melibatkan pelanggan.",
        },
      ],
    },
    {
      name: "resepsionis",
      route: "/dashboard/receptionist",
      access: true,
      description:
        "Penerimaan dan penjadwalan. Mengelola data dan janji temu pasien.",
      submenu: [
        {
          name: "pasien",
          route: "/dashboard/receptionist/patient",
          access: true,
          description: "Mengelola data dan informasi pasien.",
        },
        {
          name: "janji-temu",
          route: "/dashboard/receptionist/appointment",
          access: true,
          description: "Jadwalkan dan kelola janji temu pasien.",
        },
        {
          name: "antrean",
          route: "/dashboard/receptionist/queue",
          access: true,
          description: "Mengelola antrean pasien dan daftar tunggu.",
        },
      ],
    },
    {
      name: "dokter",
      route: "/dashboard/doctor",
      access: true,
      description:
        "Dokter. Lihat data diagnosa, layanan medis, dan catatan pasien.",
      submenu: [
        {
          name: "diagnosa",
          route: "/dashboard/doctor/diagnose",
          access: true,
          description: "Lihat data diagnosa dan pemeriksaan medis.",
        },
        {
          name: "kategori-layanan",
          route: "/dashboard/doctor/category-service",
          access: true,
          description: "Mengelola kategori untuk layanan medis.",
        },
        {
          name: "layanan",
          route: "/dashboard/doctor/service",
          access: true,
          description: "Mengelola layanan medis dan pengobatan.",
        },
        {
          name: "pasien",
          route: "/dashboard/doctor/patient",
          access: true,
          description: "Mengelola catatan pasien dan riwayat medis.",
        },
        {
          name: "antrean",
          route: "/dashboard/doctor/queue",
          access: true,
          description:
            "Memantau dan mengelola antrean pasien dan daftar tunggu.",
        },
      ],
    },
    {
      name: "apotek",
      route: "/dashboard/pharmacy",
      access: true,
      description:
        "Apotek. Mengelola persediaan obat, pemasok, dan pesanan pembelian.",
      submenu: [
        {
          name: "kategori-item",
          route: "/dashboard/pharmacy/category-item",
          access: true,
          description: "Mengelola kategori untuk barang farmasi.",
        },
        {
          name: "item",
          route: "/dashboard/pharmacy/item",
          access: true,
          description: "Mengelola barang farmasi dan obat-obatan.",
        },
        {
          name: "pasokan-item",
          route: "/dashboard/pharmacy/supply",
          access: true,
          description:
            "Mengelola persediaan dan pengisian ulang barang farmasi.",
        },
        {
          name: "pemasok",
          route: "/dashboard/pharmacy/supplier",
          access: true,
          description: "Mengelola pemasok dan vendor farmasi.",
        },
        {
          name: "pesanan-pembelian",
          route: "/dashboard/pharmacy/purchase-order",
          access: true,
          description: "Mengelola pesanan pembelian untuk barang farmasi.",
        },
        {
          name: "penyesuaian-stok",
          route: "/dashboard/pharmacy/stock-adjustment",
          access: true,
          description:
            "Mengelola penyesuaian stok dan pengendalian inventaris.",
        },
      ],
    },
    {
      name: "kasir",
      route: "/dashboard/cashier",
      access: true,
      description: "Kasir. Mengelola transaksi, termasuk obat dan pembayaran.",
      submenu: [
        {
          name: "transaksi",
          route: "/dashboard/cashier/transaction",
          access: true,
          description:
            "Mengotomatisasi dan mengelola pertukaran, memastikan akurasi, keamanan, dan pemrosesan pembayaran yang lancar dalam transaksi.",
        },
        {
          name: "transaksi-apoteker",
          route: "/dashboard/cashier/apoteker",
          access: true,
          description:
            "Mencatat, mengeluarkan, dan melacak transaksi obat untuk memastikan dosis yang akurat dan kepatuhan farmasi.",
        },
        {
          name: "riwayat",
          route: "/dashboard/cashier/history",
          access: true,
          description:
            "Catatan kronologis dari semua transaksi sebelumnya, menyediakan riwayat keuangan, pembelian, dan pembayaran yang telah dibuat.",
        },
      ],
    },
    {
      name: "laporan",
      route: "/dashboard/report",
      access: true,
      description:
        "Akses analisis mendalam tentang data penjualan, pendapatan, dan tren. Dapatkan wawasan berharga untuk mengoptimalkan strategi dan pertumbuhan maksimal.",
      submenu: [
        {
          name: "penjualan",
          route: "/dashboard/report/sales",
          access: true,
          description:
            "Akses analisis mendalam tentang data penjualan, pendapatan, dan tren. Dapatkan wawasan berharga untuk mengoptimalkan strategi dan pertumbuhan maksimal.",
        },
      ],
    },
  ];

  const token = GetCookieChunk("token_");
  function parseJwt(token) {
    return JSON.parse(Buffer?.from(token?.split(".")[1], "base64").toString());
  }
  const [user, setUser] = useState({ email: "" });
  useEffect(() => {
    let jwt = parseJwt(token);
    try {
      // setAccesses(JSON.parse(jwt.accesses));
      if (jwt?.role_id == 2) {
        // console.log(jwt.role_id)
        setAccesses(initialAccess);
      } else {
        setAccesses(JSON.parse(jwt?.accesses));
      }
    } catch (e) {}
    setUser(jwt);
  }, []);

  async function sendChangePassword() {
    try {
      const res = await axios.post("/auth/email/send/forgot-password", {
        email: user?.email,
      });
      deleteCookie("token");
      router.push("/auth/resetPassword");
    } catch (e) {
      console.error(e);
    }
  }

  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const initialSidebar = {
    user: false,
    admin: false,
    resepsionis: false,
    dokter: false,
    apotek: false,
    kasir: false,
    laporan: false,
  };
  const [sidebar, setSidebar] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialSidebar
  );
  const [cookieCheck, setCookieCheck] = useState(false);
  useEffect(() => {
    try {
      let sidebarCookie = JSON.parse(getCookie("sidebar"));
      setSidebar(sidebarCookie);
      setCookieCheck(true);
    } catch (e) {
      console.error(e);
      setCookie("sidebar", JSON.stringify(sidebar));
      setCookieCheck(true);
    }
  }, []);
  useEffect(() => {
    if (cookieCheck) {
      setCookie("sidebar", JSON.stringify(sidebar));
    }
  }, [sidebar]);

  // console.log(accesses);

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            href="/dashboard"
            className="font-fredoka lowercase tracking-wider md:block text-4xl text-emerald-500 text-center md:pb-2 mr-0 inline-block whitespace-nowrap font-bold lg:pt-4"
          >
            APDOC
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">{/* <UserDropdown /> */}</li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    href="#"
                    className="md:block text-left md:pb-2 text-emerald-500 mr-0 inline-block whitespace-nowrap text-sm font-bold p-4 px-0"
                  >
                    APDOC
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* <div id="google_translate_element"></div> */}

            <div className="text-slate-400">
              <hr className="my-4 md:min-w-full hidden md:block" />
              <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                <li
                  className={`items-center ${
                    router.pathname == "/dashboard" && "text-emerald-500 "
                  }`}
                >
                  <Link
                    href="/dashboard"
                    className={`text-xs py-3 font-bold block text-slate-500 ${
                      router.pathname == "/dashboard" && "text-emerald-500 "
                    }`}
                  >
                    <i className={"fas fa-chart-line mr-2 text-sm "}></i> Dasbor
                  </Link>
                </li>
              </ul>

              <hr className="my-4 md:min-w-full" />

              <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                {accesses?.map((menu, index) => {
                  if (menu.access) {
                    return (
                      <li
                        key={index}
                        className={`items-center ${
                          router.pathname == "/" && "text-emerald-500 "
                        }`}
                      >
                        <button
                          onClick={() =>
                            setSidebar({
                              ...initialSidebar,
                              [menu.name]: !sidebar[menu.name],
                            })
                          }
                          className={
                            "text-xs py-3 text-slate-500 font-bold block w-full text-left capitalize"
                          }
                        >
                          <i
                            className={`fas ${
                              sidebar[menu.name]
                                ? "fa-folder-open"
                                : "fa-folder"
                            }  mr-2 text-sm `}
                          ></i>{" "}
                          {menu.name}
                        </button>

                        <ul
                          className={`md:flex-col md:min-w-full list-none ml-6 text-slate-400 ${
                            sidebar[menu.name] == true ? "block" : "hidden"
                          }`}
                        >
                          {menu.submenu.map((obj, index) => {
                            if (obj.access) {
                              return (
                                <li
                                  key={index}
                                  className={`items-center ${
                                    router.pathname.startsWith(obj.route) &&
                                    "text-emerald-500"
                                  }`}
                                >
                                  <Link
                                    scroll={false}
                                    href={obj.route}
                                    className={
                                      "text-xs py-3 font-semibold block capitalize"
                                    }
                                  >
                                    <i
                                      className={`fa-regular ${
                                        router.pathname.startsWith(obj.route)
                                          ? "fa-folder-open"
                                          : "fa-folder"
                                      } mr-2 text-sm`}
                                    ></i>{" "}
                                    {obj.name.replace("-", " ")}
                                  </Link>
                                </li>
                              );
                            }
                          })}
                        </ul>
                      </li>
                    );
                  }
                })}

                <hr className="my-4 md:min-w-full" />

                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 "
                  }`}
                >
                  <Link
                    href="/account"
                    className={"text-xs py-3 font-bold block  text-slate-500"}
                  >
                    <i className={"fas fa-user mr-2 text-sm "}></i> Akun
                  </Link>
                </li>

                {user?.role_id == 2 && (
                  <li
                    // key={index}
                    className={`items-center list-none ${
                      router.pathname == "/" && "text-emerald-500 "
                    }`}
                  >
                    <button
                      onClick={() =>
                        setSidebar({ ...initialSidebar, user: !sidebar.user })
                      }
                      className={
                        "text-xs py-3 text-slate-500 font-bold block w-full text-left capitalize"
                      }
                    >
                      <i
                        className={`fas ${
                          sidebar.user ? "fa-user-plus" : "fa-user-plus"
                        }  mr-1 text-sm `}
                      ></i>{" "}
                      User
                    </button>

                    <ul
                      className={`md:flex-col md:min-w-full list-none ml-6 text-slate-400 ${
                        sidebar.user == true ? "block" : "hidden"
                      }`}
                    >
                      <li
                        // key={index}
                        className={`items-center list-none ${
                          router.pathname.startsWith("/owner/access") &&
                          "text-emerald-500"
                        }`}
                      >
                        <Link
                          scroll={false}
                          href={"/owner/access"}
                          className={
                            "text-xs py-3 font-semibold block capitalize"
                          }
                        >
                          <i
                            className={`fas ${
                              router.pathname.startsWith("/owner/access")
                                ? "fa-fingerprint"
                                : "fa-fingerprint"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Akses User
                        </Link>
                      </li>
                      <li
                        // key={index}
                        className={`items-center list-none ${
                          router.pathname.startsWith("/owner/slots") &&
                          "text-emerald-500"
                        }`}
                      >
                        <div
                          // scroll={false}
                          onClick={() => router.push("/owner/slots")}
                          className={
                            "text-xs py-3 font-semibold block capitalize cursor-pointer"
                          }
                        >
                          <i
                            className={`fas ${
                              router.pathname.startsWith("/owner/slots")
                                ? "fa-address-book"
                                : "fa-address-book"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Slot User
                        </div>
                      </li>
                    </ul>
                  </li>
                )}

                {/* <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 "
                  }`}
                >
                  <Link
                    href="/settings"
                    className={"text-xs py-3 font-bold block  text-slate-500"}
                  >
                    <i className={"fas fa-gear mr-2 text-sm "}></i> Settings
                  </Link>
                </li> */}

                {user?.role_id == 2 && (
                  <li
                    // key={index}
                    className={`items-center list-none ${
                      router.pathname == "/" && "text-emerald-500 "
                    }`}
                  >
                    <button
                      onClick={() =>
                        setSidebar({
                          ...initialSidebar,
                          settings: !sidebar.settings,
                        })
                      }
                      className={
                        "text-xs py-3 text-slate-500 font-bold block w-full text-left capitalize"
                      }
                    >
                      <i className={`fas fa-cogs mr-2 text-sm `}></i>Pengaturan
                    </button>

                    <ul
                      className={`md:flex-col md:min-w-full list-none ml-6 text-slate-400 ${
                        sidebar.settings == true ? "block" : "hidden"
                      }`}
                    >
                      <li
                        // key={index}
                        className={`items-center list-none ${
                          router.pathname.startsWith("/settings/recipient") &&
                          "text-emerald-500"
                        }`}
                      >
                        <Link
                          scroll={false}
                          href={"/settings/recipient"}
                          className={
                            "text-xs py-3 font-semibold block capitalize"
                          }
                        >
                          <i className={`fas fa-scroll mr-2 text-sm`}></i> Struk
                        </Link>
                      </li>
                      <li
                        // key={index}
                        className={`items-center list-none ${
                          router.pathname.startsWith(
                            "/settings/notification"
                          ) && "text-emerald-500"
                        }`}
                      >
                        <Link
                          scroll={false}
                          href={"/settings/notification"}
                          className={
                            "text-xs py-3 font-semibold block capitalize"
                          }
                        >
                          <i className={`fas fa-envelope mr-2 text-sm`}></i>{" "}
                          Pemberitahuan
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 "
                  }`}
                >
                  <label
                    htmlFor="modalPwd"
                    className={
                      "text-xs py-3 font-bold block  text-slate-500 cursor-pointer"
                    }
                  >
                    <i className={"fas fa-lock mr-2 text-sm "}></i> Ubah kata
                    sandi
                  </label>
                </li>
                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 "
                  }`}
                >
                  <button
                    onClick={() => {
                      // deleteCookie("clinic");
                      // deleteCookie("token");
                      DeleteAllCookies();
                      router.push("/auth/login");
                    }}
                    className={"text-xs py-3 font-bold block  text-rose-400"}
                  >
                    <i className={"fas fa-arrow-left mr-2 text-sm "}></i> Keluar
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <ModalBox id="modalPwd">
        <h3 className="font-bold text-lg mb-4 text-black">Ubah kata sandi</h3>
        <input type="hidden" autoComplete="off" />
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="text"
            name="name"
            value={user?.email}
            placeholder=""
            className="input text-zinc-700 input-bordered input-primary border-slate-300 w-full"
            disabled
          />
        </div>
        <div className="modal-action rounded-sm">
          <label
            htmlFor="modalPwd"
            ref={pwdRef}
            className="btn btn-ghost text-black rounded-md"
          >
            Cancel
          </label>
          <button
            className="btn btn-primary rounded-md"
            onClick={sendChangePassword}
          >
            Kirim Email
          </button>
        </div>
      </ModalBox>
    </>
  );
}
