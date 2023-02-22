import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteCookie, getCookie } from "cookies-next";
import jwt_decode from "jwt-decode";

import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import ModalBox from "../Modals/ModalBox";
import axios from "../../pages/api/axios";

export default function Sidebar() {
  const router = useRouter();
  const pwdRef = useRef()

  const token = getCookie("token");
  const [user, setUser] = useState(decodeUser)
  function decodeUser() {
    try {
      const payload = jwt_decode(token);
      return payload;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async function sendChangePassword() {
    try {
      const res = await axios.post("/auth/email/send/forgot-password", {
        email: user?.email,
      });
      deleteCookie("token");
      router.push("/auth/resetPassword")
    } catch (e) {
      console.error(e)
    }
  }

  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const [adminMenu, setAdminMenu] = useState(false);
  const [receptionistMenu, setReceptionistMenu] = useState(false);
  const [doctorMenu, setDoctorMenu] = useState(false);
  const [pharmacyMenu, setPharmacyMenu] = useState(false);
  const [promotionMenu, setPromotionMenu] = useState(false);
  const [cashierMenu, setCashierMenu] = useState(false);
  const [reportsMenu, setReportsMenu] = useState(false);

  // console.log(adminMenu);

  // console.log(router)
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
                <li
                  className={`items-center ${
                    router.pathname == "#" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <button
                    onClick={() => setAdminMenu((p) => !p)}
                    className={
                      "text-xs py-3 text-slate-500 font-bold block w-full text-left"
                    }
                  >
                    <i className={"fas fa-user mr-2 text-sm "}></i> Admin
                  </button>

                  {adminMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/position" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/position"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/position"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Position
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/employee" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/employee"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/employee"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Employee
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/service" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/service"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/service"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Service
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/diagnose" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/diagnose"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/diagnose"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Diagnose
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/category-payment" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/category-payment"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/category-payment"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Category Payment
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/payment" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/payment"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/payment"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Payment
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/promotion" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/promotion"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/promotion"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Promotion
                        </Link>
                      </li>
                    </ul>
                  )}

                  {/* end submenu */}
                </li>

                <li
                  className={`items-center ${
                    router.pathname == "#" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <button
                    onClick={() => setReceptionistMenu((p) => !p)}
                    className={
                      "text-xs py-3 text-slate-500 font-bold block w-full text-left"
                    }
                  >
                    <i className={"fas fa-newspaper mr-2 text-sm"}></i>{" "}
                    Receptionist
                  </button>

                  {receptionistMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/patients" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/patients"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/patients"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Patients
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/appointment" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="#"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/appointment"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Appointment
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/queue" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/queue"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/queue"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Queue
                        </Link>
                      </li>
                    </ul>
                  )}

                  {/* end submenu */}
                </li>

                <li
                  className={`items-center ${
                    router.pathname == "#" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <button
                    onClick={() => setDoctorMenu((p) => !p)}
                    className={
                      "text-xs py-3 text-slate-500 font-bold block w-full text-left"
                    }
                  >
                    <i className={"fas fa-user-doctor mr-2 text-sm "}></i>{" "}
                    Doctor
                  </button>

                  {doctorMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/patients" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/patients"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/patients"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Patients
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/queue" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/queue"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/queue"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Queue
                        </Link>
                      </li>
                    </ul>
                  )}

                  {/* end submenu */}
                </li>

                <li
                  className={`items-center ${
                    router.pathname == "#" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <button
                    onClick={() => setPharmacyMenu((p) => !p)}
                    className={
                      "text-xs py-3 text-slate-500 font-bold block w-full text-left"
                    }
                  >
                    <i className={"fas fa-mortar-pestle mr-2 text-sm "}></i>{" "}
                    Pharmacy
                  </button>

                  {pharmacyMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/category-item" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/category-item"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/category-item"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Category Item
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/item" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/item"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/item"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Item
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/item-supply" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/item-supply"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/item-supply"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Item Supply
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/stock-adjustment" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/stock-adjustment"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/stock-adjustment"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Stock Adjustment
                        </Link>
                      </li>
                    </ul>
                  )}

                  {/* end submenu */}
                </li>
                <li
                  className={`items-center ${
                    router.pathname == "/dashboard/promotion" &&
                    "text-emerald-500 animate-pulse"
                  }`}
                >
                  <Link
                    href="/dashboard/promotion"
                    className={`text-xs py-3 font-bold block text-slate-500 ${
                      router.pathname == "/dashboard/promotion" &&
                      "text-emerald-500 animate-pulse"
                    }`}
                  >
                    <i className={"fas fa-tag mr-2 text-sm"}></i> Promotion
                  </Link>
                </li>

                {/* {promotionMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li
                        className={`items-center ${
                          router.pathname == "/" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="#"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Manage Data
                        </Link>
                      </li>
                    </ul>
                  )} */}

                {/* end submenu */}

                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <button
                    onClick={() => setCashierMenu((p) => !p)}
                    className={
                      "text-xs py-3 text-slate-500 font-bold block w-full text-left"
                    }
                  >
                    <i className={"fas fa-money-bill mr-2 text-sm "}></i>{" "}
                    Cashier
                  </button>

                  {cashierMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li
                        className={`items-center ${
                          router.pathname == "/dashboard/transaction" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="/dashboard/transaction"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/dashboard/transaction"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Transaction
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="#"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          History
                        </Link>
                      </li>
                    </ul>
                  )}

                  {/* end submenu */}
                </li>

                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <button
                    onClick={() => setReportsMenu((p) => !p)}
                    className={
                      "text-xs py-3 text-slate-500 font-bold block w-full text-left"
                    }
                  >
                    <i className={"fas fa-file mr-2 text-sm "}></i> Reports
                  </button>

                  {reportsMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li
                        className={`items-center ${
                          router.pathname == "/" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="#"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Sales
                        </Link>
                      </li>
                      <li
                        className={`items-center ${
                          router.pathname == "/" &&
                          "text-emerald-500 animate-pulse"
                        }`}
                      >
                        <Link
                          href="#"
                          className={"text-xs py-3 font-semibold block "}
                        >
                          <i
                            className={`fa-regular ${
                              router.pathname == "/"
                                ? "fa-folder-open"
                                : "fa-folder"
                            } mr-2 text-sm`}
                          ></i>{" "}
                          Commision
                        </Link>
                      </li>
                    </ul>
                  )}

                  {/* end submenu */}
                </li>

                <hr className="my-4 md:min-w-full" />

                <li
                  className={`items-center ${
                    router.pathname == "/" && "text-emerald-500 animate-pulse"
                  }`}
                >
                  <Link
                    href="/dashboard/account"
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
                    href="/dashboard/settings"
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
                  <ModalBox id="modalPwd">
                    <h3 className="font-bold text-lg mb-4 text-black">
                      Change Password
                    </h3>
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
                          className="btn btn-ghost rounded-md"
                        >
                          Cancel
                        </label>
                        <button className="btn btn-primary rounded-md" onClick={sendChangePassword}>
                          Send Email
                        </button>
                      </div>
                  </ModalBox>
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
    </>
  );
}
