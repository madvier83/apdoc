import React, { useState, useEffect, useRef, useReducer } from "react";
import Router, { useRouter } from "next/router";
import axios from "../api/axios";

import Link from "next/link";
import AuthLayout from "../../layouts/AuthLayout";

export default function Register() {
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVilages] = useState([]);

  const [provincesClinic, setProvincesClinic] = useState([]);
  const [citiesClinic, setCitiesClinic] = useState([]);
  const [districtsClinic, setDistrictsClinic] = useState([]);
  const [villagesClinic, setVilagesClinic] = useState([]);

  const initialVerifyForm = {
    email: "",
    email_token_verification: "",

    nik: "",
    name: "",
    birth_place: "",
    birth_date: "",
    gender: "",
    owner_phone: "",
    owner_province_id: "",
    owner_city_id: "",
    owner_district_id: "",
    owner_village_id: "",
    owner_address: "",
    owner_rt: "",
    owner_rw: "",
    owner_postal_code: "",

    clinic_name: "",
    clinic_phone: "",
    clinic_province_id: "",
    clinic_city_id: "",
    clinic_district_id: "",
    clinic_address: "",
    clinic_rt: "",
    clinic_rw: "",
    clinic_postal_code: "",
  };

  const [registerForm, setRegisterForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVerifyForm
  );
  const [registerFormError, setRegisterFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVerifyForm
  );

  const handleRegisterInput = (event) => {
    const { name, value } = event.target;
    setRegisterForm({ [name]: value });
  };
  // console.log({
  //   ...registerForm,
  //   owner_phone: "62" + registerForm.owner_phone,
  //   clinic_phone: "62" + registerForm.clinic_phone,
  // });
  async function handleVerify(e) {
    e.preventDefault();
    setVerifyLoading(true);
    try {
      const response = await axios.post(
        "auth/registration",
        {
          ...registerForm,
          owner_phone: "62" + registerForm.owner_phone,
          clinic_phone: "62" + registerForm.clinic_phone,
        },
        {
          "Content-Type": "application/json",
        }
      );
      router.push(
        {
          pathname: "/auth/login",
          // query: { email: response.data.data.email },
        },
        "/auth/login"
      );
    } catch (err) {
      console.log(err);
      setRegisterFormError(initialVerifyForm);
      setRegisterFormError(err.response?.data?.errors);
      setVerifyLoading(false);
    }
  }

  async function getProvinces() {
    try {
      const response = await axios.get(`location/provinces`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setProvinces(response.data?.data);
      // console.log(response)
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

  // console.log(provinces)
  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setRegisterForm({
        email: router.query.email,
        email_token_verification: router.query.token,
      });
    }
  }, [router.isReady]);

  
  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!registerForm.owner_province_id) {
        setCities([]);
        return;
      }
      // setUserForm({ city_id: "", districts_id: "", village_id: "" });
      setCities([]);
      setDistricts([]);
      setVilages([]);
      setCities(await getCities(registerForm.owner_province_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.owner_province_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!registerForm.owner_city_id) {
        setDistricts([]);
        return;
      }
      // setUserForm({ districts_id: "", village_id: "" });
      setDistricts([]);
      setVilages([]);
      setDistricts(await getDistricts(registerForm.owner_city_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.owner_city_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!registerForm.owner_district_id) {
        setVilages([]);
        return;
      }
      // setUserForm({ village_id: "" });
      setVilages([]);
      setVilages(await getVilages(registerForm.owner_district_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.owner_district_id]);

  // clinic region
  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!registerForm.clinic_province_id) {
        setCitiesClinic([]);
        return;
      }
      // setUserForm({ city_id: "", districts_id: "", village_id: "" });
      setCitiesClinic([]);
      setDistrictsClinic([]);
      setVilagesClinic([]);
      setCitiesClinic(await getCities(registerForm.clinic_province_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.clinic_province_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!registerForm.clinic_city_id) {
        setDistrictsClinic([]);
        return;
      }
      // setUserForm({ districts_id: "", village_id: "" });
      setDistrictsClinic([]);
      setVilagesClinic([]);
      setDistrictsClinic(await getDistricts(registerForm.clinic_city_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.clinic_city_id]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (!registerForm.clinic_district_id) {
        setVilagesClinic([]);
        return;
      }
      // setUserForm({ village_id: "" });
      setVilagesClinic([]);
      setVilagesClinic(await getVilages(registerForm.clinic_district_id));
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.clinic_district_id]);

  // console.log(provinces)

  return (
    <>
      <AuthLayout title={"APDOC | Account Verification"}>
        <div className="w-screen">
          <div className="rounded-t mb-0 px-6 py-6">
            <div className="text-center mb-3">
              <h6 className="text-white text-4xl mt-4 font-bold">APDOC</h6>
            </div>
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="flex-auto px-4 lg:px-10 py-10 pt-8 max-w-xl">
              <form onSubmit={(e) => handleVerify(e)}>
                <div className="w-full">
                  <div className="relative items-center">
                    <span className="text-2xl font-semibold p-0 flex-shrink text-white">
                      Personal Information
                    </span>
                    <table className="mt-8 text-sm w-full z-50">
                      <tbody>
                        <tr className="text-white">
                          <td className="py-2 font-semibold text-lg w-1/4">
                            NIK
                          </td>
                          <td className=" "></td>
                          <td className="pl-4 text-lg tracking-wider">
                            <input
                              type="text"
                              name="nik"
                              value={registerForm.nik || ""}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              className={` border-0 px-3 text-lg bg-zinc-800 text-white rounded shadow w-full ease-linear transition-all duration-150`}
                            />
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.nik}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">Name</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <input
                              type="text"
                              name="name"
                              value={registerForm.name || ""}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                            />
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.name}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">Birth</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                name="birth_place"
                                value={registerForm.birth_place || ""}
                                onChange={(e) => handleRegisterInput(e)}
                                required
                                className={`border-0 px-3 text-sm bg-zinc-800 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                              />
                              <p className="font-bold w-[4%] text-center">/</p>
                              <input
                                type="date"
                                name="birth_date"
                                value={registerForm.birth_date || ""}
                                onChange={(e) => handleRegisterInput(e)}
                                required
                                className={`border-0 px-3 text-sm bg-zinc-800 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                              />
                            </div>
                              <p className="text-rose-400 font-normal text-xs">{registerFormError?.birth_place || registerFormError?.birth_date}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">Gender</td>
                          <td className=" "></td>
                          <td className="pl-4 capitalize">
                            <select
                              type="text"
                              className={` border-0 px-3 bg-zinc-800 rounded text-sm shadow w-full ease-linear transition-all duration-150`}
                              value={registerForm.gender || ""}
                              name="gender"
                              onChange={(e) => handleRegisterInput(e)}
                              required
                            >
                              <option>Select</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.gender}</p>
                          </td>
                        </tr>
                        <tr className="">
                          <td className="py-1 text-slate-200">~</td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">Address</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <input
                              type="text"
                              name="owner_address"
                              value={registerForm.owner_address || ""}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                            />
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.owner_address}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">RT/RW</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                name="owner_rt"
                                value={registerForm.owner_rt || ""}
                                onChange={(e) => handleRegisterInput(e)}
                                required
                                className={`border-0 px-3 text-sm bg-zinc-800 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                              />
                              <p className="font-bold w-[4%] text-center">/</p>
                              <input
                                type="text"
                                name="owner_rw"
                                value={registerForm.owner_rw || ""}
                                onChange={(e) => handleRegisterInput(e)}
                                required
                                className={`border-0 px-3 text-sm bg-zinc-800 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                              />
                            </div>
                            
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.owner_rt || registerFormError?.owner_rw}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">Province</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <select
                              type="text"
                              name="owner_province_id"
                              value={registerForm.owner_province_id}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              placeholder=""
                              className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                            >
                              <option className="">Select</option>
                              {provinces.length &&
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
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.owner_province_id}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">City</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <select
                              type="text"
                              name="owner_city_id"
                              value={registerForm.owner_city_id}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              placeholder=""
                              className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
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
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.owner_city_id}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">District</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <select
                              type="text"
                              name="owner_district_id"
                              value={registerForm.owner_district_id}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              placeholder=""
                              className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
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
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.owner_district_id}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">Village</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <select
                              type="text"
                              name="owner_village_id"
                              value={registerForm.owner_village_id}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              placeholder=""
                              className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
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
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.owner_village_id}</p>
                          </td>
                        </tr>
                        <tr className="text-gray-400 w-full">
                          <td className="py-2">Postal Code</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <input
                              type="number"
                              name="owner_postal_code"
                              value={registerForm.owner_postal_code || ""}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                            />
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.owner_postal_code}</p>
                          </td>
                        </tr>
                        <tr className="">
                          <td className="py-1 text-slate-200">~</td>
                        </tr>

                        <tr className="text-gray-400 w-full">
                          <td className="py-[9.1px]">Phone</td>
                          <td className=" "></td>
                          <td className="pl-4 ">
                            <div className="flex">
                              <input
                                type="select"
                                className={`bg-transparent border-0 w-12 px-2 bg-zinc-700 text-gray-400 rounded-l text-sm shadow ease-linear transition-all duration-150 cursor-not-allowed`}
                                value={"+62"}
                                disabled
                              />
                              <input
                                type="number"
                                name="owner_phone"
                                required
                                className={`bg-transparent border-0 bg-zinc-800 text-gray-400 rounded-r text-sm shadow w-full ease-linear transition-all duration-150`}
                                value={registerForm.owner_phone}
                                onChange={e => handleRegisterInput(e)}
                              />
                            </div>
                            <p className="text-rose-400 font-normal text-xs">{registerFormError?.owner_phone}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="w-full">
                  <div className="relative flex items-center">
                    <span className="text-2xl font-semibold p-0 flex-shrink mr-4 text-white mt-16">
                      Add Clinic
                    </span>
                  </div>

                  <table className="mt-8 text-sm w-full z-50">
                    <tbody>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2 w-1/4">Clinic Name</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <input
                            type="text"
                            name="clinic_name"
                            value={registerForm.clinic_name || ""}
                            onChange={(e) => handleRegisterInput(e)}
                            required
                            className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                          />
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_name}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-[9.1px]">Phone</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <div className="flex">
                            <input
                              type="select"
                              className={`bg-transparent border-0 w-12 px-2 bg-zinc-700 text-gray-400 rounded-l text-sm shadow ease-linear transition-all duration-150 cursor-not-allowed`}
                              value={"+62"}
                              disabled
                            />
                            <input
                              type="number"
                              name="clinic_phone"
                              required
                              className={`bg-transparent border-0 bg-zinc-800 text-gray-400 rounded-r text-sm shadow w-full ease-linear transition-all duration-150`}
                              value={registerForm.clinic_phone}
                              onChange={e => handleRegisterInput(e)}
                            />
                          </div>
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_phone}</p>
                        </td>
                      </tr>
                      <tr className="">
                        <td className="py-1 text-slate-200">~</td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Address</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <input
                            type="text"
                            name="clinic_address"
                            value={registerForm.clinic_address || ""}
                            onChange={(e) => handleRegisterInput(e)}
                            required
                            className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                          />
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_address}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">RT/RW</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              name="clinic_rt"
                              value={registerForm.clinic_rt || ""}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              className={`border-0 px-3 text-sm bg-zinc-800 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                            />
                            <p className="font-bold w-[4%] text-center">/</p>
                            <input
                              type="text"
                              name="clinic_rw"
                              value={registerForm.clinic_rw || ""}
                              onChange={(e) => handleRegisterInput(e)}
                              required
                              className={`border-0 px-3 text-sm bg-zinc-800 rounded shadow w-[48%] ease-linear transition-all duration-150`}
                            />
                          </div>
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_rt || registerFormError?.clinic_rw}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Province</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <select
                            type="text"
                            name="clinic_province_id"
                            value={registerForm.clinic_province_id}
                            onChange={(e) => handleRegisterInput(e)}
                            required
                            placeholder=""
                            className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                          >
                            <option className="">Select</option>
                            {provinces.length &&
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
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_province_id}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">City</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <select
                            type="text"
                            name="clinic_city_id"
                            value={registerForm.clinic_city_id}
                            onChange={(e) => handleRegisterInput(e)}
                            required
                            placeholder=""
                            className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                          >
                            <option className="">Select</option>
                            {citiesClinic?.map((obj) => {
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
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_city_id}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">District</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <select
                            type="text"
                            name="clinic_district_id"
                            value={registerForm.clinic_district_id}
                            onChange={(e) => handleRegisterInput(e)}
                            required
                            placeholder=""
                            className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                          >
                            <option className="">Select</option>
                            {districtsClinic?.length &&
                              districtsClinic?.map((obj) => {
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
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_district_id}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Village</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <select
                            type="text"
                            name="clinic_village_id"
                            value={registerForm.clinic_village_id}
                            onChange={(e) => handleRegisterInput(e)}
                            required
                            placeholder=""
                            className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                          >
                            <option className="">Select</option>
                            {villagesClinic?.map((obj) => {
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
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_village_id}</p>
                        </td>
                      </tr>
                      <tr className="text-gray-400 w-full">
                        <td className="py-2">Postal Code</td>
                        <td className=" "></td>
                        <td className="pl-4 ">
                          <input
                            type="number"
                            name="clinic_postal_code"
                            value={registerForm.clinic_postal_code || ""}
                            onChange={(e) => handleRegisterInput(e)}
                            required
                            className={` border-0 px-3 text-sm bg-zinc-800 rounded shadow w-full ease-linear transition-all duration-150`}
                          />
                          <p className="text-rose-400 font-normal text-xs">{registerFormError?.clinic_postal_code}</p>
                        </td>
                      </tr>
                      {/* <tr className="">
                          <td className="py-1 text-slate-200">~</td>
                        </tr> */}
                    </tbody>
                  </table>
                </div>

                <div className="text-center mt-8 w-1/2 mx-auto">
                  {verifyLoading ? (
                    <div
                      className="cursor-progress bg-zinc-700 text-white text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear"
                      disabled
                    >
                      Loading ...
                    </div>
                  ) : (
                    <button className="bg-emerald-600 text-white active:bg-emerald-700 text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150">
                      Verify Account
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
