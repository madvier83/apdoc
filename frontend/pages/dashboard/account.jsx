import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import DashboardLayout from "../../layouts/DashboardLayout";

import PersonalDetails from "../../components/Forms/PersonalDetails";
import CardProfile from "../../components/Cards/CardProfile";
import BusinessInformation from "../../components/Forms/BusinessInformation";
import CardBusiness from "../../components/Cards/CardBusiness";

export default function Account() {
  const token = getCookie("token");
  const [user, setUser] = useState({ email: "", phone: "" });
  useEffect(() => {
    try {
      const payload = jwt_decode(token);
      setUser(payload);
    } catch (err) {
      console.log(err);
    }
  }, []);
  // console.log(user);
  return (
    <>
      <DashboardLayout title="Account" headerStats={false}>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-8/12 mt-1">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
              <div className="rounded-t bg-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <h6 className="text-blueGray-700 text-xl font-bold">
                    Personal Details
                  </h6>
                  <button
                    className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    Settings
                  </button>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>
                  <div className="flex flex-wrap">
                    <div className="w-full px-4 mt-8">
                      <div className="relative w-full mb-3">
                        <label
                          className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                          htmlFor="grid-password"
                        >
                          <span>Username </span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value="-"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                          htmlFor="grid-password"
                        >
                          <span>Email </span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={user.email}
                            disabled
                          />
                          <span className="absolute top-[22%] right-2 text-sm font-bold bg-amber-300 text-amber-700 rounded ml-2 normal-case py-[2px] px-4 cursor-pointer">
                            Verify now <i className="fas fa-arrow-right"></i>
                          </span>
                        </div>
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                          htmlFor="grid-password"
                        >
                          <span>Phone </span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={user.phone}
                            disabled
                          />
                          <span className="absolute top-[22%] right-2 text-sm font-bold bg-emerald-300 text-emerald-700 rounded ml-2 normal-case py-[2px] px-4 cursor-pointer">
                            Verified <i className="fas fa-check"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
              <div className="rounded-t bg-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <h6 className="text-blueGray-700 text-xl font-bold">
                    Business Info
                  </h6>
                  <button
                    className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    Settings
                  </button>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>
                  <div className="flex flex-wrap">
                    <div className="w-full px-4 mt-8">
                      <div className="relative w-full mb-3">
                        <label
                          className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                          htmlFor="grid-password"
                        >
                          <span>Business Name</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={user.email}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="mt-6 border-b-1 border-blueGray-300 py-4" />

                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          City
                        </label>
                        <input
                          type="email"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          defaultValue="New York"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          defaultValue="United States"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Postal Code
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          defaultValue="123456"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="mt-6 border-b-1 border-blueGray-300 py-4" />

                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          About
                        </label>
                        <textarea
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          rows="4"
                          defaultValue="A beautiful UI Kit and Admin for NextJS & Tailwind CSS. It is Free
                          disabled
                    and Open Source."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
