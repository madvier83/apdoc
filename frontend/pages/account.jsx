import { deleteCookie, getCookie } from "cookies-next";
import React, { useEffect, useReducer, useRef, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import ModalBox from "../components/Modals/ModalBox";
import axios from "./api/axios";
import ModalDelete from "../components/Modals/ModalDelete";

export default function Account() {
  const userFormRef = useRef();
  const addModalRef = useRef();
  const putModalRef = useRef();

  const [isEditUser, setIsEditUser] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendEmailLoading, setSendEmailLoading] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [codes, setCodes] = useState([]);

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
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    nik: "",
    address: "",
    birth_place: "",
    birth_date: "",
    gender: "",
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
  const [addClinicForm, setAddClinicForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialClinicForm
  );
  const [addClinicFormError, setAddClinicFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialClinicForm
  );

  const handleUserForm = (event) => {
    const { name, value } = event.target;
    setUserForm({ [name]: value });
  };
  const handleAddClinicForm = (event) => {
    const { name, value } = event.target;
    setAddClinicForm({ [name]: value });
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
      // console.log(response.data);
      let userData = {
        id: response.data.id,
        employee_id: response.data.employee_id,
        name: response.data.employee.name,
        email: response.data.email,
        email_verified_at: response.data.email_verified_at,
        phone: response.data.phone,
        phone_verified_at: response.data.phone_verified_at,
        nik: response.data.employee.nik,
        address: response.data.employee.address,
        birth_place: response.data.employee.birth_place,
        birth_date: response.data.employee.birth_date,
        gender: response.data.employee.gender,
      };
      setUser(userData);
      setUserForm(userData);
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
  async function addClinic(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`clinic`, addClinicForm, {
        "Content-Type": "application/json",
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      getClinics();
      addModalRef.current.click();
    } catch (err) {
      console.error(err);
      setAddClinicFormError(initialClinicForm);
      setAddClinicFormError(err.response.data);
    }
  }
  async function putClinic(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `clinic/${putClinicForm.id}`,
        putClinicForm,
        {
          "Content-Type": "application/json",
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      getClinics();
      putModalRef.current.click();
    } catch (err) {
      console.error(err);
      setPutClinicFormError(initialClinicForm);
      setPutClinicFormError(err.response.data);
    }
  }
  async function deleteClinic(id) {
    try {
      const response = await axios.delete(`clinic/${id}`, {
        "Content-Type": "application/json",
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      getClinics();
    } catch (err) {
      console.error(err);
      setAddClinicFormError(err);
    }
  }

  useEffect(() => {
    getUser();
    getClinics();
    setUserData(parseJwt());
  }, []);

  async function updateUser(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `employee/${user.employee_id}`,
        userForm,
        {
          "Content-Type": "application/json",
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      console.log(response);
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

  async function getProvinces() {
    try {
      const response = await axios.get(`location/provinces`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setProvinces(response.data?.data);
    } catch (e) {
      console.error(e);
    }
  }
  async function getCities(id) {
    try {
      const response = await axios.get(`location/province/cities/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCities(response.data?.data);
    } catch (e) {
      console.error(e);
    }
  }
  async function getDistricts(id) {
    try {
      const response = await axios.get(
        `location/province/city/districts/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setDistricts(response.data?.data);
    } catch (e) {
      console.error(e);
    }
  }
  async function getCodes(id) {
    try {
      const response = await axios.get(
        `location/province/city/district/villages/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCodes(response.data?.data);
    } catch (e) {
      console.error(e);
    }
  }

  const [verifyForm, setVerifyForm] = useState("");
  const [verifyFormError, setVerifyFormError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const otpRef = useRef();

  async function getOTP() {
    setOtpLoading(true);
    const data = {
      email: user?.email,
      phone: user?.phone?.replace(/\D/g, ""),
    };
    console.log(data);
    try {
      const response = await axios.post("auth/send/otp", data, {
        "Content-Type": "application/json",
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setOtpLoading(false);
      setOtpSent(true);
      setVerifyFormError({});
      // console.log(response);
    } catch (err) {
      console.error(err);
      setVerifyFormError("");
      setVerifyFormError(err.response?.data);
      setOtpLoading(false);
    }
  }

  async function verifyPhone(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "auth/phone/verification",
        { email: user?.email, otp_verification: verifyForm, phone: user.phone },
        {
          "Content-Type": "application/json",
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      getUser();
      otpRef.current.click();
    } catch (err) {
      console.error(err);
      setVerifyFormError({ otp: err.response?.data?.message });
    }
  }

  // console.log(provinces)
  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (!addClinicForm.province) {
        setCities([]);
        return;
      }
      setAddClinicForm({ city: "", districts: "", postal_code: "" });
      setCities([]);
      setDistricts([]);
      setCodes([]);
      getCities(addClinicForm.province);
    }, 500);
    return () => clearTimeout(getData);
  }, [addClinicForm.province]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (!addClinicForm.city) {
        setDistricts([]);
        return;
      }
      setAddClinicForm({ districts: "", postal_code: "" });
      setDistricts([]);
      setCodes([]);
      getDistricts(addClinicForm.city);
    }, 500);
    return () => clearTimeout(getData);
  }, [addClinicForm.city]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (!addClinicForm.district) {
        setCodes([]);
        return;
      }
      setAddClinicForm({ postal_code: "" });
      setCodes([]);
      getCodes(addClinicForm.district);
    }, 500);
    return () => clearTimeout(getData);
  }, [addClinicForm.district]);

  useEffect(() => {
    if (isGetUpdateAddress) {
      return;
    }
    const getData = setTimeout(() => {
      if (!putClinicForm.province) {
        setCities([]);
        return;
      }
      setPutClinicForm({ city: "", districts: "", postal_code: "" });
      setCities([]);
      setDistricts([]);
      setCodes([]);
      getCities(putClinicForm.province);
    }, 500);
    return () => clearTimeout(getData);
  }, [putClinicForm.province]);

  useEffect(() => {
    if (isGetUpdateAddress) {
      return;
    }
    const getData = setTimeout(() => {
      if (!putClinicForm.city) {
        setDistricts([]);
        return;
      }
      setPutClinicForm({ districts: "", postal_code: "" });
      setDistricts([]);
      setCodes([]);
      getDistricts(putClinicForm.city);
    }, 500);
    return () => clearTimeout(getData);
  }, [putClinicForm.city]);

  useEffect(() => {
    if (isGetUpdateAddress) {
      return;
    }
    const getData = setTimeout(() => {
      if (!putClinicForm.district) {
        setCodes([]);
        return;
      }
      setCodes([]);
      setPutClinicForm({ postal_code: "" });
      getCodes(putClinicForm.district);
    }, 500);
    return () => clearTimeout(getData);
  }, [putClinicForm.district]);

  const [isGetUpdateAddress, setIsGetUpdateAddress] = useState(false);
  async function getUpdateAddress(obj) {
    setIsGetUpdateAddress(true);
    await getCities(obj.province);
    await getDistricts(obj.city);
    await getCodes(obj.district);
    setIsGetUpdateAddress(false);
  }

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     Object.keys(provinces).map((keyName, i) => {
  //       if (provinces[keyName] === putClinicForm.province) {
  //         getCities(keyName);
  //         setPutClinicForm((prev) => {
  //           city: prev.city;
  //         });
  //       }
  //     });
  //     setPutClinicForm({ postal_code: "", district: "", city: "" });
  //     setDistricts({});
  //     setCodes({});
  //   }, 500);
  //   return () => clearTimeout(getData);
  // }, [putClinicForm.province]);

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     Object.keys(cities).map((keyName, i) => {
  //       if (cities[keyName] === putClinicForm.city) {
  //         getDistricts(keyName);
  //         setPutClinicForm((prev) => {
  //           district: "";
  //         });
  //       }
  //     });
  //     setPutClinicForm({ postal_code: "", district: "" });
  //     setCodes({});
  //   }, 500);
  //   return () => clearTimeout(getData);
  // }, [putClinicForm.city]);

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     Object.keys(districts).map((keyName, i) => {
  //       if (districts[keyName] === putClinicForm.district) {
  //         getCodes(keyName);
  //       }
  //     });
  //     setPutClinicForm({ postal_code: "" });
  //   }, 500);
  //   return () => clearTimeout(getData);
  // }, [putClinicForm.district]);

  console.log(codes);
  return (
    <>
      <DashboardLayout title="Account">
        <div className="flex flex-wrap mt-6">
          <div className="w-full mt-1">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 bg-gray-900 rounded-md border-0">
              {/* Personal detail form */}
              <form onSubmit={(e) => updateUser(e)}>
                <div className="rounded-md bg-gray-900 text-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between border-b-gray-700 border-dotted border-b-2 pb-4">
                    <h6 className=" text-xl font-bold">Personal Information</h6>
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
                <div
                  className={`flex-auto px-4 pt-0 ${
                    !isEditUser ? "pb-8" : "pb-16"
                  } transition-all`}
                >
                  <div className="flex flex-wrap">
                    <div className="flex gap-8 w-full px-4">
                      <div className="w-full">
                        <div className="relative w-full mb-3">
                          <label
                            className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
                            htmlFor="grid-password"
                          >
                            <span>NIK</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className={`${
                                isEditUser ? "bg-white" : "bg-zinc-100"
                              } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                `}
                              value={userForm.nik || ""}
                              disabled={!isEditUser}
                              name="nik"
                              onChange={(e) => handleUserForm(e)}
                              required
                            />
                          </div>
                        </div>
                        <div className="relative w-full mb-3">
                          <label
                            className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
                            htmlFor="grid-password"
                          >
                            <span>Full Name </span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className={`${
                                isEditUser ? "bg-white" : "bg-zinc-100"
                              } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                `}
                              value={userForm.name || ""}
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
                            className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
                            htmlFor="grid-password"
                          >
                            <span>Address</span>
                          </label>
                          <div className="relative">
                            <textarea
                              type="text"
                              className={`${
                                isEditUser ? "bg-white" : "bg-zinc-100"
                              } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                `}
                              value={userForm.address || ""}
                              disabled={!isEditUser}
                              name="address"
                              onChange={(e) => handleUserForm(e)}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="relative w-full mb-3">
                            <label
                              className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
                              htmlFor="grid-password"
                            >
                              <span>Birth place</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                className={`${
                                  isEditUser ? "bg-white" : "bg-zinc-100"
                                } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150`}
                                value={userForm.birth_place || ""}
                                disabled={!isEditUser}
                                name="birth_place"
                                onChange={(e) => handleUserForm(e)}
                                required
                              />
                            </div>
                          </div>
                          <div className="relative w-full mb-3">
                            <label
                              className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
                              htmlFor="grid-password"
                            >
                              <span>Birth date</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                className={`${
                                  isEditUser ? "bg-white" : "bg-zinc-100"
                                } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150`}
                                value={userForm.birth_date || ""}
                                disabled={!isEditUser}
                                name="birth_date"
                                onChange={(e) => handleUserForm(e)}
                                required
                              />
                            </div>
                          </div>
                          <div className="relative w-full mb-3">
                            <label
                              className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
                              htmlFor="grid-password"
                            >
                              <span>Gender</span>
                            </label>
                            <div className="relative">
                              <select
                                type="text"
                                className={`${
                                  isEditUser ? "bg-white" : "bg-zinc-100"
                                } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150`}
                                value={userForm.gender || ""}
                                disabled={!isEditUser}
                                name="gender"
                                onChange={(e) => handleUserForm(e)}
                                required
                              >
                                <option>Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full">
                        <div className="relative w-full mb-3">
                          <label
                            className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
                            htmlFor="grid-password"
                          >
                            <span>Email </span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className={`${
                                isEditUser ? "bg-white" : "bg-zinc-100"
                              } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 cursor-not-allowed`}
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
                            className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between"
                            htmlFor="grid-password"
                          >
                            <span>Phone </span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className={`${
                                isEditUser ? "bg-white" : "bg-zinc-100"
                              } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 cursor-not-allowed`}
                              value={userForm.phone}
                              disabled
                            />
                            {!user?.phone_verified_at ? (
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
                                <label
                                  htmlFor="verifyPhoneModal"
                                  className="absolute top-[22%] right-2 text-sm font-bold bg-amber-300 text-amber-700 rounded ml-2 normal-case py-[2px] px-4 cursor-pointer"
                                >
                                  Verify now{" "}
                                  <i className="fas fa-arrow-right"></i>
                                </label>
                              )
                            ) : (
                              <span className="absolute top-[22%] right-2 text-sm font-bold bg-emerald-300 text-emerald-700 rounded ml-2 normal-case py-[2px] px-4 cursor-not-allowed select-none">
                                Verified <i className="fas fa-check"></i>
                              </span>
                            )}
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
                    <label
                      htmlFor="addClinic"
                      onClick={() => {
                        setCities([]);
                        setDistricts([]);
                        setCodes([]);
                      }}
                      className={`bg-indigo-500 active:bg-indigo-400 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
                    >
                      Add Clinic
                      <i className={`fas fa-plus ml-2`}></i>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-8 px-2 mb-4">
                  {clinics?.map((obj) => {
                    return (
                      <div
                        key={obj.id}
                        className="card text-black bg-base-100 rounded-md w-full"
                      >
                        <div className="card-body">
                          <h2 className="card-title">
                            <i className="fas fa-house-chimney-medical"></i>{" "}
                            {obj.name}
                            {obj.status == "active" ? (
                              <span className="text-sm font-bold bg-emerald-300 text-emerald-700 rounded ml-2 normal-case py-[2px] px-4 cursor-not-allowed select-none">
                                Active <i className="fas fa-check"></i>
                              </span>
                            ) : (
                              <span className="text-sm font-bold bg-rose-300 text-rose-700 rounded ml-2 normal-case py-[2px] px-4 cursor-not-allowed select-none">
                                Pending request{" "}
                                <i className="fas fa-gear ml-1"></i>
                              </span>
                            )}
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
                              onClick={() => {
                                setPutClinicForm(obj);
                                getUpdateAddress(obj);
                              }}
                              htmlFor="updateClinicModal"
                              className="btn btn-xs bg-emerald-400 border-none text-white"
                            >
                              Update
                            </label>
                            <label
                              htmlFor={`clinic_${obj.id}`}
                              className="btn btn-xs bg-rose-400 border-none text-white"
                            >
                              Delete
                            </label>
                            <ModalDelete
                              id={`clinic_${obj.id}`}
                              callback={() => deleteClinic(obj.id)}
                              title={`Delete clinic ${obj.name}?`}
                            ></ModalDelete>
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

        <ModalBox id="addClinic">
          <h3 className="font-bold text-lg mb-4">Add Clinic</h3>
          <form onSubmit={addClinic} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={addClinicForm.name}
                onChange={(e) => handleAddClinicForm(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addClinicFormError.name[0] && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addClinicFormError.name[0]}
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
                value={addClinicForm.phone}
                onChange={(e) => handleAddClinicForm(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addClinicFormError.phone && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addClinicFormError.phone}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                type="text"
                name="address"
                value={addClinicForm.address}
                onChange={(e) => handleAddClinicForm(e)}
                required
                placeholder=""
                className="input h-16 input-bordered input-primary border-slate-300 w-full"
              />
              {addClinicFormError.address && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addClinicFormError.address}
                  </span>
                </label>
              )}
            </div>
            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Province</span>
                </label>
                <select
                  type="text"
                  name="province"
                  value={addClinicForm.province}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {provinces?.map((obj) => {
                    return (
                      <option
                        key={obj.id}
                        className="text-black"
                        value={obj.id}
                      >
                        {obj.name}
                      </option>
                    );
                  })}
                  {/* {Object.keys(provinces).map((keyName, i) => (
                    <option
                      key={provinces[keyName]}
                      className="text-black"
                      value={provinces[keyName]}
                    >
                      {provinces[keyName]}
                    </option>
                  ))} */}
                </select>
                {addClinicFormError.province && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {addClinicFormError.province}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <select
                  type="text"
                  name="city"
                  value={addClinicForm.city}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {cities?.map((obj) => {
                    return (
                      <option
                        key={obj.id}
                        className="text-black"
                        value={obj.id}
                      >
                        {obj.name}
                      </option>
                    );
                  })}
                </select>
                {addClinicFormError.city && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {addClinicFormError.city}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">District</span>
                </label>
                <select
                  type="text"
                  name="district"
                  value={addClinicForm.district}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {districts?.map((obj) => {
                    return (
                      <option
                        key={obj.id}
                        className="text-black"
                        value={obj.id}
                      >
                        {obj.name}
                      </option>
                    );
                  })}
                </select>
                {addClinicFormError.district && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {addClinicFormError.district}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Postal Code</span>
                </label>
                <select
                  type="text"
                  name="postal_code"
                  value={addClinicForm.postal_code}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {codes?.map((obj) => {
                    return (
                      <option
                        key={obj.id}
                        className="text-black"
                        value={obj.id}
                      >
                        {obj.meta?.pos + " : " + obj.name}
                      </option>
                    );
                  })}
                </select>
                {addClinicFormError.postal_code && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {addClinicFormError.postal_code}
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="addClinic"
                ref={addModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-success bg-indigo-400 rounded-md">
                Add
              </button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="updateClinicModal">
          <h3 className="font-bold text-lg mb-4">Update Clinic</h3>
          <form onSubmit={putClinic} autoComplete="off">
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
              {putClinicFormError.name[0] && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putClinicFormError.name[0]}
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                type="text"
                name="address"
                value={putClinicForm.address}
                onChange={(e) => handlePutClinicForm(e)}
                required
                placeholder=""
                className="input h-16 input-bordered input-primary border-slate-300 w-full"
              />
              {putClinicFormError.address && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putClinicFormError.address}
                  </span>
                </label>
              )}
            </div>
            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Province</span>
                </label>
                <select
                  type="text"
                  name="province"
                  value={putClinicForm.province}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {provinces?.map((obj) => {
                    return (
                      <option
                        key={obj.id}
                        className="text-black"
                        value={obj.id}
                      >
                        {obj.name}
                      </option>
                    );
                  })}
                </select>
                {putClinicFormError.province && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {putClinicFormError.province}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <select
                  type="text"
                  name="city"
                  value={putClinicForm.city}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {cities?.map((obj) => {
                    return (
                      <option
                        key={obj.id}
                        className="text-black"
                        value={obj.id}
                      >
                        {obj.name}
                      </option>
                    );
                  })}
                </select>
                {putClinicFormError.city && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {putClinicFormError.city}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">District</span>
                </label>
                <select
                  type="text"
                  name="district"
                  value={putClinicForm.district}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {districts?.map((obj) => {
                    return (
                      <option
                        key={obj.id}
                        className="text-black"
                        value={obj.id}
                      >
                        {obj.name}
                      </option>
                    );
                  })}
                </select>
                {putClinicFormError.district && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {putClinicFormError.district}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Postal Code</span>
                </label>
                <select
                  type="text"
                  name="postal_code"
                  value={putClinicForm.postal_code}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {codes?.map((obj) => {
                    return (
                      <option
                        key={obj.id}
                        className="text-black"
                        value={obj.id}
                      >
                        {obj.meta?.pos + " : " + obj.name}
                      </option>
                    );
                  })}
                </select>
                {putClinicFormError.postal_code && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {putClinicFormError.postal_code}
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="updateClinicModal"
                ref={putModalRef}
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

        <ModalBox id="verifyPhoneModal">
          <h3 className="font-bold text-lg mb-4">Verify Phone Number</h3>
          <form onSubmit={verifyPhone} autoComplete="off">
            <div className="form-control w-full">
              <div className="relative">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  disabled
                  type="text"
                  name="phone"
                  onChange={() => {}}
                  value={user?.phone || ""}
                  required
                  className="input input-bordered input-primary border-slate-300 w-full"
                />
                {otpLoading ? (
                  <span className="absolute w-16 top-[36%] h-16 right-8 ml-2 px-4 flex">
                    <img
                      src="/loading.svg"
                      alt="now loading"
                      className="absolute"
                    />
                  </span>
                ) : (
                  <>
                    {otpSent ? (
                      <label
                        onClick={() => getOTP()}
                        className="absolute top-[58%] right-2 text-sm font-bold bg-emerald-300 text-emerald-700 rounded ml-2 normal-case py-[2px] px-4 cursor-pointer"
                      >
                        OTP Sent, Check Your Whatsapp
                      </label>
                    ) : (
                      <label
                        onClick={() => getOTP()}
                        className="absolute top-[58%] right-2 text-sm font-bold bg-amber-300 text-amber-700 rounded ml-2 normal-case py-[2px] px-4 cursor-pointer"
                      >
                        Send OTP
                      </label>
                    )}
                  </>
                )}
              </div>

              {verifyFormError.message && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {verifyFormError.message}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">OTP Code</span>
              </label>
              <input
                type="text"
                name="phone"
                value={verifyForm}
                onChange={(e) => setVerifyForm(e.target.value)}
                required
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {verifyFormError.otp && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {verifyFormError.otp}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="verifyPhoneModal"
                className="btn btn-ghost rounded-md"
                ref={otpRef}
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
