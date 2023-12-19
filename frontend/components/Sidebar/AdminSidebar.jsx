import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";

import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import { DeleteAllCookies } from "../../services/CookieChunk";

export default function AdminSidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const [adminMenu, setAdminMenu] = useState(false);
  const [receptionistMenu, setReceptionistMenu] = useState(false);
  const [doctorMenu, setDoctorMenu] = useState(false);
  const [pharmacyMenu, setPharmacyMenu] = useState(false);
  const [promotionMenu, setPromotionMenu] = useState(false);
  const [cashierMenu, setCashierMenu] = useState(false);
  const [reportsMenu, setReportsMenu] = useState(false);

  // console.log(adminMenu);

  const router = useRouter();
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
            className="fredoka lowercase tracking-wider md:block text-4xl text-rose-500 text-center md:pb-2 mr-0 inline-block whitespace-nowrap font-bold lg:pt-4"
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
                    href="#pablo"
                    className="fredoka md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm font-bold p-4 px-0"
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
                <li className="items-center">
                  <Link
                    href="/admin"
                    className={"text-xs py-3 font-bold block text-slate-500"}
                  >
                    <i className={"fas fa-chart-line mr-2 text-sm "}></i>{" "}
                    Dashboard
                  </Link>
                </li>
              </ul>

              <hr className="my-4 md:min-w-full" />

              <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                <li className="items-center">
                  <Link
                    href="/admin/clients"
                    className={
                      "text-xs py-3 text-slate-500 font-bold block w-full text-left"
                    }
                  >
                    <i className={"fas fa-user mr-2 text-sm "}></i> Clients
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    href="/admin/diagnose"
                    className={
                      "text-xs py-3 text-slate-500 font-bold block w-full text-left"
                    }
                  >
                    <i className={"fas fa-file-text mr-2 text-sm "}></i> Diagnoses
                  </Link>
                </li>

                {/* {adminMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li className="items-center">
                        <Link
                          href="/admin/clients"
                          className={"text-xs py-3 font-bold block "}
                        >
                          <i className={"fas fa-arrow-right mr-2 text-sm "}></i>{" "}
                          Clients
                        </Link>
                      </li>
                    </ul>
                  )}

                  {adminMenu && (
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none ml-6 text-slate-400">
                      <li className="items-center">
                        <Link
                          href="/admin/diagnose"
                          className={"text-xs py-3 font-bold block "}
                        >
                          <i className={"fas fa-arrow-right mr-2 text-sm "}></i>{" "}
                          Diagnose
                        </Link>
                      </li>
                    </ul>
                  )} */}

                {/* end submenu */}

                <hr className="my-4 md:min-w-full" />

                {/* <li className="items-center">
                  <Link
                    href="#pablo"
                    className={"text-xs py-3 font-bold block  text-slate-500"}
                  >
                    <i className={"fas fa-lock mr-2 text-sm "}></i> Change
                    Password
                  </Link>
                </li>

                <li className="items-center">
                  <Link
                    href="#pablo"
                    className={"text-xs py-3 font-bold block  text-slate-500"}
                  >
                    <i className={"fas fa-gear mr-2 text-sm "}></i> Settings
                  </Link>
                </li> */}

                <li className="items-center">
                  <button
                    onClick={() => {
                      DeleteAllCookies();
                      router.push("/auth/admin");
                    }}
                    className={"text-xs py-3 font-bold block  text-rose-500"}
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
