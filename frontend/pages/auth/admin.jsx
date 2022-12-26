import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import axios from "../api/axios";

import Link from "next/link";
import Head from "next/head";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email && !pwd) return;

    setLoading(true);

    const data = {
      email: email,
      password: pwd,
    };
    try {
      const response = await axios.post("/login", data, {
        "Content-Type": "application/json",
      });
      var payload = parseJwt(response.data.access_token);

      if (payload.role == "client") {
        setCookie("token", response.data.access_token, {
          maxAge: 60 * 60 * 12,
        });
        setEmail("");
        setPwd("");
        router.push("/admin");
      }
      setLoading(false);
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <>
      <Head>
        <title>{`APPDOC | Login Admin`}</title>
      </Head>
      <main>
        <section
          className={`relative w-full h-full py-40 min-h-screen bg-slate-900`}
        >
          <div
            className="absolute top-0 w-full h-full bg-no-repeat bg-full hidden md:block"
            // /login.svg
            style={{
              // backgroundImage: "url('/img/register_bg_2.png')",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="container mx-auto px-4 h-[60vh]">
            <div className="flex content-center items-center justify-center h-full">
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0">
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
                          className="block text-white text-xs font-bold mb-2"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="input w-full"
                          placeholder="Email"
                          id="email"
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block text-white text-xs font-bold mb-2"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <input
                          value={pwd}
                          onChange={(e) => setPwd(e.target.value)}
                          type="password"
                          className="input w-full"
                          placeholder="Password"
                          id="password"
                        />
                      </div>
                      <div className="">
                        <Link
                          href="/auth/forgotPassword"
                          className="text-slate-500"
                        >
                          {/* <small className="text-slate-400 font-bold text-xs">
                          Forgot password?
                        </small> */}
                        </Link>
                      </div>

                      <div className="text-center mt-6">
                        <button
                          className="bg-emerald-600 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          onClick={handleLogin}
                        >
                          Login As Administrator
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="flex flex-wrap mt-6 relative w-full">
                  <Link
                    href="/auth/login"
                    className="text-blueGray-200 mx-auto"
                  >
                    <small>
                      <i className="fas fa-arrow-left mr-2"></i> Login as user
                    </small>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <FooterSmall absolute /> */}
        </section>
      </main>
    </>
  );
}
