import React, { useState, useEffect } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Link from "next/link";
import axios from "../api/axios";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const router = useRouter();
  
  const [showPwd, setShowPwd] = useState(false);

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  async function changePassword(e) {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Invalid password reset token");
      return;
    }
    if (password != confirmPassword) {
      setError("Password doesn't match");
      return;
    }
    if (!password) {
      setError("Password required");
      return;
    }
    setIsLoading(true);
    try {
      const data = {
        token,
        email,
        password,
        confirmPassword,
      };
      const res = await axios.post("/auth/change-password", data);
      console.log(res);
      setIsDone(true);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!router.isReady) return;
    setEmail(router.query.email);
    setToken(router.query.token);
  }, [router.isReady]);
  return (
    <>
      <AuthLayout title={"APDOC | Change Password"}>
        <div className="container mx-auto px-4 h-[60vh]">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 -lg rounded-lg border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="fredoka lowercase tracking-wider text-white text-4xl mt-4 font-bold">
                      APDOC
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  {!isDone ? (
                    <form onSubmit={(e) => changePassword(e)}>
                      <div className="relative w-full mb-3">
                        <label
                          className="block text-zinc-500 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Kata sandi baru
                        </label>
                        <input
                          type={showPwd ? "text" : "password"}
                          name="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          required
                          className="input w-full"
                          placeholder=""
                        />
                        <div
                          onClick={() => setShowPwd((prev) => !prev)}
                          className="flex justify-center items-center absolute top-8 right-2 h-8 w-8"
                        >
                          <i
                            className={`${
                              !showPwd
                                ? "fa-regular fa-eye-slash"
                                : "fas fa-eye"
                            } opacity-40 hover:opacity-60 transition-all duration-300 text-emerald-600`}
                          ></i>
                        </div>
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block text-zinc-500 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Konfirmasi kata sandi
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                          }}
                          required
                          className="input w-full"
                          placeholder=""
                        />

                        <label className="block text-rose-500 text-xs mb-2 mt-2">
                          {error}
                        </label>
                      </div>
                      {/* <p className="text-sm text-rose-500 text-justify"><i class="fa-solid fa-triangle-exclamation"></i> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi quo aspernatur voluptatum itaque in ea!</p> */}

                      <div className="text-center mt-8">
                        {!isLoading ? (
                          <button
                            className="bg-emerald-600 text-white active:bg-emerald-700 active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded  hover:-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            onClick={changePassword}
                          >
                            Ubah Kata Sandi
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
                      {/* <div className="text-center mt-4">
                      <Link
                        href="/auth/login"
                        className=" text-white text-sm font-bold px-4 py-0 rounded w-full"
                      >
                        Cancel
                      </Link>
                    </div> */}
                    </form>
                  ) : (
                    <div
                      className="cursor-progress mx-autos text-white text-sm text-center"
                      type="button"
                      disabled
                    >
                      Kata sandi sudah di perbarui,
                      <Link href={"/auth/login"}>
                        <span className="text-emerald-200"> Masuk</span>
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
