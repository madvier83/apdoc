import { deleteCookie, getCookie } from "cookies-next";
import React, { useEffect, useReducer, useRef, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import ModalBox from "../components/Modals/ModalBox";
import axios from "./api/axios";

export default function Account() {
  const userFormRef = useRef();

  const [isEditUser, setIsEditUser] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendEmailLoading, setSendEmailLoading] = useState(false);

  const [clinics, setClinics] = useState();
  const [clinicsLoading, setClinicsLoading] = useState();

  const token = getCookie("token");
  function parseJwt() {
    return JSON.parse(Buffer?.from(token?.split(".")[1], "base64").toString());
  }

  const [userData, setUserData] = useState();
  const [user, setUser] = useState();
  // console.log(userData)
  const initialUserForm = {
    id: "",
    name: "",
    email: "",
    phone: "",
  };
  const initialClinicForm = {
    id: "",
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
    province: "",
    postal_code: "",
  };
  const [userForm, setUserForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialUserForm
  );
  const [putClinicForm, setPutClinicForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialClinicForm
  );
  const [putClinicFormError, setPutClinicFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialClinicForm
  );

  const handleUserForm = (event) => {
    const { name, value } = event.target;
    setUserForm({ [name]: value });
  };
  const handlePutClinicForm = (event) => {
    const { name, value } = event.target;
    setPutClinicForm({ [name]: value });
  };

  async function getUser() {
    try {
      let user = parseJwt();
      const response = await axios.get(`/user/${user?.id}`, {
        "Content-Type": "application/json",
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      console.log(response);
      setUser(response.data);
      setUserForm(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getClinics() {
    let user = parseJwt();
    setClinicsLoading(true);
    try {
      const response = await axios.get(`/clinic/${user.apdoc_id}/apdoc`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setClinics(response.data);
      setClinicsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getUser();
    getClinics();
    setUserData(parseJwt());
  }, []);

  console.log(userData);
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
  console.log(clinics);

  return (
    <>
      <DashboardLayout title="Account" headerStats={false}>
        <div className="flex flex-wrap mt-6">
          <div className="w-full mt-1">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 bg-gray-900 rounded-md border-0">
              {/* Personal detail form */}
              <form onSubmit={(e) => updateUser(e)}>
                <div className="rounded-md bg-gray-900 text-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between border-b-gray-700 border-dotted border-b-2 pb-4">
                    <h6 className=" text-xl font-bold">Personal Details</h6>
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
                <div className="flex-auto px-4 pb-8 pt-0">
                  <div className="flex flex-wrap">
                    <div className="flex gap-8 w-full px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="uppercase text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
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

                      <div className="w-full">
                        <div className="relative w-full mb-3">
                          <label
                            className="uppercase text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
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

                        <div className="relative w-full">
                          <label
                            className="uppercase text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
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
                </div>
              </form>
            </div>
          </div>

          <div className="w-full mt-1 mb-16">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 bg-gray-900 rounded-md border-0">
              {/* Personal detail form */}
              <div className="rounded-md bg-gray-900 text-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between border-b-gray-700 border-dotted border-b-2 pb-4">
                  <h6 className=" text-xl font-bold">Clinics</h6>
                  <div className="flex">
                    <div
                      className={` text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 cursor-pointer`}
                    ></div>
                    <button
                      className={`bg-indigo-500 active:bg-indigo-400 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
                    >
                      Add Clinic
                      <i className={`fas fa-plus ml-2`}></i>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-8 mb-4">
                  {clinics?.map((obj) => {
                    return (
                      <div className="card text-black bg-base-100 rounded-md w-full">
                        <div className="card-body">
                          <h2 className="card-title">
                            <i className="fas fa-house-chimney-medical"></i>{" "}
                            {obj.name}
                            <div className="badge badge-success bg-emerald-300 text-emerald-800 text-xs px-4 font-bold norma flex">
                              Active <i className="fas fa-check ml-1"></i>
                            </div>
                          </h2>
                          <p className="mt-2">
                            {obj.address || "-"}, {obj.district || "-"},{" "}
                            {obj.city || "-"}, {obj.province || "-"},{" "}
                            {obj.postal_code || "-"}.
                          </p>
                          <p>
                            {obj.phone || "-"}
                            <a
                              href={`https://wa.me/${obj.phone?.replace(
                                /\D/g,
                                ""
                              )}`}
                              target="_blank"
                              className={""}
                            >
                              <i className="fa-brands fa-whatsapp text-emerald-500 mr-1 ml-1"></i>{" "}
                            </a>
                          </p>
                          <div className="card-actions justify-end">
                            <label
                              onClick={() => setPutClinicForm(obj)}
                              htmlFor="updateClinicModal"
                              className="btn btn-xs bg-emerald-400 border-none text-white"
                            >
                              Update
                            </label>
                            <div className="btn btn-xs bg-rose-400 border-none text-white">
                              Delete
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalBox id="updateClinicModal">
          <h3 className="font-bold text-lg mb-4">Update Clinic</h3>
          <form onSubmit={() => {}} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={putClinicForm.name}
                onChange={(e) => handlePutClinicForm(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putClinicFormError.name && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putClinicFormError.name}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="text"
                name="phone"
                value={putClinicForm.phone}
                onChange={(e) => handlePutClinicForm(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putClinicFormError.phone && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putClinicFormError.phone}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="updateClinicModal"
                // ref={addModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-success bg-emerald-400 rounded-md">
                Update
              </button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
