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
      submenu: [
        {
          name: "position",
          route: "/dashboard/admin/position",
          access: true,
        },
        {
          name: "employee",
          route: "/dashboard/admin/employee",
          access: true,
        },
        {
          name: "category-payment",
          route: "/dashboard/admin/category-payment",
          access: true,
        },
        { name: "payment", route: "/dashboard/admin/payment", access: true },
        {
          name: "category-outcome",
          route: "/dashboard/admin/category-outcome",
          access: true,
        },
        { name: "outcome", route: "/dashboard/admin/outcome", access: true },
        {
          name: "promotion",
          route: "/dashboard/admin/promotion",
          access: true,
        },
      ],
    },
    {
      name: "receptionist",
      route: "/dashboard/receptionist",
      access: true,
      submenu: [
        {
          name: "patient",
          route: "/dashboard/receptionist/patient",
          access: true,
        },
        {
          name: "appointment",
          route: "/dashboard/receptionist/appointment",
          access: true,
        },
        {
          name: "queue",
          route: "/dashboard/receptionist/queue",
          access: true,
        },
      ],
    },
    {
      name: "doctor",
      route: "/dashboard/doctor",
      access: true,
      submenu: [
        {
          name: "diagnose",
          route: "/dashboard/doctor/diagnose",
          access: true,
        },
        {
          name: "category-service",
          route: "/dashboard/doctor/category-service",
          access: true,
        },
        {
          name: "service",
          route: "/dashboard/doctor/service",
          access: true,
        },
        {
          name: "patient",
          route: "/dashboard/doctor/patient",
          access: true,
        },
        { name: "queue", route: "/dashboard/doctor/queue", access: true },
      ],
    },
    {
      name: "pharmacy",
      route: "/dashboard/pharmacy",
      access: true,
      submenu: [
        {
          name: "category-item",
          route: "/dashboard/pharmacy/category-item",
          access: true,
        },
        { name: "item", route: "/dashboard/pharmacy/item", access: true },
        {
          name: "item-supply",
          route: "/dashboard/pharmacy/supply",
          access: true,
        },
        {
          name: "supplier",
          route: "/dashboard/pharmacy/supplier",
          access: true,
        },
        {
          name: "purchase-order",
          route: "/dashboard/pharmacy/purchase-order",
          access: true,
        },
        {
          name: "stock-adjustment",
          route: "/dashboard/pharmacy/stock-adjustment",
          access: true,
        },
      ],
    },
    {
      name: "cashier",
      route: "/dashboard/cashier",
      access: true,
      submenu: [
        {
          name: "transaction",
          route: "/dashboard/cashier/transaction",
          access: true,
        },
        {
          name: "transaction apoteker",
          route: "/dashboard/cashier/apoteker",
          access: true,
        },
        {
          name: "history",
          route: "/dashboard/cashier/history",
          access: true,
        },
      ],
    },
    {
      name: "report",
      route: "/dashboard/report",
      access: true,
      submenu: [
        { name: "sales", route: "/dashboard/report/sales", access: true },
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
    receptionist: false,
    doctor: false,
    pharmacy: false,
    promotion: false,
    cashier: false,
    report: false,
    settings: false,
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
            className="md:block text-4xl text-emerald-500 text-center md:pb-2 mr-0 inline-block whitespace-nowrap font-bold lg:pt-4"
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
                    <i className={"fas fa-chart-line mr-2 text-sm "}></i>{" "}
                    Dashboard
                  </Link>
                </li>
              </ul>

              <hr className="my-4 md:min-w-full" />

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
                        sidebar.user ? "fa-folder-open" : "fa-folder"
                      }  mr-2 text-sm `}
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
                          className={`fa-regular ${
                            router.pathname.startsWith("/owner/access")
                              ? "fa-folder-open"
                              : "fa-folder"
                          } mr-2 text-sm`}
                        ></i>{" "}
                        User Access
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
                          className={`fa-regular ${
                            router.pathname.startsWith("/owner/slots")
                              ? "fa-folder-open"
                              : "fa-folder"
                          } mr-2 text-sm`}
                        ></i>{" "}
                        User Slots
                      </div>
                    </li>
                  </ul>
                </li>
              )}

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
                    <i className={"fas fa-user mr-2 text-sm "}></i> Account
                  </Link>
                </li>

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
                      <i className={`fas fa-cogs mr-2 text-sm `}></i> Settings
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
                          <i className={`fas fa-scroll mr-2 text-sm`}></i>{" "}
                          Recipient
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
                          Notification
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
                    <i className={"fas fa-lock mr-2 text-sm "}></i> Change
                    Password
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
                    className={"text-xs py-3 font-bold block  text-slate-500"}
                  >
                    <i className={"fas fa-arrow-left mr-2 text-sm "}></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <ModalBox id="modalPwd">
        <h3 className="font-bold text-lg mb-4 text-black">Change Password</h3>
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
            Send Email
          </button>
        </div>
      </ModalBox>
    </>
  );
}
