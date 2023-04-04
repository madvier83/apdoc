import React, { useEffect, useRef, useState, useReducer } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import ModalBox from "../Modals/ModalBox";
import axios from "../../pages/api/axios";

export default function Sidebar() {
  const router = useRouter();
  const pwdRef = useRef();

  const token = getCookie("token");
  function parseJwt(token) {
    return JSON.parse(Buffer?.from(token?.split(".")[1], "base64").toString());
  }
  const [user, setUser] = useState({email: ""});
  useEffect(() => {
    setUser(parseJwt(token))
  }, [])

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
    admin: false,
    receptionist: false,
    doctor: false,
    pharmacy: false,
    promotion: false,
    cashier: false,
    report: false,
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

  const access = [
    {
      name: "admin",
      route: "/dashboard/admin",
      access: true,
      submenu: [
        { name: "user", route: "/dashboard/admin/user", access: true },
        { name: "position", route: "/dashboard/admin/position", access: true },
        { name: "access", route: "/dashboard/admin/access", access: true },
        { name: "employee", route: "/dashboard/admin/employee", access: true },
        { name: "service", route: "/dashboard/admin/service", access: true },
        { name: "diagnose", route: "/dashboard/admin/diagnose", access: true },
        {
          name: "category-payment",
          route: "/dashboard/admin/category-payment",
        },
        { name: "payment", route: "/dashboard/admin/payment", access: true },
        {
          name: "category-outcome",
          route: "/dashboard/admin/category-outcome",
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
        { name: "queue", route: "/dashboard/receptionist/queue", access: true },
      ],
    },
    {
      name: "doctor",
      route: "/dashboard/doctor",
      access: true,
      submenu: [
        { name: "patient", route: "/dashboard/doctor/patient", access: true },
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
          route: "/dashboard/pharmacy/item-supply",
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
        { name: "history", route: "/dashboard/cashier/history", access: true },
      ],
    },
    {
      name: "report",
      route: "/dashboard/report",
      access: true,
      submenu: [
        { name: "sales", route: "/dashboard/report/sales", access: true },
        {
          name: "commision",
          route: "/dashboard/report/commision",
          access: true,
        },
      ],
    },
  ];
  // console.log(sidebar);

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
            href="/"
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

            <div className="text-slate-400">
              <hr className="my-4 md:min-w-full hidden md:block" />
              <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                <li
                  className={`items-center ${
                    router.pathname == "/dashboard" &&
                    "text-emerald-500 animate-pulse"
                  }`}
                >
                  <Link
                    href="/dashboard"
                    className={`text-xs py-3 font-bold block text-slate-500 ${
                      router.pathname == "/dashboard" &&
                      "text-emerald-500 animate-pulse"
                    }`}
                  >
                    <i className={"fas fa-chart-line mr-2 text-sm "}></i>{" "}
                    Dashboard
                  </Link>
                </li>
              </ul>

              <hr className="my-4 md:min-w-full" />

              <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                {access.map((menu, index) => {
                  return (
                    <li
                      key={index}
                      className={`items-center ${
                        router.pathname == "/" &&
                        "text-emerald-500 animate-pulse"
                      }`}
                    >
                      <button
                        onClick={() =>
                          setSidebar({ [menu.name]: !sidebar[menu.name] })
                        }
                        className={
                          "text-xs py-3 text-slate-500 font-bold block w-full text-left capitalize"
                        }
                      >
                        <i
                          className={`fas ${
                            sidebar[menu.name] ? "fa-folder-open" : "fa-folder"
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
                })}

                <hr className="my-4 md:min-w-full" />

                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <Link
                    href="/account"
                    className={"text-xs py-3 font-bold block  text-slate-500"}
                  >
                    <i className={"fas fa-user mr-2 text-sm "}></i> Account
                  </Link>
                </li>

                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <Link
                    href="/settings"
                    className={"text-xs py-3 font-bold block  text-slate-500"}
                  >
                    <i className={"fas fa-gear mr-2 text-sm "}></i> Settings
                  </Link>
                </li>

                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <label
                    htmlFor="modalPwd"
                    className={"text-xs py-3 font-bold block  text-slate-500"}
                  >
                    <i className={"fas fa-lock mr-2 text-sm "}></i> Change
                    Password
                  </label>
                </li>
                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <button
                    onClick={() => {
                      deleteCookie("token");
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
