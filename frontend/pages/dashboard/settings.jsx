import { deleteCookie, getCookie } from "cookies-next";
import React, { useEffect, useReducer, useRef, useState } from "react";
import jwt_decode from "jwt-decode";

import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import axios from "../api/axios";
import moment from "moment";
import numeral, { Numeral } from "numeral";

export default function Settings() {
  const userFormRef = useRef();
  const [isEditUser, setIsEditUser] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendEmailLoading, setSendEmailLoading] = useState(false);

  const token = getCookie("token");
  const [loginUser, setLoginUser] = useState(decodeUser);
  const [user, setUser] = useState();
  // console.log(loginUser)
  const initialUserForm = {
    name: "",
    email: "",
    phone: "",
  };
  const [userForm, setUserForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialUserForm
  );

  const handleUserForm = (event) => {
    const { name, value } = event.target;
    setUserForm({ [name]: value });
  };

  async function getUser() {
    try {
      const response = await axios.get(`/user/${loginUser?.id}`, {
        "Content-Type": "application/json",
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setUser(response.data);
      setUserForm(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  function decodeUser() {
    try {
      const payload = jwt_decode(token);
      // console.log(payload);
      return payload;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  async function updateUser(e) {
    e.preventDefault();
    try {
      const response = await axios.put(`user/${user.id}`, userForm, {
        "Content-Type": "application/json",
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      // console.log(response);
      setIsEditUser(false);
      getUser();
    } catch (err) {
      console.error(err);
    }
  }

  async function sendVerifyEmail() {
    setEmailSent(true);
    setSendEmailLoading(true);
    try {
      const response = await axios.post(
        "auth/send/email",
        { email: user.email },
        {
          "Content-Type": "application/json",
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
      setEmailSent(false);
    }
    setSendEmailLoading(false);
  }
  return (
    <>
      <DashboardLayout title="Settings" headerStats={false}>
        <div className="flex flex-row mt-6 gap-4">
          <div className="w-full lg:w-8/12 mt-1">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
              {/* Personal detail form */}
              <form onSubmit={(e) => updateUser(e)}>
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      Recipient Setting
                    </h6>
                    <div className="flex">
                      <div
                        className={`${
                          isEditUser
                            ? "bg-rose-500 active:bg-rose-400"
                            : "bg-indigo-500 active:bg-indigo-400"
                        } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 cursor-pointer`}
                        onClick={() => {
                          setIsEditUser((prev) => {
                            return !prev;
                          });
                          setTimeout(() => userFormRef.current.focus(), 10);
                          getUser();
                          // console.log(userForm);
                        }}
                      >
                        {isEditUser ? "Cancel" : "Edit"}{" "}
                        <i
                          className={`fas ${
                            isEditUser ? "fa-x" : "fa-edit"
                          } ml-2`}
                        ></i>
                      </div>
                      {isEditUser ? (
                        <button
                          className={`bg-emerald-500 active:bg-emerald-400 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
                        >
                          Save
                          <i className={`fas fa-save ml-2`}></i>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>
                    <div className="flex flex-wrap">
                      <div className="w-full px-4 mt-8">
                        <div className="relative w-full mb-3">
                          <label
                            className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                            htmlFor="grid-password"
                          >
                            <span>Logo</span>
                          </label>
                          <input
                            type="file"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          />
                        </div>
                        <hr className="mt-6 border-b-1 border-blueGray-300 py-4" />
                        <div className="relative w-full mb-3">
                          <label
                            className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                            htmlFor="grid-password"
                          >
                            <span>Clinic Name</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              value={userForm.email}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="relative w-full mb-3">
                          <label
                            className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                            htmlFor="grid-password"
                          >
                            <span>Phone Number</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              value={userForm.phone}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300 py-4" />

                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            City
                          </label>
                          <input
                            type="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue="New York"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue="United States"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Postal Code
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue="123456"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </form>
            </div>
          </div>

          <div className=" font-mono relative flex flex-col min-w-0 break-words bg-white mb-6 shadow-xl rounded-md mt-1 w-full max-w-sm">
            <div className="p-6">
              <div className="flex justify-center items-center flex-col">
                <div className="w-full bg-slate-100 h-14 flex items-center justify-center border-slate-400 text-slate-500 animate-pulse border rounded-md border-dashed">LOGO</div>
                <div className="font-bold text-xl mt-5">Clinic Name</div>
                <div className="text-xs text-center mt-2">
                  Kab. Bandung, Jawa Barat, Desa Bojong Kunci, Kec. Pameungpeuk 44004
                </div>
                <div className="text-xs mt-2"><i className="fa-brands fa-whatsapp mr-2"></i>+62 0812 3455 6788</div>
                <div className="border-t w-full border-dashed my-5 border-t-slate-500"></div>
                <div className="flex w-full justify-between items-center">
                    <small>{moment().format('MMMM Do YYYY')}</small>
                    <small>{moment().format('h:mm:ss A')}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Receipt Number</small>
                    <small>APDOC0216230001</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Customer</small>
                    <small>Ihsan</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Served by</small>
                    <small>John Doe</small>
                </div>
                <div className="border-t w-full border-dashed my-5 border-t-slate-500"></div>
                <div className="flex w-full justify-between items-center">
                    <small>Service 001</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Service 002</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Item 001</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Item 002</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="border-t w-full border-dashed my-5 border-t-slate-500"></div>
                <div className="flex w-full justify-between items-center">
                    <small>Subtotal</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Gratuty test</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Tax test</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="border-t w-full border-dashed my-5 border-t-slate-500"></div>
                <div className="flex w-full justify-between items-center font-bold text-lg">
                    <small>Total</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Cash</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                    <small>Change</small>
                    <small>{numeral("990000").format("0,0")}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
