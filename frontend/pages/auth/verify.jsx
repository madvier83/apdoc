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
  const [codes, setCodes] = useState([]);

  const initialVerifyForm = {
    email: "",
    email_token_verification: "",

    nik: "",
    name: "",
    owner_phone: "",
    birth_place: "",
    birth_date: "",
    gender: "",
    owner_address: "",

    clinic_name: "",
    clinic_address: "",
    province: "",
    city: "",
    district: "",
    postal_code: "",
    clinic_phone: "",
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

  async function handleVerify(e) {
    e.preventDefault();
    setVerifyLoading(true);
    try {
      const response = await axios.post("auth/registration", registerForm, {
        "Content-Type": "application/json",
      });
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

  // console.log(provinces)
  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (!registerForm.province) {
        setCities([]);
        return;
      }
      setRegisterForm({ city: "", districts: "", postal_code: "" });
      setCities([]);
      setDistricts([]);
      setCodes([]);
      getCities(registerForm.province);
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.province]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (!registerForm.city) {
        setDistricts([]);
        return;
      }
      setRegisterForm({ districts: "", postal_code: "" });
      setDistricts([]);
      setCodes([]);
      getDistricts(registerForm.city);
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.city]);

  useEffect(() => {
    const getData = setTimeout(() => {
      if (!registerForm.district) {
        setCodes([]);
        return;
      }
      setRegisterForm({ postal_code: "" });
      setCodes([]);
      getCodes(registerForm.district);
    }, 500);
    return () => clearTimeout(getData);
  }, [registerForm.district]);

  useEffect(() => {
    if (router.isReady) {
      setRegisterForm({
        email: router.query.email,
        email_token_verification: router.query.token,
      });
    }
  }, [router.isReady]);

  // console.log(registerForm)

  return (
    <>
      <AuthLayout title={"APDOC | Accunt Verification"}>
        <div className="container mx-auto px-4 h-[60vh]">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-8/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 -lg rounded-lg border-0">
                {/* <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="text-white text-4xl mt-4 font-bold">
                      APDOC
                    </h6>
                  </div>
                </div> */}

                <div className="flex-auto px-4 lg:px-10 py-10 pt-8 mt-16">
                  <form onSubmit={(e) => handleVerify(e)}>
                    <div className="flex w-full gap-8">
                      <div className="w-full">
                        <div className="relative flex py-5 items-center">
                          <span className="text-2xl font-semibold p-0 flex-shrink mr-4 text-white">
                            Personal Information
                          </span>
                        </div>
                        <div className="relative w-full">
                          <label className="block text-zinc-400 text-xs font-bold mb-2">
                            NIK
                          </label>
                          <input
                            required={true}
                            name="nik"
                            value={registerForm.nik}
                            onChange={(e) => handleRegisterInput(e)}
                            type="text"
                            className={`input w-full border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                              registerFormError.nik[0]
                                ? "border-rose-500"
                                : "border-indigo-500"
                            }`}
                            // placeholder="example@mail.com"
                          />
                          <label className="block text-rose-500 text-xs mb-2 mt-2">
                            {registerFormError.nik[0]}
                          </label>
                        </div>

                        <div className="relative w-full">
                          <label className="block text-zinc-400 text-xs font-bold mb-2">
                            Full Name
                          </label>
                          <input
                            required={true}
                            name="name"
                            value={registerForm.name}
                            onChange={(e) => handleRegisterInput(e)}
                            type="text"
                            className={`input w-full border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                              registerFormError.name[0]
                                ? "border-rose-500"
                                : "border-indigo-500"
                            }`}
                            // placeholder="example@mail.com"
                          />
                          <label className="block text-rose-500 text-xs mb-2 mt-2">
                            {registerFormError.name[0]}
                          </label>
                        </div>

                        <div className="relative w-full">
                          <label className="block text-zinc-400 text-xs font-bold mb-2">
                            Address
                          </label>
                          <textarea
                            name="owner_address"
                            value={registerForm.owner_address}
                            onChange={(e) => handleRegisterInput(e)}
                            type="text"
                            className={`input w-full h-[68px] border-indigo-500 border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                              registerFormError.owner_address[0]
                                ? "border-rose-500"
                                : "border-indigo-500"
                            }`}
                            // placeholder="+62 xxx xxxx xxxx"
                          />
                          <label className="block text-rose-500 text-xs mb-2 mt-2">
                            {registerFormError.owner_address[0]}
                          </label>
                        </div>

                        <div className="relative w-full">
                          <label className="block text-zinc-400 text-xs font-bold mb-2">
                            Phone
                          </label>
                          <div
                            className={`flex border rounded-sm ${
                              registerFormError.owner_phone[0]
                                ? "border-rose-500"
                                : "border-indigo-500"
                            }`}
                          >
                            <input
                              value={"+62"}
                              type="text"
                              className={`input w-14 rounded-none border-none border-opacity-50 border-2 bg-white bg-opacity-5 text-zinc-300 ${
                                registerFormError.clinic_phone
                                  ? "border-rose-500"
                                  : null
                              }`}
                              disabled
                            />
                            <input
                              required={true}
                              name="owner_phone"
                              value={registerForm.owner_phone}
                              onChange={(e) => handleRegisterInput(e)}
                              type="number"
                              className={`input pl-0 w-full border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                                registerFormError.owner_phone[0]
                                  ? "border-rose-500"
                                  : "border-none"
                              }`}
                              // placeholder="+62 xxx xxxx xxxx"
                            />
                          </div>
                          <label className="block text-rose-500 text-xs mb-2 mt-2">
                            {registerFormError.owner_phone[0]}
                          </label>
                        </div>

                        <div className="flex gap-4">
                          <div className="relative w-full">
                            <label className="block text-zinc-400 text-xs font-bold mb-2">
                              Birth Place
                            </label>
                            <input
                              required={true}
                              name="birth_place"
                              value={registerForm.birth_place}
                              onChange={(e) => handleRegisterInput(e)}
                              type="text"
                              className={`input w-full border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                                registerFormError.birth_place[0]
                                  ? "border-rose-500"
                                  : "border-indigo-500"
                              }`}
                              // placeholder="+62 xxx xxxx xxxx"
                            />
                            <label className="block text-rose-500 text-xs mb-2 mt-2">
                              {registerFormError.birth_place[0]}
                            </label>
                          </div>
                          <div className="relative w-full">
                            <label className="block text-zinc-400 text-xs font-bold mb-2">
                              Birth Date
                            </label>
                            <input
                              required={true}
                              name="birth_date"
                              value={registerForm.birth_date}
                              onChange={(e) => handleRegisterInput(e)}
                              type="date"
                              className={`input w-full border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                                registerFormError.birth_date[0]
                                  ? "border-rose-500"
                                  : "border-indigo-500"
                              }`}
                              // placeholder="+62 xxx xxxx xxxx"
                            />
                            <label className="block text-rose-500 text-xs mb-2 mt-2">
                              {registerFormError.birth_date[0]}
                            </label>
                          </div>
                        </div>

                        <div className="relative w-full">
                          <label className="block text-zinc-400 text-xs font-bold mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={registerForm.gender}
                            onChange={(e) => handleRegisterInput(e)}
                            type="date"
                            className={`input w-full border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                              registerFormError.gender[0]
                                ? "border-rose-500"
                                : "border-indigo-500"
                            }`}
                          >
                            <option className="text-black">Select</option>
                            <option className="text-black" value="male">
                              Male
                            </option>
                            <option className="text-black" value="female">
                              Female
                            </option>
                          </select>
                          <label className="block text-rose-500 text-xs mb-2 mt-2">
                            {registerFormError.gender[0]}
                          </label>
                        </div>
                      </div>

                      <div className="w-full">
                        <div className="relative flex py-5 items-center">
                          <span className="text-2xl font-semibold p-0 flex-shrink mr-4 text-white">
                            Clinic Information
                          </span>
                        </div>

                        <label className="block text-zinc-400 text-xs font-bold mb-2">
                          Clinic Name
                        </label>
                        <input
                          required={true}
                          name="clinic_name"
                          value={registerForm.clinic_name}
                          onChange={(e) => handleRegisterInput(e)}
                          type="text"
                          className={`input w-full border-emerald-500 border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                            registerFormError.clinic_name
                              ? "border-rose-500"
                              : null
                          }`}
                          // placeholder="example@mail.com"
                        />
                        <label className="block text-rose-500 text-xs mb-2 mt-2">
                          {registerFormError.clinic_name}
                        </label>

                        <label className="block text-zinc-400 text-xs font-bold mb-2">
                          Phone
                        </label>
                        <div
                          className={`flex border rounded-sm ${
                            registerFormError.owner_phone[0]
                              ? "border-rose-500"
                              : "border-emerald-500"
                          }`}
                        >
                          <input
                            value={"+62"}
                            type="text"
                            className={`input w-14 rounded-none border-none border-opacity-50 border-2 bg-white bg-opacity-5 text-zinc-300 ${
                              registerFormError.clinic_phone
                                ? "border-rose-500"
                                : null
                            }`}
                            disabled
                          />
                          <input
                            required={true}
                            name="clinic_phone"
                            value={registerForm.clinic_phone}
                            onChange={(e) => handleRegisterInput(e)}
                            type="number"
                            className={`input pl-0 w-full border-none border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                              registerFormError.clinic_phone
                                ? "border-rose-500"
                                : null
                            }`}
                            // placeholder="example@mail.com"
                          />
                        </div>
                        <label className="block text-rose-500 text-xs mb-2 mt-2">
                          {registerFormError.clinic_phone}
                        </label>

                        <label className="block text-zinc-400 text-xs font-bold mb-2">
                          Address
                        </label>
                        <textarea
                          name="clinic_address"
                          rows={2}
                          value={registerForm.clinic_address}
                          onChange={(e) => handleRegisterInput(e)}
                          type="text"
                          className={`input w-full h-[68px] border-emerald-500 border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                            registerFormError.clinic_address
                              ? "border-rose-500"
                              : null
                          }`}
                          // placeholder="example@mail.com"
                        />
                        <label className="block text-rose-500 text-xs mb-2 mt-2">
                          {registerFormError.clinic_address}
                        </label>

                        <div className="flex gap-4  ">
                          <div className="relative w-full">
                            <label className="block text-zinc-400 text-xs font-bold mb-2">
                              Province
                            </label>
                            <select
                              name="province"
                              value={registerForm.province}
                              onChange={(e) => handleRegisterInput(e)}
                              type="date"
                              className={`input w-full text-sm truncate pr-4 border-emerald-500 border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                                registerFormError.province
                                  ? "border-rose-500"
                                  : null
                              }`}
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
                            <label className="block text-rose-500 text-xs mb-2 mt-2">
                              {registerFormError.province}
                            </label>
                          </div>
                          <div className="relative w-full">
                            <label className="block text-zinc-400 text-xs font-bold mb-2">
                              City
                            </label>
                            <select
                              name="city"
                              value={registerForm.city}
                              onChange={(e) => handleRegisterInput(e)}
                              type="date"
                              className={`input w-full text-sm truncate pr-4 border-emerald-500 border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                                registerFormError.city
                                  ? "border-rose-500"
                                  : null
                              }`}
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
                            <label className="block text-rose-500 text-xs mb-2 mt-2">
                              {registerFormError.city}
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-4  ">
                          <div className="relative w-full">
                            <label className="block text-zinc-400 text-xs font-bold mb-2">
                              District
                            </label>
                            <select
                              name="district"
                              value={registerForm.district}
                              onChange={(e) => handleRegisterInput(e)}
                              type="date"
                              className={`input w-full text-sm truncate pr-4 border-emerald-500 border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                                registerFormError.district
                                  ? "border-rose-500"
                                  : null
                              }`}
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
                            <label className="block text-rose-500 text-xs mb-2 mt-2">
                              {registerFormError.district}
                            </label>
                          </div>
                          <div className="relative w-full">
                            <label className="block text-zinc-400 text-xs font-bold mb-2">
                              Postal Code
                            </label>
                            <select
                              name="postal_code"
                              value={registerForm.postal_code}
                              onChange={(e) => handleRegisterInput(e)}
                              type="date"
                              className={`input w-full text-sm truncate pr-4 border-emerald-500 border-opacity-50 border-2 bg-white bg-opacity-5 text-white ${
                                registerFormError.postal_code
                                  ? "border-rose-500"
                                  : null
                              }`}
                            >
                              <option className="text-black">Select</option>
                              {codes?.map((obj) => {
                                return (
                                  <option
                                    key={obj.id}
                                    className="text-black"
                                    value={obj.id}
                                  >
                                    {obj.district_code + " : " + obj.name}
                                  </option>
                                );
                              })}
                            </select>
                            <label className="block text-rose-500 text-xs mb-2 mt-2">
                              {registerFormError.postal_code}
                            </label>
                          </div>
                        </div>
                      </div>
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
              <div className="flex flex-wrap mt-6 relative justify-center"></div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
