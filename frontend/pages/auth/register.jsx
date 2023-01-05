import React, { useState, useEffect, useRef, useReducer } from "react";
import Router, {useRouter} from 'next/router'
import axios from "../api/axios";

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";

export default function Register() {
  const router = useRouter()

  const initialRegisterForm = {
    email: "",
    phone: "",
    password: "",
    matchPwd: "",
  }

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
    console.log(registerForm)

    if(registerForm.password !== registerForm.matchPwd) {
      setRegisterFormError({matchPwd: "Password doesn't match"})
      return
    }
    setRegisterFormError({matchPwd: ""})

    try {
      const response = await axios.post("auth/register", registerForm, {
        "Content-Type": "application/json",
      });
      console.log(response)
      setRegisterForm(initialRegisterForm)
      router.push('/auth/verify')
    } catch (err) {
      setRegisterFormError(initialRegisterForm)
      setRegisterFormError(err.response?.data)
    }
  }

  return (
    <>
      <AuthLayout title={"APPDOC | Register"}>
        <div className="container mx-auto px-4 h-[60vh]">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 -lg rounded-lg border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-white text-4xl mt-4 font-bold">
                      APPDOC
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>

                    <div className="relative w-full mb-3">
                      <label
                        className="block text-zinc-500 text-xs font-bold mb-2"
                      >
                        Email
                      </label>
                      <input
                        name="email"
                        value={registerForm.email}
                        onChange={(e) => handleRegisterInput(e)}
                        type="email"
                        className={`input w-full ${registerFormError.email[0] ? "border-rose-500" : null}`}
                        placeholder="example@mail.com"
                      />
                      <label
                        className="block text-rose-500 text-xs mb-2 mt-2"
                      >
                        {registerFormError.email}
                      </label>
                    </div>
                    
                    <div className="relative w-full mb-3">
                      <label
                        className="block text-zinc-500 text-xs font-bold mb-2"
                      >
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={registerForm.phone}
                        onChange={(e) => handleRegisterInput(e)}
                        type="text"
                        className={`input w-full ${registerFormError.phone[0] ? "border-rose-500" : null}`}
                        placeholder="+62 xxx xxxx xxxx"
                      />
                      <label
                        className="block text-rose-500 text-xs mb-2 mt-2"
                      >
                        {registerFormError.phone}
                      </label>
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block text-zinc-500 text-xs font-bold mb-2"
                      >
                        Password
                      </label>
                      <input
                        name="password"
                        value={registerForm.password}
                        onChange={(e) => handleRegisterInput(e)}
                        type="password"
                        className={`input w-full ${registerFormError.password[0] ? "border-rose-500" : null}`}
                        placeholder="min 8 characters"
                      />
                      <label
                        className="block text-rose-500 text-xs mb-2 mt-2"
                      >
                        {registerFormError.password}
                      </label>
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block text-zinc-500 text-xs font-bold mb-2"
                      >
                        Confirm Password
                      </label>
                      <input
                        name="matchPwd"
                        value={registerForm.matchPwd}
                        onChange={(e) => handleRegisterInput(e)}
                        type="password"
                        className={`input w-full ${registerFormError.matchPwd[0] ? "border-rose-500" : null}`}
                        placeholder="min 8 characters"
                      />
                      <label
                        className="block text-rose-500 text-xs mb-2 mt-2"
                      >
                        {registerFormError.matchPwd}
                      </label>
                    </div>

                    <div className="text-center mt-10">
                      <button
                        className="bg-emerald-600 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded hover outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        onClick={handleRegister}
                      >
                        Register
                      </button>
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
