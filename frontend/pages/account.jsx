import { deleteCookie, getCookie } from "cookies-next";
import React, { useEffect, useReducer, useRef, useState } from "react";
import moment from "moment/moment";

import DashboardLayout from "../layouts/DashboardLayout";
import ModalBox from "../components/Modals/ModalBox";
import axios from "./api/axios";
import ModalDelete from "../components/Modals/ModalDelete";
import { GetCookieChunk } from "../services/CookieChunk";

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
  const [villages, setVilages] = useState([]);

  const [clinics, setClinics] = useState();
  const [clinicsLoading, setClinicsLoading] = useState();

  const token = GetCookieChunk("token_");
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

    postal_code: "",
    rt: "",
    rw: "",

    district_id: "",
    city_id: "",
    province_id: "",
    village_id: "",
  };

  const initialClinicForm = {
    id: "",
    name: "",
    phone: "",
    address: "",

    postal_code: "",
    rt: "",
    rw: "",

    district_id: "",
    city_id: "",
    province_id: "",
    village_id: "",
  };
  const [userForm, setUserForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialUserForm
  );
  const [userFormError, setUserFormError] = useReducer(
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
      // console.log(response);
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
        role_id: response.data.role_id,

        postal_code: response.data.employee.postal_code,
        rt: response.data.employee.rt,
        rw: response.data.employee.rw,

        province: response.data.employee.province,
        province_id: response.data.employee.province_id,
        city: response.data.employee.city,
        city_id: response.data.employee.city_id,
        district: response.data.employee.district,
        district_id: response.data.employee.district_id,
        village: response.data.employee.village,
        village_id: response.data.employee.village_id,
      };
      setUser(userData);
      setUserForm(userData);
    } catch (err) {
      console.log(err);
    }
  }
  // ?.replace("+", "").substring(2)

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
    setUserFormError(initialUserForm)
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
      // console.log(response);
      setIsEditUser(false);
      getUser();
      setUserFormError({});
    } catch (err) {
      console.error(err);
      setUserFormError({});
      setUserFormError(err.response?.data);
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
      // return response.data?.data;
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
      // setCities(response.data?.data);
      return response.data?.data;
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
      // setDistricts(response.data?.data);
      return response.data?.data;
    } catch (e) {
      console.error(e);
    }
  }
  async function getVilages(id) {
    try {
      const response = await axios.get(
        `location/province/city/district/villages/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // setVilages(response.data?.data);
      return response.data?.data;
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
    // console.log(data);
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

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!userForm.province_id) {
        setCities([]);
        return;
      }
      // setUserForm({ city_id: "", districts_id: "", village_id: "" });
      setCities([]);
      setDistricts([]);
      setVilages([]);
      setCities(await getCities(userForm.province_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [userForm.province_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!userForm.city_id) {
        setDistricts([]);
        return;
      }
      // setUserForm({ districts_id: "", village_id: "" });
      setDistricts([]);
      setVilages([]);
      setDistricts(await getDistricts(userForm.city_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [userForm.city_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!userForm.district_id) {
        setVilages([]);
        return;
      }
      // setUserForm({ village_id: "" });
      setVilages([]);
      setVilages(await getVilages(userForm.district_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [userForm.district_id]);

  // ADD CLINIC REGION
  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!addClinicForm.province_id) {
        setCities([]);
        return;
      }
      // setUserForm({ city_id: "", districts_id: "", village_id: "" });
      setCities([]);
      setDistricts([]);
      setVilages([]);
      setCities(await getCities(addClinicForm.province_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [addClinicForm.province_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!addClinicForm.city_id) {
        setDistricts([]);
        return;
      }
      // setUserForm({ districts_id: "", village_id: "" });
      setDistricts([]);
      setVilages([]);
      setDistricts(await getDistricts(addClinicForm.city_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [addClinicForm.city_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!addClinicForm.district_id) {
        setVilages([]);
        return;
      }
      // setUserForm({ village_id: "" });
      setVilages([]);
      setVilages(await getVilages(addClinicForm.district_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [addClinicForm.district_id]);

  // PUT CLINIC REGION
  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!putClinicForm.province_id) {
        setCities([]);
        return;
      }
      // setUserForm({ city_id: "", districts_id: "", village_id: "" });
      setCities([]);
      setDistricts([]);
      setVilages([]);
      setCities(await getCities(putClinicForm.province_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [putClinicForm.province_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!putClinicForm.city_id) {
        setDistricts([]);
        return;
      }
      // setUserForm({ districts_id: "", village_id: "" });
      setDistricts([]);
      setVilages([]);
      setDistricts(await getDistricts(putClinicForm.city_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [putClinicForm.city_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!putClinicForm.district_id) {
        setVilages([]);
        return;
      }
      // setUserForm({ village_id: "" });
      setVilages([]);
      setVilages(await getVilages(putClinicForm.district_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [putClinicForm.district_id]);

  // console.log(userForm)

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     if (!addClinicForm.province_id) {
  //       setCities([]);
  //       return;
  //     }
  //     setAddClinicForm({ city_id: "", district_id: "", postal_code: "" });
  //     setCities([]);
  //     setDistricts([]);
  //     setVilages([]);
  //     getCities(addClinicForm.province_id);
  //   }, 500);
  //   return () => clearTimeout(getData);
  // }, [addClinicForm.province_id]);

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     if (!addClinicForm.city_id) {
  //       setDistricts([]);
  //       return;
  //     }
  //     setAddClinicForm({ district_id: "", village_id: "" });
  //     setDistricts([]);
  //     setVilages([]);
  //     getDistricts(addClinicForm.city_id);
  //   }, 500);
  //   return () => clearTimeout(getData);
  // }, [addClinicForm.city_id]);

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     if (!addClinicForm.district_id) {
  //       setVilages([]);
  //       return;
  //     }
  //     setAddClinicForm({ village_id: "" });
  //     setVilages([]);
  //     getVilages(addClinicForm.district_id);
  //   }, 500);
  //   return () => clearTimeout(getData);
  // }, [addClinicForm.district_id]);

  // const [isGetUpdateAddress, setIsGetUpdateAddress] = useState(false);
  // async function getUpdateAddress(obj) {
  //   setIsGetUpdateAddress(true);
  //   await getCities(obj.province_id);
  //   await getDistricts(obj.city_id);
  //   await getVilages(obj.district_id);
  //   setIsGetUpdateAddress(false);
  // }

  // console.log(userFormError);
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
                        onClick={async () => {
                          setIsEditUser((prev) => {
                            return !prev;
                          });
                          setTimeout(() => userFormRef.current.focus(), 10);
                          // getUser();
                          // setProvinces();
                          setCities(await getCities(user.province_id));
                          setDistricts(await getDistricts(user.city_id));
                          setVilages(await getVilages(user.district_id));
                          // console.log(userForm);
                          setUserFormError({});
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
                          Save Changes
                          <i className={`fas fa-save ml-2`}></i>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`flex-auto pb-8 px-4 pt-0 ${
                    !isEditUser ? "block" : "hidden"
                  } transition-all text-gray-300 flex flex-wrap"`}
                >
                  <table className="mx-8 text-sm w-3/5">
                    <tbody>
                      <tr className="text-white">
                        <td className="py-[9.1px] font-semibold text-lg w-1/4">
                          NIK
                        </td>
                        <td className="px-4 "></td>
                        <td className="px-4 text-lg tracking-wider">
                          {user?.nik}
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Name</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">{user?.name || "-"}</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Birth</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          {user?.birth_place +
                            ", " +
                            moment(user?.birth_date).format("DD MMMM yyyy") ||
                            "-"}
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Gender</td>
                        <td className="px-4 "></td>
                        <td className="px-4 capitalize">
                          {user?.gender || "-"}
                        </td>
                      </tr>
                      <tr className="">
                        <td className="py-1">~</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Address</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">{user?.address || "-"}</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">RT/RW</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">{user?.rt + " / " + user?.rw}</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Village</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">{user?.village?.name || "-"}</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">District</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">{user?.district?.name || "-"}</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">City</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">{user?.city?.name || "-"}</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Province</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">{user?.province?.name || "-"}</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Postal Code</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">{user?.postal_code || "-"}</td>
                      </tr>
                      <tr className="">
                        <td className="py-1">~</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Email</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <div className="relative">
                            <input
                              type="email"
                              className={`bg-transparent border-0 px-0 placeholder-blueGray-300 text-gray-400 rounded text-sm shadow w-full ease-linear transition-all duration-150 cursor-not-allowed`}
                              value={userForm.email}
                              disabled
                            />
                            {userData?.role_id == 2 && (
                              <>
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
                                      <span className="absolute top-[20%] opacity-70 right-2 text-sm font-bold bg-emerald-200 text-emerald-600 rounded ml-2 normal-case py-[2px] px-4 select-none">
                                        Verification Email Sent
                                      </span>
                                    )
                                  ) : (
                                    <span
                                      onClick={sendVerifyEmail}
                                      className="absolute top-[20%] right-2 text-sm font-bold bg-amber-300 text-amber-700 rounded ml-2 normal-case py-[2px] px-4 cursor-pointer"
                                    >
                                      Verify now{" "}
                                      <i className="fas fa-arrow-right"></i>
                                    </span>
                                  )
                                ) : (
                                  <span className="absolute top-[20%] right-2 text-sm font-bold bg-emerald-300 text-emerald-700 rounded ml-2 normal-case py-[2px] px-4 cursor-not-allowed select-none">
                                    Verified <i className="fas fa-check"></i>
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Phone</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <div className="relative">
                            <div className="flex">
                              <input
                                type="select"
                                className={`bg-transparent border-0 w-6 placeholder-blueGray-300 text-gray-400 rounded-l text-sm shadow ease-linear transition-all duration-150 cursor-not-allowed`}
                                value={"+62"}
                                disabled
                              />
                              <input
                                type="text"
                                className={`bg-transparent border-0 placeholder-blueGray-300 text-gray-400 rounded-r text-sm shadow w-full ease-linear transition-all duration-150 cursor-not-allowed`}
                                value={
                                  user?.phone.replace("+", "").substring(2) ||
                                  ""
                                }
                                disabled
                              />
                            </div>
                            {userData?.role_id == 2 && (
                              <>
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
                                      <span className="absolute top-[20%] opacity-70 right-2 text-sm font-bold bg-emerald-200 text-emerald-600 rounded ml-2 normal-case py-[2px] px-4 select-none">
                                        Verification Email Sent
                                      </span>
                                    )
                                  ) : (
                                    <label
                                      htmlFor="verifyPhoneModal"
                                      className="absolute top-[20%] right-2 text-sm font-bold bg-amber-300 text-amber-700 rounded ml-2 normal-case py-[2px] px-4 cursor-pointer"
                                    >
                                      Verify now{" "}
                                      <i className="fas fa-arrow-right"></i>
                                    </label>
                                  )
                                ) : (
                                  <span className="absolute top-[20%] right-2 text-sm font-bold bg-emerald-300 text-emerald-700 rounded ml-2 normal-case py-[2px] px-4 cursor-not-allowed select-none">
                                    Verified <i className="fas fa-check"></i>
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div
                  className={`flex-auto pb-8 px-4 pt-0 ${
                    !isEditUser ? "hidden" : "block"
                  } transition-all text-gray-300 flex flex-wrap"`}
                >
                  <table className="mx-8 text-sm w-3/5">
                    <tbody>
                      <tr className="text-white">
                        <td className="py-2 font-semibold text-lg w-1/4">
                          NIK
                        </td>
                        <td className="px-4 "></td>
                        <td className="px-4 text-lg tracking-wider">
                          <input
                            type="text"
                            name="nik"
                            value={userForm.nik || ""}
                            disabled={!isEditUser}
                            onChange={(e) => handleUserForm(e)}
                            required
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 text-lg placeholder-blueGray-300 text-white rounded shadow w-full ease-linear transition-all duration-150`}
                          />
                          <p className="text-rose-400">{userFormError.nik}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Name</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <input
                            type="text"
                            name="name"
                            value={userForm.name || ""}
                            disabled={!isEditUser}
                            onChange={(e) => handleUserForm(e)}
                            required
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-full ease-linear transition-all duration-150`}
                          />
                          <p className="text-rose-400">{userFormError.name}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Birth</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              name="birth_place"
                              value={userForm.birth_place || ""}
                              disabled={!isEditUser}
                              onChange={(e) => handleUserForm(e)}
                              required
                              className={`${
                                isEditUser ? "bg-slate-800" : "bg-zinc-100"
                              } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                            />
                            <p className="font-bold w-[4%] text-center">/</p>
                            <input
                              type="date"
                              name="birth_date"
                              value={userForm.birth_date || ""}
                              disabled={!isEditUser}
                              onChange={(e) => handleUserForm(e)}
                              required
                              className={`${
                                isEditUser ? "bg-slate-800" : "bg-zinc-100"
                              } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                            />
                          </div>
                          <p className="text-rose-400">{userFormError.birth_date ? userFormError.birth_date : userFormError.birth_place}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Gender</td>
                        <td className="px-4 "></td>
                        <td className="px-4 capitalize">
                          <select
                            type="text"
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 placeholder-blueGray-300 text-slate-300 rounded text-sm shadow w-full ease-linear transition-all duration-150`}
                            value={userForm.gender || ""}
                            disabled={!isEditUser}
                            name="gender"
                            onChange={(e) => handleUserForm(e)}
                            required
                          >
                            <option disabled>Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <p className="text-rose-400">{userFormError.gender}</p>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="py-1">~</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Address</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <input
                            type="text"
                            name="address"
                            value={userForm.address || ""}
                            disabled={!isEditUser}
                            onChange={(e) => handleUserForm(e)}
                            required
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-full ease-linear transition-all duration-150`}
                          />
                          <p className="text-rose-400">{userFormError.address}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">RT/RW</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              name="rt"
                              value={userForm.rt || ""}
                              disabled={!isEditUser}
                              onChange={(e) => handleUserForm(e)}
                              required
                              className={`${
                                isEditUser ? "bg-slate-800" : "bg-zinc-100"
                              } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                            />
                            <p className="font-bold w-[4%] text-center">/</p>
                            <input
                              type="text"
                              name="rw"
                              value={userForm.rw || ""}
                              disabled={!isEditUser}
                              onChange={(e) => handleUserForm(e)}
                              required
                              className={`${
                                isEditUser ? "bg-slate-800" : "bg-zinc-100"
                              } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                            />
                          </div>
                          <p className="text-rose-400">{userFormError.rt ? userFormError.rt : userFormError.rw}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Village</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <select
                            type="text"
                            name="village_id"
                            value={userForm.village_id}
                            onChange={(e) => handleUserForm(e)}
                            required
                            placeholder=""
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-full ease-linear transition-all duration-150`}
                          >
                            <option className="">Select</option>
                            {villages?.map((obj) => {
                              return (
                                <option
                                  key={obj.id}
                                  className="text-white"
                                  value={obj.id}
                                >
                                  {obj.name}
                                </option>
                              );
                            })}
                          </select>
                          <p className="text-rose-400">{userFormError.village_id}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">District</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <select
                            type="text"
                            name="district_id"
                            value={userForm.district_id}
                            onChange={(e) => handleUserForm(e)}
                            required
                            placeholder=""
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-full ease-linear transition-all duration-150`}
                          >
                            <option className="">Select</option>
                            {districts?.length &&
                              districts?.map((obj) => {
                                return (
                                  <option
                                    key={obj.id}
                                    className="text-white"
                                    value={obj.id}
                                  >
                                    {obj.name}
                                  </option>
                                );
                              })}
                          </select>
                          <p className="text-rose-400">{userFormError.district_id}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">City</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <select
                            type="text"
                            name="city_id"
                            value={userForm.city_id}
                            onChange={(e) => handleUserForm(e)}
                            required
                            placeholder=""
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-full ease-linear transition-all duration-150`}
                          >
                            <option className="">Select</option>
                            {cities?.map((obj) => {
                              return (
                                <option
                                  key={obj.id}
                                  className="text-white"
                                  value={obj.id}
                                >
                                  {obj.name}
                                </option>
                              );
                            })}
                          </select>
                          <p className="text-rose-400">{userFormError.city_id}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Province</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <select
                            type="text"
                            name="province_id"
                            value={userForm.province_id}
                            onChange={(e) => handleUserForm(e)}
                            required
                            placeholder=""
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-full ease-linear transition-all duration-150`}
                          >
                            <option className="">Select</option>
                            {provinces?.length &&
                              provinces?.map((obj) => {
                                return (
                                  <option
                                    key={obj.id}
                                    className="text-white"
                                    value={obj.id}
                                  >
                                    {obj.name}
                                  </option>
                                );
                              })}
                          </select>
                          <p className="text-rose-400">{userFormError.province_id}</p>
                        </td>
                      </tr>

                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Postal Code</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <input
                            type="number"
                            name="postal_code"
                            value={userForm.postal_code || ""}
                            disabled={!isEditUser}
                            onChange={(e) => handleUserForm(e)}
                            required
                            className={`${
                              isEditUser ? "bg-slate-800" : "bg-zinc-100"
                            } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-full ease-linear transition-all duration-150`}
                          />
                          <p className="text-rose-400">{userFormError.postal_code}</p>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="py-1">~</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Email</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <div className="relative">
                            <input
                              type="email"
                              className={`${
                                isEditUser ? "bg-slate-800" : "bg-slate-900"
                              } border-0 px-2 placeholder-blueGray-300 text-gray-400 rounded text-sm shadow w-full ease-linear transition-all duration-150 cursor-not-allowed`}
                              value={userForm.email}
                              disabled
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Phone</td>
                        <td className="px-4 "></td>
                        <td className="px-4 ">
                          <div className="relative">
                            <div className="flex">
                              <input
                                type="select"
                                className={`${
                                  isEditUser ? "bg-slate-700" : "bg-slate-900"
                                } border-0 w-11 pl-2 placeholder-blueGray-300 text-gray-400 rounded-l text-sm shadow ease-linear transition-all duration-150 cursor-not-allowed`}
                                value={"+62"}
                                disabled
                              />
                              <input
                                type="text"
                                name="phone"
                                disabled
                                onChange={(e) => handleUserForm(e)}
                                className={`${
                                  isEditUser ? "bg-slate-800" : "bg-slate-900"
                                } border-0 placeholder-blueGray-300 text-gray-300 rounded-r text-sm shadow w-full ease-linear transition-all duration-150`}
                                value={userForm.phone}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div
                  className={`flex-auto px-4 pt-0 ${
                    !isEditUser ? "pb-8 hidden" : "pb-16 hidden"
                  } transition-all`}
                >
                  <div className="flex flex-wrap">
                    <div className="flex gap-8 flex-row-reverse w-full px-4">
                      <div className="w-full">
                        <div className="relative w-full flex gap-4 items-center">
                          <div className="relative w-full mb-2">
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
                                } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow w-full ease-linear transition-all duration-150`}
                                value={userForm.birth_place || ""}
                                disabled={!isEditUser}
                                name="birth_place"
                                onChange={(e) => handleUserForm(e)}
                                required
                              />
                            </div>
                          </div>
                          <div className="relative w-full mb-2">
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
                                } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow w-full ease-linear transition-all duration-150`}
                                value={userForm.birth_date || ""}
                                disabled={!isEditUser}
                                name="birth_date"
                                onChange={(e) => handleUserForm(e)}
                                required
                              />
                            </div>
                          </div>
                          <div className="relative w-full mb-2">
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
                                } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow w-full ease-linear transition-all duration-150`}
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
                        <div className="relative w-full">
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
                              } border-0 p-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow w-full ease-linear transition-all duration-150"
                `}
                              value={userForm.address || ""}
                              disabled={!isEditUser}
                              rows={1}
                              name="address"
                              onChange={(e) => handleUserForm(e)}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="form-control w-full">
                            <label className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                              <span className="mt-2 ">Province</span>
                            </label>
                            <select
                              type="text"
                              name="province_id"
                              value={userForm.province_id}
                              onChange={(e) => handleUserForm(e)}
                              required
                              disabled={!isEditUser}
                              placeholder=""
                              className="input input-bordered input-primary border-slate-300 w-full"
                            >
                              <option className="text-black">Select</option>
                              {provinces?.length &&
                                provinces?.map((obj) => {
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
                            {putClinicFormError.province_id && (
                              <label className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                                <span className="mt-2 -alt text-rose-300">
                                  {putClinicFormError.province_id}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control w-full">
                            <label className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                              <span className="mt-2 ">City</span>
                            </label>
                            <select
                              type="text"
                              name="city_id"
                              value={userForm.city_id}
                              onChange={(e) => handleUserForm(e)}
                              required
                              disabled={!isEditUser}
                              placeholder=""
                              className="input input-bordered input-primary border-slate-300 w-full"
                            >
                              <option className="text-black">Select</option>
                              {cities?.length &&
                                cities?.map((obj) => {
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
                            {putClinicFormError.city_id && (
                              <label className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                                <span className="mt-2 -alt text-rose-300">
                                  {putClinicFormError.city_id}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="form-control w-full">
                            <label className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                              <span className="mt-2 ">District</span>
                            </label>
                            <select
                              type="text"
                              name="district_id"
                              value={userForm.district_id}
                              onChange={(e) => handleUserForm(e)}
                              required
                              disabled={!isEditUser}
                              placeholder=""
                              className="input input-bordered input-primary border-slate-300 w-full"
                            >
                              <option className="text-black">Select</option>
                              {districts?.length &&
                                districts?.map((obj) => {
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
                            {putClinicFormError.district_id && (
                              <label className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                                <span className="mt-2 -alt text-rose-300">
                                  {putClinicFormError.district_id}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control w-full">
                            <label className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                              <span className="mt-2 ">Postal Code</span>
                            </label>
                            <select
                              type="number"
                              name="postal_code"
                              value={userForm.postal_code}
                              onChange={(e) => handleUserForm(e)}
                              required
                              disabled={!isEditUser}
                              placeholder=""
                              className="input input-bordered input-primary border-slate-300 w-full"
                            >
                              <option className="text-black">Select</option>
                              {villages?.length &&
                                villages?.map((obj) => {
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
                            {putClinicFormError.postal_code && (
                              <label className="capitalize text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                                <span className="mt-2 -alt text-rose-300">
                                  {putClinicFormError.postal_code}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>

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
                              } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow w-full ease-linear transition-all duration-150"
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
                            <span>Name </span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className={`${
                                isEditUser ? "bg-white" : "bg-zinc-100"
                              } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow w-full ease-linear transition-all duration-150"
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
                            <span>Email </span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className={`${
                                isEditUser ? "bg-white" : "bg-zinc-100"
                              } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded text-sm shadow w-full ease-linear transition-all duration-150 cursor-not-allowed`}
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
                            <div className="flex">
                              <input
                                type="select"
                                className={`${
                                  isEditUser ? "bg-zinc-100" : "bg-zinc-200"
                                } border-0 w-14 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded-l text-sm shadow ease-linear transition-all duration-150 cursor-not-allowed`}
                                value={"+62"}
                                disabled
                              />
                              <input
                                type="text"
                                className={`${
                                  isEditUser ? "bg-white" : "bg-zinc-100"
                                } border-0 px-3 py-3 placeholder-blueGray-300 text-gray-600 rounded-r text-sm shadow w-full ease-linear transition-all duration-150 cursor-not-allowed`}
                                value={userForm.phone.substring(2)}
                                disabled
                              />
                            </div>
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

          <div
            className={`w-full mt-1 mb-16 ${userData?.role_id > 2 && "hidden"}`}
          >
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
                        setVilages([]);
                        setAddClinicForm(initialClinicForm);
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
                            {obj.address || "-"}, {obj.district?.name || "-"},{" "}
                            {obj.city?.name || "-"}, {obj.province?.name || "-"}
                            , {obj.postal_code || "-"}.
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
                              onClick={async () => {
                                setPutClinicForm(obj);
                                // getUpdateAddress(obj);

                                setCities(await getCities(obj.province_id));
                                setDistricts(await getDistricts(obj.city_id));
                                setVilages(await getVilages(obj.district_id));
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
                  name="province_id"
                  value={addClinicForm.province_id}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {provinces?.length &&
                    provinces?.map((obj) => {
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
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addClinicFormError.province_id}
                  </span>
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <select
                  type="text"
                  name="city_id"
                  value={addClinicForm.city_id}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {cities?.length &&
                    cities?.map((obj) => {
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
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addClinicFormError.city_id}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">District</span>
                </label>
                <select
                  type="text"
                  name="district_id"
                  value={addClinicForm.district_id}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {districts?.length &&
                    districts?.map((obj) => {
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
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addClinicFormError.district_id}
                  </span>
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Village</span>
                </label>
                <select
                  type="text"
                  name="village_id"
                  value={addClinicForm.village_id}
                  onChange={(e) => {
                    handleAddClinicForm(e)
                  }}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="">
                    Select
                  </option>
                  {villages?.length &&
                    villages?.map((obj) => {
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
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addClinicFormError.village_id}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Postal Code</span>
                </label>
                <input
                  type="number"
                  name="postal_code"
                  value={addClinicForm.postal_code}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                />
                {addClinicFormError.postal_code && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {addClinicFormError.postal_code}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">RT</span>
                </label>
                <input
                  type="text"
                  name="rt"
                  value={addClinicForm.rt}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                />
                {addClinicFormError.rt && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {addClinicFormError.rt}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">RW</span>
                </label>
                <input
                  type="text"
                  name="rw"
                  value={addClinicForm.rw}
                  onChange={(e) => handleAddClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                />
                {addClinicFormError.rw && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {addClinicFormError.rw}
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
                  name="province_id"
                  value={putClinicForm.province_id}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {provinces?.length &&
                    provinces?.map((obj) => {
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
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putClinicFormError.province_id}
                  </span>
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <select
                  type="text"
                  name="city_id"
                  value={putClinicForm.city_id}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {cities?.length &&
                    cities?.map((obj) => {
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
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putClinicFormError.city_id}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">District</span>
                </label>
                <select
                  type="text"
                  name="district_id"
                  value={putClinicForm.district_id}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {districts?.length &&
                    districts?.map((obj) => {
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
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putClinicFormError.district_id}
                  </span>
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Village</span>
                </label>
                <select
                  type="text"
                  name="village_id"
                  value={putClinicForm.village_id}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                >
                  <option className="text-black">Select</option>
                  {villages?.length &&
                    villages?.map((obj) => {
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
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putClinicFormError.village_id}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Postal Code</span>
                </label>
                <input
                  type="number"
                  name="postal_code"
                  value={putClinicForm.postal_code}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                />
                {putClinicFormError.postal_code && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {putClinicFormError.postal_code}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">RT</span>
                </label>
                <input
                  type="text"
                  name="rt"
                  value={putClinicForm.rt}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                />
                {putClinicFormError.rt && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {putClinicFormError.rt}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">RW</span>
                </label>
                <input
                  type="text"
                  name="rw"
                  value={putClinicForm.rw}
                  onChange={(e) => handlePutClinicForm(e)}
                  required
                  placeholder=""
                  className="input input-bordered input-primary border-slate-300 w-full"
                />
                {putClinicFormError.rw && (
                  <label className="label">
                    <span className="label-text-alt text-rose-300">
                      {putClinicFormError.rw}
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
                Verify
              </button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
