import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Link from "next/link";
import axios from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  async function sendEmail(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/auth/email/send/forgot-password", {
        email,
      });
      console.log(res);
      setIsDone(true);
    } catch (e) {
      console.log(e);
      setEmailError(e.response?.data?.message);
    }
    setIsLoading(false);
  }
  console.log(email);
  return (
    <>
      <AuthLayout title={"APDOC | Forgot Password"}>
        <div className="container mx-auto px-4 h-[60vh]">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 -lg rounded-lg border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-white text-4xl mt-4 font-bold">
                      APDOC
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  {!isDone ? (
                    <form onSubmit={(e) => sendEmail(e)}>
                      <div className="relative w-full mb-3">
                        <label
                          className="block text-zinc-500 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          required
                          className="input w-full"
                          placeholder="your@email.example"
                        />

                        <label className="block text-rose-500 text-xs mb-2 mt-2">
                          {emailError}
                        </label>
                      </div>
                      {/* <p className="text-sm text-rose-500 text-justify"><i class="fa-solid fa-triangle-exclamation"></i> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi quo aspernatur voluptatum itaque in ea!</p> */}

                      <div className="text-center mt-8">
                        {!isLoading ? (
                          <button className="bg-emerald-600 text-white active:bg-emerald-700 active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded  hover:-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150">
                            Send Email
                          </button>
                        ) : (
                          <div
                            className="cursor-progress bg-zinc-700 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded  hover:-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            type="button"
                            disabled
                          >
                            Loading ...
                          </div>
                        )}
                      </div>
                      <div className="text-center mt-4">
                        <Link
                          href="/auth/login"
                          className=" text-white text-sm font-bold px-4 py-0 rounded w-full"
                        >
                          Cancel
                        </Link>
                      </div>
                    </form>
                  ) : (
                    <div
                      className="cursor-progress mx-autos text-white text-sm text-center"
                      type="button"
                      disabled
                    >
                      Please check your email,
                      <Link href={"/auth/login"}>
                        <span className="text-emerald-200">
                          {" "}
                          back to Login page
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
