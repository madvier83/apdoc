import { deleteCookie, getCookie } from "cookies-next";
import React, { useEffect, useReducer, useRef, useState } from "react";
import jwt_decode from "jwt-decode";

import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import axios from "../api/axios";

export default function Account() {
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
      <DashboardLayout title="Account" headerStats={false}>
        <div className="flex flex-wrap mt-6">
          <div className="w-full lg:w-2/3 max-w-7xl mt-1">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 shadow-lg rounded-md bg-blueGray-100 border-0">
              {/* Personal detail form */}
              <form onSubmit={(e) => updateUser(e)}>
                <div className="rounded-t-md bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      Personal Details
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
                  <div className="flex flex-wrap">
                    <div className="w-full px-4 mt-6">
                      <div className="relative w-full mb-3">
                        <label
                          className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                          htmlFor="grid-password"
                        >
                          <span>Full Name </span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={userForm.name}
                            disabled={!isEditUser}
                            ref={userFormRef}
                            name="name"
                            onChange={(e) => handleUserForm(e)}
                            required
                          />
                        </div>
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                          htmlFor="grid-password"
                        >
                          <span>Email </span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 cursor-not-allowed"
                            value={userForm.email}
                            disabled
                          />
                          {!user?.email_verified_at ? (
                            emailSent ? (
                              sendEmailLoading ? (
                                <span className="absolute w-16 -top-[20%] h-16 right-8 ml-2 px-4 flex">
                                  {/* <p>Loading</p> */}
                                  <img
                                    src="/loading.svg"
                                    alt="now loading"
                                    className="absolute"
                                  />
                                </span>
                              ) : (
                                <span className="absolute top-[22%] opacity-70 right-2 text-sm font-bold bg-emerald-200 text-emerald-600 rounded ml-2 normal-case py-[2px] px-4 select-none">
                                  Verification Email Sent
                                </span>
                              )
                            ) : (
                              <span
                                onClick={sendVerifyEmail}
                                className="absolute top-[22%] right-2 text-sm font-bold bg-amber-300 text-amber-700 rounded ml-2 normal-case py-[2px] px-4 cursor-pointer"
                              >
                                Verify now{" "}
                                <i className="fas fa-arrow-right"></i>
                              </span>
                            )
                          ) : (
                            <span className="absolute top-[22%] right-2 text-sm font-bold bg-emerald-300 text-emerald-700 rounded ml-2 normal-case py-[2px] px-4 cursor-not-allowed select-none">
                              Verified <i className="fas fa-check"></i>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between"
                          htmlFor="grid-password"
                        >
                          <span>Phone </span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 cursor-not-allowed"
                            value={userForm.phone}
                            disabled
                          />
                          <span className="absolute top-[22%] right-2 text-sm font-bold bg-emerald-300 text-emerald-700 rounded ml-2 normal-case py-[2px] px-4 cursor-not-allowed select-none">
                            Verified <i className="fas fa-check"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* <div className="relative flex flex-col min-w-0 break-words w-full mb-4 shadow-lg rounded-md bg-blueGray-100 border-0">
              <div className="rounded-t-md bg-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <div className="flex">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      Clinic Info
                    </h6>
                    <div className="dropdown p-0 m-0">
                      <label
                        tabIndex={0}
                        className="text-blueGray-700 text-xl font-bold ml-1"
                      >
                        name 1 <i className="fas fa-caret-down ml-1"></i>
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content mt-2 ml-1 rounded-md menu p-2 shadow bg-base-100 w-52"
                      >
                        <li>
                          <a className="active:bg-indigo-500 rounded-md">
                            name 1
                          </a>
                        </li>
                        <li>
                          <a className="active:bg-indigo-500 rounded-md">
                            name 2
                          </a>
                        </li>
                        <li>
                          <label
                            className="btn btn-primary text-white bg-indigo-500 mt-2"
                            htmlFor="AddClinicModal"
                          >
                            Add Business <i className="fas fa-add"></i>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
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
                          <span>Business Name</span>
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

                  <hr className="mt-6 border-b-1 border-blueGray-300 py-4" />

                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          About
                        </label>
                        <textarea
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          rows="4"
                          defaultValue="A beautiful UI Kit and Admin for NextJS & Tailwind CSS. It is Free
                          disabled
                    and Open Source."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div> */}
          </div>
        </div>

        <ModalBox id="AddClinicModal">
          <h3 className="font-bold text-lg mb-4">Add Clinic</h3>
          <form onSubmit={() => {}} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full"></div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="AddClinicModal"
                // ref={addModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-primary rounded-md">Add</button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
