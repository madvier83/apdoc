import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import Router, { useRouter } from "next/router";
import axios from "../api/axios";

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";

export default function Verify() {
  const router = useRouter();
  const [userdata, setUserdata] = useState(router.query);

  useEffect(() => {
    if (!userdata?.email) {
      router.push("/auth/login");
    }
  }, []);

  const otp_Ref = useRef();

  const [sent, setSent] = useState(false);
  // const [otp, setOtp] = useState({});
  const [otpError, setOtpError] = useState("");

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
    });
  }

  const [verifyForm, setVerifyForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVerifyForm
  );
  const [verifyFormError, setVerifyFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVerifyForm
  );

  async function getOTP(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "auth/send/otp",
        { email: userdata.email, phone: verifyForm.phone },
        {
          "Content-Type": "application/json",
        }
      );
      // console.log(response.data.data);
      // setOtp(response.data.data);
      setSent(true);
      resetOTP()
      document.querySelector(`input[name=otp_1]`).focus();
    } catch (err) {
      console.error(err);
    }
  }

  async function verifyOTP(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "auth/phone/verification",
        { email: userdata.email, otp_verification: combineOtp() },
        {
          "Content-Type": "application/json",
        }
      );
      router.push("/auth/login");
    } catch (err) {
      setOtpError(err.response?.data?.message);
      resetOTP()
      document.querySelector(`input[name=otp_1]`).focus();
    }
  }

  function combineOtp() {
    const fullOTP =
      "" +
      verifyForm.otp_1 +
      verifyForm.otp_2 +
      verifyForm.otp_3 +
      verifyForm.otp_4 +
      verifyForm.otp_5 +
      verifyForm.otp_6;
    return fullOTP;
  }

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

  const [timer, setTimer] = useState(60);
  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  );

  return (
    <>
      <AuthLayout title={"APDOC | Verify"}>
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
                  {!sent ? (
                    <form onSubmit={getOTP}>
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
                          required
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
                    <form onSubmit={verifyOTP}>
                      <div className="flex flex-col justify-center text-white">
                        <h3>OTP Sent to {verifyForm.phone}</h3>
                        <small
                          className="text-zinc-500 cursor-pointer"
                          onClick={() => {
                            setSent(false);
                          }}
                        >
                          Change number
                        </small>
                        <small
                          className="text-zinc-500 cursor-pointer"
                          onClick={getOTP}
                        >
                          Resend OTP
                        </small>
                      </div>
                      <div className="relative w-full mb-3 mt-3">
                        <label className="block text-zinc-300 text-xs font-bold mb-2"></label>
                        <div ref={otp_Ref} className="flex gap-2">
                          <input
                            name="otp_1"
                            value={verifyForm.otp_1}
                            onChange={(e) => handleVerifyInput(e)}
                            type="text"
                            maxLength={1}
                            autoFocus
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
                            className={`input font-bold w-full text-center px-0 ${
                              verifyFormError.otp_6 ? "border-rose-500" : null
                            }`}
                          />
                        </div>
                      </div>

                      <label className="block text-rose-500 text-xs mb-2 mt-2">
                        {otpError}
                      </label>

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
              <div className="flex flex-wrap mt-6 relative justify-center"></div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
