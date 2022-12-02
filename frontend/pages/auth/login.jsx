import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import axios from "../api/axios"

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!email && !pwd) return;
    const data = {
      email: email,
      password: pwd,
    };
    try {
      const response = await axios.post("/login", data, {
        "Content-Type": "application/json",
      });
      // console.log(response.data)
      setCookie("token", response.data.access_token, { maxAge: 60 * 60 * 12 });
      setEmail("");
      setPwd("");
      router.push("/dashboard");
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <>
      <AuthLayout title={"APPDOC | Login"}>
        <div className="container mx-auto px-4 h-full my-16 lg:my-32">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg bg-blueGray-200 border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-emerald-400 text-4xl mt-4 font-bold">
                      APPDOC
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="input"
                        placeholder="Email"
                        id="email"
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        type="password"
                        className="input"
                        placeholder="Password"
                        id="password"
                      />
                    </div>
                    <div className="">
                      <Link
                        href="/auth/forgotPassword"
                        className="text-slate-500"
                      >
                        <small className="text-slate-400 font-bold text-xs">
                          Forgot password?
                        </small>
                      </Link>
                    </div>

                    <div className="text-center mt-6">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        onClick={handleLogin}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                  <Link
                    href="/"
                    // onClick={(e) => e.preventDefault()}
                    className="text-blueGray-200"
                  >
                    <small>
                      <i className="fas fa-arrow-left mr-2"></i> Back to landing page
                    </small>
                  </Link>
                </div>
                <div className="w-1/2 text-right">
                  <Link href="/auth/register" className="text-blueGray-200">
                    <small>Create new account <i className="fas fa-arrow-right ml-2"></i></small>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
