import React, { useState, useEffect, useRef, useReducer } from "react";
import Router, { useRouter } from "next/router";
import axios from "../../pages/api/axios";

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";

export default function VerifyForm() {
  const router = useRouter();
  const otp_Ref = useRef();

  const [sent, setSent] = useState(true);

  const initialVerifyForm = {
    phone: "",
    otp_1: "",
    otp_2: "",
    otp_3: "",
    otp_4: "",
    otp_5: "",
    otp_6: "",
  };

  function resetOTP() {
    setVerifyForm({
      otp_1: "",
      otp_2: "",
      otp_3: "",
      otp_4: "",
      otp_5: "",
      otp_6: "",
    })
  }

  const [verifyForm, setVerifyForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVerifyForm
  );
  const [verifyFormError, setVerifyFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVerifyForm
  );

  const handleVerifyInput = (event) => {
    const { maxLength, value, name } = event.target;
    setVerifyForm({ [name]: value });

    const [fieldName, fieldIndex] = name.split("_");
  
    let fieldIntIndex = parseInt(fieldIndex, 10);
  
    // Check if no of char in field == maxlength
    if (value.length >= maxLength) {
  
      // It should not be last input field
      if (fieldIntIndex < 6) {
  
        // Get the next input field using it's name
        const nextfield = document.querySelector(
          `input[name=otp_${fieldIntIndex + 1}]`
        );
  
        // If found, focus the next field
        if (nextfield !== null) {
          nextfield.focus();
        }
      }
    }
  };

  async function sendOTP(e) {
    e.preventDefault();
    resetOTP();
    setSent(true);
  }


  return (
    <>
      <AuthLayout title={"APPDOC | Verify"}>
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
                  {!sent ? (
                    <form onSubmit={(e) => sendOTP(e)}>
                      <div className="flex flex-col justify-center text-white mb-2">
                        <h3>Verify Phone Number</h3>
                      </div>
                      <div className="relative w-full mb-3">
                        <label className="block text-zinc-500 text-xs font-bold mb-2">
                          Phone
                        </label>
                        <input
                          name="phone"
                          value={verifyForm.phone}
                          onChange={(e) => handleVerifyInput(e)}
                          type="text"
                          className={`input w-full ${
                            verifyFormError.phone[0] ? "border-rose-500" : null
                          }`}
                          placeholder="+62 xxx xxxx xxxx"
                        />
                        <label className="block text-rose-500 text-xs mb-2 mt-2">
                          {verifyFormError.phone}
                        </label>
                      </div>

                      <div className="text-center mt-4">
                        <button className="bg-zinc-700 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded hover outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150">
                          Send OTP
                        </button>
                        {/* <a href="https://api.whatsapp.com/send?phone=082376932445&text=Hi">Send Message</a> */}
                      </div>
                    </form>
                  ) : (
                    <form>
                      <div className="flex flex-col justify-center text-white">
                        <h3>OTP Sent to {verifyForm.phone}</h3>
                        <small className="text-zinc-500 cursor-pointer" onClick={() => {setSent(false)}}>Change number</small>
                      </div>
                      <div className="relative w-full mb-3 mt-3">
                        <label className="block text-zinc-300 text-xs font-bold mb-2">
                          
                        </label>
                        <div ref={otp_Ref} className="otp_ flex gap-2">
                          <input
                            name="otp_1"
                            value={verifyForm.otp_1}
                            onChange={(e) => handleVerifyInput(e)}
                            type="text"
                            maxLength={1}
                            className={`input font-bold w-full text-center px-0 ${
                              verifyFormError.otp_1 ? "border-rose-500" : null
                            }`}
                          />
                          <input
                            name="otp_2"
                            value={verifyForm.otp_2}
                            onChange={(e) => handleVerifyInput(e)}
                            type="text"
                            maxLength={1}
                            className={`input font-bold w-full text-center px-0 ${
                              verifyFormError.otp_2 ? "border-rose-500" : null
                            }`}
                          />
                          <input
                            name="otp_3"
                            value={verifyForm.otp_3}
                            onChange={(e) => handleVerifyInput(e)}
                            type="text"
                            maxLength={1}
                            className={`input font-bold w-full text-center px-0 ${
                              verifyFormError.otp_3 ? "border-rose-500" : null
                            }`}
                          />
                          <input
                            name="otp_4"
                            value={verifyForm.otp_4}
                            onChange={(e) => handleVerifyInput(e)}
                            type="text"
                            maxLength={1}
                            className={`input font-bold w-full text-center px-0 ${
                              verifyFormError.otp_4 ? "border-rose-500" : null
                            }`}
                          />
                          <input
                            name="otp_5"
                            value={verifyForm.otp_5}
                            onChange={(e) => handleVerifyInput(e)}
                            type="text"
                            maxLength={1}
                            className={`input font-bold w-full text-center px-0 ${
                              verifyFormError.otp_5 ? "border-rose-500" : null
                            }`}
                          />
                          <input
                            name="otp_6"
                            value={verifyForm.otp_6}
                            onChange={(e) => handleVerifyInput(e)}
                            type="text"
                            maxLength={1}
                            className={`input font-bold w-full text-center px-0 ${
                              verifyFormError.otp_6 ? "border-rose-500" : null
                            }`}
                          />
                        </div>
                        <label className="block text-rose-500 text-xs mb-2 mt-2">
                          {verifyFormError.otp_}
                        </label>
                      </div>

                      <div className="text-center mt-4">
                        <button
                          className="bg-emerald-600 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded hover outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          onClick={() => {}}
                        >
                          Verify
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap mt-6 relative justify-center">
                <div className="text-right">
                  {/* <Link href="/auth/register"> */}
                  {/* <Link href="/auth/login" className="text-blueGray-200">
                    <small>
                      Already Have An Account?{" "}
                      <span className="text-emerald-200">Login</span>
                    </small>
                  </Link> */}
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
