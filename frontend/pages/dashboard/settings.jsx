import { deleteCookie, getCookie } from "cookies-next";
import React, { useEffect, useReducer, useRef, useState } from "react";
import jwt_decode from "jwt-decode";

import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import axios from "../api/axios";
import moment from "moment";
import numeral, { Numeral } from "numeral";
import ReactToPrint from "react-to-print";

export default function Settings() {
  const token = getCookie("token");
  const settingsFormRef = useRef();
  const structRef = useRef();

  const [isEditSettings, setIsEditSettings] = useState(false);

  const [settings, setSettings] = useState();
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format("h:mm:ss A"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const initialForm = {
    id: null,
    logo: null,
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    clinic_id: null,
    created_at: "",
    updated_at: "",
  };
  const [settingsForm, setSettingsForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialForm
  );
  const [settingsFormError, setSettingsFormError] = useState(initialForm);

  const handleSettingsForm = (event) => {
    const { name, value } = event.target;
    setSettingsForm({ [name]: value });
  };

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    // const objectUrl = URL.createObjectURL(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  async function getSettings() {
    setSettingsLoading(true);
    try {
      const response = await axios.get(`/setting/1`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setSettings(response.data);
      setSettingsForm(response.data);
      setSettingsLoading(false);
      // console.log(settings);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getSettings();
  }, []);
  useEffect(() => {
    setSettingsFormError(initialForm);
    setPreview(null)
    setSelectedFile(null)
  }, [isEditSettings]);

  async function updateSettings(e) {
    e.preventDefault();

    let formData = new FormData();
    selectedFile && formData.append("logo", selectedFile);
    formData.append("name", settingsForm.name);
    formData.append("phone", settingsForm.phone);
    formData.append("address", settingsForm.address);
    formData.append("city", settingsForm.city);
    formData.append("country", settingsForm.country);
    formData.append("postal_code", settingsForm.postal_code);
    // Object.keys(settingsForm).forEach((key) =>
    //   formData.append(key, settingsForm[key])
    // );
    // console.log(formData);
    // console.log(selectedFile);
    // for (var key of formData.entries()) {
    //   console.log(key[0] + ", " + key[1]);
    // }

    try {
      // console.log(settingsForm);
      const response = await axios.post(`setting`, formData, {
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer" + token,
        },
      });
      setIsEditSettings(false);
      getSettings();
    } catch (err) {
      setSettingsFormError(err.response?.data);
      console.log(err);
    }
  }

  return (
    <>
      <DashboardLayout title="Settings" headerStats={false}>
        <div className="flex flex-row mt-6 gap-4">
          <div className="w-full lg:w-8/12 mt-1">
            <form onSubmit={(e) => updateSettings(e)}>
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-md bg-blueGray-100 border-0">
                {/* Personal detail form */}
                <div className="rounded-t-md bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      Recipient Setting
                    </h6>
                    <div className="flex">
                      <div
                        className={`${
                          isEditSettings
                            ? "bg-rose-500 active:bg-rose-400"
                            : "bg-indigo-500 active:bg-indigo-400"
                        } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 cursor-pointer`}
                        onClick={() => {
                          setIsEditSettings((prev) => {
                            return !prev;
                          });
                          setTimeout(() => settingsFormRef.current.focus(), 10);
                          getSettings();
                          // console.log(settingForm);
                        }}
                      >
                        {isEditSettings ? "Cancel" : "Edit"}{" "}
                        <i
                          className={`fas ${
                            isEditSettings ? "fa-x" : "fa-edit"
                          } ml-2`}
                        ></i>
                      </div>
                      {isEditSettings ? (
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
                    <div className="w-full px-4 mt-8">
                      <div className="relative w-full mb-3">
                        <div className="w-full gap-8">
                          <div className="w-full">
                            <label className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between">
                              <span>Logo</span>
                            </label>
                            <input
                              type="file"
                              name="logo"
                              accept="image/*"
                              onChange={onSelectFile}
                              disabled={!isEditSettings}
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                          </div>
                          <label className="">
                            <span className="label-text-alt text-rose-300">
                              {settingsFormError?.logo}
                            </span>
                          </label>
                        </div>
                      </div>
                      <hr className="mt-6 border-b-1 border-blueGray-300 py-4" />
                      <div className="relative w-full mb-3">
                        <label className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between">
                          <span>Clinic Name</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={settingsForm.name}
                            onChange={(e) => handleSettingsForm(e)}
                            disabled={!isEditSettings}
                            ref={settingsFormRef}
                          />
                          <label className="">
                            <span className="label-text-alt text-rose-300">
                              {settingsFormError?.name}
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="relative w-full mb-3">
                        <label className="uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center justify-between">
                          <span>Phone Number</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="phone"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={settingsForm.phone}
                            onChange={(e) => handleSettingsForm(e)}
                            disabled={!isEditSettings}
                          />
                          <label className="">
                            <span className="label-text-alt text-rose-300">
                              {settingsFormError?.phone}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="mt-6 border-b-1 border-blueGray-300 py-4" />

                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={settingsForm.address}
                          onChange={(e) => handleSettingsForm(e)}
                          disabled={!isEditSettings}
                        />
                        <label className="">
                          <span className="label-text-alt text-rose-300">
                            {settingsFormError?.address}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={settingsForm.city}
                          onChange={(e) => handleSettingsForm(e)}
                          disabled={!isEditSettings}
                        />
                        <label className="">
                          <span className="label-text-alt text-rose-300">
                            {settingsFormError?.city}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={settingsForm.country}
                          onChange={(e) => handleSettingsForm(e)}
                          disabled={!isEditSettings}
                        />
                        <label className="">
                          <span className="label-text-alt text-rose-300">
                            {settingsFormError?.country}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={settingsForm.postal_code}
                          onChange={(e) => handleSettingsForm(e)}
                          disabled={!isEditSettings}
                        />
                        <label className="">
                          <span className="label-text-alt text-rose-300">
                            {settingsFormError?.postal_code}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="relative flex flex-col min-w-0 break-words mb-6 mt-1 w-full max-w-sm">
            <img src="/jagged2.svg" className="rotate-180"></img>
            <div
              ref={structRef}
              className="px-6 pb-2 h-full bg-[#fff] tracking- font-mono overflow-hidden"
            >
              <div className="flex justify-center items-center flex-col">
                {selectedFile ? (
                  <img
                    src={preview}
                    className="max-h-28 max-w-sm grayscale mb-1 mt-2"
                  />
                ) : (
                  <React.Fragment>
                    {settingsForm.logo ? (
                      <img
                        src={"http://localhost:8000/" + settingsForm.logo}
                        className="max-h-28 max-w-sm grayscale mb-1 mt-2"
                      />
                    ) : (
                      <img
                        src={"/apdocLogo.png"}
                        className="max-h-28 max-w-sm grayscale mb-1 mt-2"
                      />
                    )}
                  </React.Fragment>
                )}
                <div className="font-bold text-xl">{settingsForm.name}</div>
                <div className="text-xs text-center mt-1">
                  {settingsForm.address}, {settingsForm.city},{" "}
                  {settingsForm.country}, {settingsForm.postal_code}
                </div>
                <div className="text-xs mt-1">
                  <i className="fa-brands fa-whatsapp mr-1"></i>
                  {settingsForm.phone}
                </div>
                <div className="border-t w-full border-dashed my-3 border-t-slate-500"></div>
                <div className="flex w-full justify-between items-center">
                  <small>{moment().format("MMMM Do YYYY")}</small>
                  <small>{time}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                  <small>Receipt Number</small>
                  <small>APDOC0216230001</small>
                </div>
                <div className="flex w-full justify-between items-center">
                  <small>Customer</small>
                  <small>Jane Doe</small>
                </div>
                <div className="flex w-full justify-between items-center">
                  <small>Served by</small>
                  <small>John Doe</small>
                </div>
                <div className="border-t w-full border-dashed my-3 border-t-slate-500"></div>
                <div className="flex w-full justify-between items-center">
                  <small className="font-semibold">Item 001 <span className="font-normal">#33,300 x30</span></small>
                  <small className="font-semibold">{numeral("999000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                  <small>⤷ Discount Item 001</small>
                  <small>({numeral("99000").format("0,0")})</small>
                </div>
                <div className="border-t w-full border-dashed my-3 border-t-slate-500"></div>
                <div className="flex w-full justify-between items-center">
                  <small>Subtotal</small>
                  <small>{numeral("999000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                  <small>Total discount</small>
                  <small>({numeral("99000").format("0,0")})</small>
                </div>
                <div className="border-t w-full border-dashed my-3 border-t-slate-500"></div>
                <div className="flex w-full justify-between items-center font-bold text-lg">
                  <small>Total</small>
                  <small>{numeral("900000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                  <small>Cash</small>
                  <small>{numeral("900000").format("0,0")}</small>
                </div>
                <div className="flex w-full justify-between items-center">
                  <small>Change</small>
                  <small>{numeral("0").format("0,0")}</small>
                </div>
                <div className="border-t w-full border-dashed my-2 border-t-slate-500"></div>
                <h1 className="font-bold">Terima Kasih</h1>
                <div className="border-t w-full border-dashed my-2 border-t-slate-500"></div>
              </div>
            </div>
            <img src="/jagged2.svg" className=""></img>
            <ReactToPrint
              trigger={() => (
                <button className="btn outline-none bg-rose-500 text-white mt-3 ">
                  Test print <i className="fas fa-print ml-2"></i>
                </button>
              )}
              content={() => structRef.current}
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
