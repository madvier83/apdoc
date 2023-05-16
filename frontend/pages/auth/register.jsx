import React, { useState, useEffect, useRef, useReducer } from "react";
import Router, { useRouter } from "next/router";
import axios from "../api/axios";

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";

export default function Register() {
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const initialRegisterForm = {
    email: "",
    // phone: "",
    password: "",
    matchPwd: "",
  };

  const [registerForm, setRegisterForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRegisterForm
  );
  const [registerFormError, setRegisterFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRegisterForm
  );

  const handleRegisterInput = (event) => {
    const { name, value } = event.target;
    setRegisterForm({ [name]: value });
  };

  async function handleRegister(e) {
    e.preventDefault();
    setRegisterLoading(true);

    if (registerForm.password !== registerForm.matchPwd) {
      setRegisterFormError({ matchPwd: "Password doesn't match" });
      setRegisterLoading(false);
      return;
    }
    setRegisterFormError({ matchPwd: "" });

    try {
      const response = await axios.post("auth/register", registerForm, {
        "Content-Type": "application/json",
      });
      router.push(
        {
          pathname: "/auth/registered",
          // query: { email: response.data.data.email },
        },
        "/auth/registered"
      );
    } catch (err) {
      console.log(err);
      setRegisterFormError(initialRegisterForm);
      setRegisterFormError(err.response?.data.errors);
      setRegisterLoading(false);
    }
  }

  useEffect(() => {
    if (registerForm.email == "") {
      setRegisterFormError({ email: [""] });
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(registerForm.email)
    ) {
      setRegisterFormError({ email: ["Invalid email address"] });
    } else {
      setRegisterFormError({ email: [""] });
    }
  }, [registerForm.email]);

  return (
    <>
      <AuthLayout title={"APDOC | Register"}>
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
                  <form>
                    <div className="relative w-full mb-3">
                      <label className="block text-zinc-500 text-xs font-bold mb-2">
                        Email
                      </label>
                      <input
                        name="email"
                        value={registerForm.email}
                        onChange={(e) => handleRegisterInput(e)}
                        type="email"
                        className={`input w-full ${
                          registerFormError.email[0] ? "border-rose-500" : null
                        }`}
                        required
                        placeholder="example@mail.com"
                      />
                      <label className="block text-rose-500 text-xs mb-2 mt-2">
                        {registerFormError.email[0]}
                      </label>
                    </div>
                    {/* 
                      <div className="relative w-full mb-3">
                        <label className="block text-zinc-500 text-xs font-bold mb-2">
                          Phone
                        </label>
                        <input
                          name="phone"
                          value={registerForm.phone}
                          onChange={(e) => handleRegisterInput(e)}
                          type="text"
                          className={`input w-full ${
                            registerFormError.phone[0]
                              ? "border-rose-500"
                              : null
                          }`}
                          placeholder="+62 xxx xxxx xxxx"
                        />
                        <label className="block text-rose-500 text-xs mb-2 mt-2">
                          {registerFormError.phone}
                        </label>
                      </div> */}

                    <div className="relative w-full mb-3">
                      <label className="block text-zinc-500 text-xs font-bold mb-2">
                        Password
                      </label>
                      <input
                        name="password"
                        value={registerForm.password}
                        onChange={(e) => handleRegisterInput(e)}
                        type={showPwd ? "text" : "password"}
                        className={`input w-full ${
                          registerFormError.password[0]
                            ? "border-rose-500"
                            : null
                        }`}
                        placeholder="min 8 characters"
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
                      <label className="block text-rose-500 text-xs mb-2 mt-2">
                        {registerFormError.password}
                      </label>
                    </div>

                    <div className="relative w-full mb-3">
                      <label className="block text-zinc-500 text-xs font-bold mb-2">
                        Confirm Password
                      </label>
                      <input
                        name="matchPwd"
                        value={registerForm.matchPwd}
                        onChange={(e) => handleRegisterInput(e)}
                        type="password"
                        className={`input w-full ${
                          registerFormError.matchPwd[0]
                            ? "border-rose-500"
                            : null
                        }`}
                        placeholder="min 8 characters"
                      />
                      <label className="block text-rose-500 text-xs mb-2 mt-2">
                        {registerFormError.matchPwd}
                      </label>
                    </div>

                    <div className="text-center mt-10">
                      {registerLoading ? (
                        <div
                          className="cursor-progress bg-zinc-700 text-white text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear"
                          disabled
                        >
                          Loading ...
                        </div>
                      ) : (
                        <button
                          className="bg-emerald-600 text-white active:bg-emerald-700 text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          onClick={handleRegister}
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex flex-wrap mt-6 relative justify-center">
                <div className="text-right">
                  {/* <Link href="/auth/register"> */}
                  <Link href="/auth/login" className="text-blueGray-200">
                    <small>
                      Already Have An Account?{" "}
                      <span className="text-emerald-200">Login</span>
                    </small>
                  </Link>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
