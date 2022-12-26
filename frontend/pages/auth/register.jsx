import React, { useState, useEffect, useRef } from "react";
import Router, {useRouter} from 'next/router'
import axios from "../api/axios";

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";

export default function Register() {
  const toLoginRef = useRef();
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const [pwd, setPwd] = useState("")
  const [pwdError, setPwdError] = useState("")

  const [matchPwd, setMatchPwd] = useState("")
  const [matchPwdError, setMatchPwdError] = useState("")

  useEffect(() => {

  }, [])

  async function handleRegister(e) {
    e.preventDefault();
    if(pwd !== matchPwd) {
      setMatchPwdError("Password doesn't match")
      console.log(matchPwdError)
      setPwd("")
      setMatchPwd("")
    };
    
    setMatchPwdError("")
    
    const data = {
      email: email,
      password: pwd,
    };

    try {
      const response = await axios.post("/auth/register", data, {
        "Content-Type": "application/json",
      });
      setEmail("");
      setPwd("");
      router.push('/auth/login')
    } catch (e) {
      // console.error(e.response.data);
      e.response.data.email ? setEmailError(e.response.data.email[0]) : setEmailError("")
      e.response.data.password ? setPwdError(e.response.data.password[0]) : setPwdError("")
    }
  }

  return (
    <>
      <AuthLayout title={"APPDOC | Register"}>
        <div className="container mx-auto px-4 h-[60vh]">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 -lg rounded-lg bg-blueGray-200 border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-emerald-400 text-4xl mt-4 font-bold">
                      APPDOC
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>
                    
                  {/* <div className="relative w-full mb-3">
                      <label
                        className="block text-blueGray-600 text-xs font-bold mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="input w-full"
                        placeholder="John Doe"
                      />
                    </div> */}

                    <div className="relative w-full mb-3">
                      <label
                        className="block text-blueGray-600 text-xs font-bold mb-2"
                      >
                        Email
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className={`input w-full ${pwdError ? "border-rose-500" : null}`}
                        placeholder="example@mail.com"
                      />
                      <label
                        className="block text-rose-500 text-xs mb-2 mt-2"
                      >
                        {emailError}
                      </label>
                    </div>
                    
                    {/* <div className="relative w-full mb-3">
                      <label
                        className="block text-blueGray-600 text-xs font-bold mb-2"
                      >
                        Phone
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="text"
                        className="input w-full"
                        placeholder="+62 xxx xxxx xxxx"
                      />
                    </div> */}

                    <div className="relative w-full mb-3">
                      <label
                        className="block text-blueGray-600 text-xs font-bold mb-2"
                      >
                        Password
                      </label>
                      <input
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        type="password"
                        className={`input w-full ${pwdError ? "border-rose-500" : null}`}
                        placeholder="min 8 characters"
                      />
                      <label
                        className="block text-rose-500 text-xs mb-2 mt-2"
                      >
                        {pwdError}
                      </label>
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block text-blueGray-600 text-xs font-bold mb-2"
                      >
                        Confirm Password
                      </label>
                      <input
                        value={matchPwd}
                        onChange={(e) => setMatchPwd(e.target.value)}
                        type="password"
                        className={`input w-full ${matchPwdError ? "border-rose-500" : null}`}
                        placeholder="min 8 characters"
                      />
                      <label
                        className="block text-rose-500 text-xs mb-2 mt-2"
                      >
                        {matchPwdError}
                      </label>
                    </div>

                    <div className="text-center mt-8">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded hover outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
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
                      <span className="text-cyan-200">Login</span>
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
