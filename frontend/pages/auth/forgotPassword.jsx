import React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Link from "next/link";

export default function ForgotPassword() {
  return (
    <>
      <AuthLayout title={"APPDOC | Reset Password"}>
        <div className="container mx-auto px-4 h-full my-16 lg:my-32">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 -lg rounded-lg bg-blueGray-200 border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-emerald-600 text-4xl mt-4 font-bold">
                      APPDOC
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="input"
                        placeholder="Email"
                      />
                    </div>
                    <p className="text-sm text-rose-500 text-justify"><i class="fa-solid fa-triangle-exclamation"></i> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi quo aspernatur voluptatum itaque in ea!</p>

                    <div className="text-center mt-8">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded  hover:-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                      >
                        Send Email
                      </button>
                    </div>
                    <div className="text-center mt-2">
                      <Link
                        href="/auth/login"
                        className=" text-slate-600 text-sm font-bold uppercase px-4 py-0 rounded w-full"
                        type="button"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
