import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import { gzip, ungzip } from "pako";
import { GetCookieChunk, SetCookieChunk } from "../../services/CookieChunk";

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";

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
      var payload = parseJwt(response.data.access_token);

      const token = response.data.access_token;

      SetCookieChunk("token_", token);

      // console.log(GetCookieChunk("token_"));

      // console.log(response.data.access_token)
      // Set the cookie with the compressed token
      // setCookie("token", compressedString, {
      //   maxAge: 60 * 60 * 12, // Set the desired max age of the cookie
      // });

      // window.sessionStorage.setItem("token", response.data.access_token);
      // setCredential("");
      // setPwd("");

      router.push("/dashboard");
      // if (payload.role_id >= 2) {
      // }
      // setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setLoginError(e.response?.data?.message || "Login failed");
    }
  }

  return (
    <>
      <AuthLayout title={"APDOC | Login"}>
        <div className="container mx-auto px-4 h-[60vh]">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="fredoka text-white text-4xl mt-4 font-bold">
                      APDOC
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
                        Email atau nomor telepon
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
                        Kata sandi
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
                          } opacity-40 hover:opacity-60 transition-all duration-300 text-emerald-600`}
                        ></i>
                      </div>
                      <label className="block capitalize text-rose-500 text-xs mb-2 mt-2">
                        {loginError}
                      </label>
                    </div>
                    <div className="">
                      <Link
                        href="/auth/forgotPassword"
                        className="text-slate-500"
                      >
                        <small className="text-zinc-500 font-bold text-xs">
                          Lupa kata sandi?
                        </small>
                      </Link>
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
                          className="bg-emerald-600 text-white active:bg-emerald-700 text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          onClick={handleLogin}
                        >
                          Masuk
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                  <Link
                    href="/"
                    // onClick={(e) => e.preventDefault()}
                    className="text-gray-400"
                  >
                    <small>
                      <i className="fas fa-arrow-left mr-2"></i>
                      Kembali ke halaman utama
                    </small>
                  </Link>
                </div>
                <div className="w-1/2 text-right">
                  <Link href="/auth/register" className="text-gray-400">
                    <small>
                      Buat akun baru{" "}
                      <i className="fas fa-arrow-right ml-2"></i>
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
