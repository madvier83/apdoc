import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";
import { SetCookieChunk } from "../../services/CookieChunk";

export default function Login() {
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
  const [credential, setCredential] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  function parseJwt(token) {
    // console.log(jwt_decode(token))
    return jwt_decode(token);
    // return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!credential && !pwd) return;

    setLoading(true);

    const data = {
      credential: credential,
      password: pwd,
    };
    try {
      const response = await axios.post("/auth/login", data, {
        "Content-Type": "application/json",
      });
      console.log(response);
      var payload = parseJwt(response.data.access_token);

      if (payload.role_id == 1) {
        // setCookie("token", response.data.access_token, {
        //   maxAge: 60 * 60 * 12,
        // });
        SetCookieChunk("token_", response.data.access_token)
        // setCredential("");
        // setPwd("");
        router.push("/admin");
      } else {
        router.push("/auth/login");
      }
      // setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setLoginError("Login failed");
      // if (e.response?.status == 403) {
      //   router.push(
      //     {
      //       pathname: "/auth/verify",
      //       query: { email: credential },
      //     },
      //     "/auth/verify"
      //   );
      // }
    }
  }

  return (
    <>
      <AuthLayout title={"APDOC | Login Admin"}>
        <div className="container mx-auto px-4 h-[60vh]">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-white lowercase tracking-wider text-4xl mt-4 font-bold fredoka">
                      APDOC <br /><small className="uppercase tracking-widest text-zinc-500 text-2xl">administrator</small>
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block text-zinc-500 text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Username
                      </label>
                      <input
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        type="text"
                        name="email"
                        className="input w-full"
                        id="credential"
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block text-zinc-500 text-xs font-bold mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        type={showPwd ? "text" : "password"}
                        className="input w-full"
                        id="password"
                      />
                      <div
                        onClick={() => setShowPwd((prev) => !prev)}
                        className="flex justify-center items-center absolute top-8 right-2 h-8 w-8"
                      >
                        <i
                          className={`${
                            !showPwd ? "fa-regular fa-eye-slash" : "fas fa-eye"
                          } opacity-40 hover:opacity-60 transition-all duration-300 text-rose-600`}
                        ></i>
                      </div>
                      <label className="block text-rose-500 text-xs mb-2 mt-2">
                        {loginError}
                      </label>
                    </div>
                    <div className="">
                      {/* <Link
                        href="/auth/forgotPassword"
                        className="text-slate-500"
                      >
                        <small className="text-zinc-500 font-bold text-xs">
                          Forgot password?
                        </small>
                      </Link> */}
                    </div>

                    <div className="text-center mt-6">
                      {loading ? (
                        <div
                          className="cursor-progress bg-zinc-700 text-white text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear"
                          disabled
                        >
                          Loading ...
                        </div>
                      ) : (
                        <button
                          className="bg-rose-600 text-white active:bg-rose-700 text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          onClick={handleLogin}
                        >
                          Login As Administrator
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex flex-wrap justify-center mt-6 relative">
                <div className="">
                  <Link
                    href="/"
                    // onClick={(e) => e.preventDefault()}
                    className="text-gray-400"
                  >
                    <small>
                      <i className="fas fa-arrow-left mr-2"></i> Back to landing
                      page
                    </small>
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
