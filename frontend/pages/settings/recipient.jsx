import { deleteCookie, getCookie } from "cookies-next";
import React, { useEffect, useReducer, useRef, useState } from "react";
import jwt_decode from "jwt-decode";

import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import axios from "../api/axios";
import moment from "moment";
import numeral, { Numeral } from "numeral";
import ReactToPrint from "react-to-print";
import { GetCookieChunk } from "../../services/CookieChunk";

export default function Settings() {
  const token = GetCookieChunk("token_");
  const settingsFormRef = useRef();
  const structRef = useRef();
  const logoRef = useRef();

  const [clinic, setClinic] = useState();
  const [payload, setPayload] = useState({});

  const [isEditSettings, setIsEditSettings] = useState(false);

  const [settings, setSettings] = useState();
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      // setTime(moment().format("h:mm:ss A"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const initialForm = {
    id: null,
    logo: null,
    name: "",
    phone: "",
    address: "",
    city_id: "",
    province_id: "",
    village_id: "",
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
    if (!clinic) {
      return;
    }
    setSettingsLoading(true);
    try {
      const response = await axios.get(`/setting/${clinic && clinic}/clinic`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      // console.log(response.data);
      setSettings(response.data);
      setSettingsForm({
        ...response.data,
        province_id: response.data.province_id,
        district_id: response.data.district_id,
        city_id: response.data.city_id,
        village_id: response.data.village_id,
      });
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
    setPreview(null);
    setSelectedFile(null);
  }, [isEditSettings]);

  async function updateSettings(e) {
    e.preventDefault();

    let formData = new FormData();
    selectedFile && formData.append("logo", selectedFile);
    formData.append("name", settingsForm.name);
    formData.append("phone", settingsForm.phone);
    formData.append("address", settingsForm.address);
    formData.append("district_id", settingsForm.district_id);
    formData.append("province_id", settingsForm.province_id);
    formData.append("city_id", settingsForm.city_id);
    formData.append("village_id", settingsForm.village_id);
    formData.append("rt", settingsForm.rt);
    formData.append("rw", settingsForm.rw);
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
      const response = await axios.post(
        `setting/${settingsForm.id}`,
        formData,
        {
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setIsEditSettings(false);
      getSettings();
    } catch (err) {
      setSettingsFormError(err.response?.data);
      console.log(err);
    }
  }

  useEffect(() => {
    getSettings();
    setIsEditSettings(false);
  }, [clinic]);

  // console.log(settingsForm)

  return (
    <>
      <DashboardLayout title="Pengaturan" clinic={clinic} setClinic={setClinic}>
        <div className="flex flex-row mt-8 gap-4">
          <div className="w-full lg:w-8/12">
            <form onSubmit={(e) => updateSettings(e)}>
              <div className="relative flex flex-col min-w-0 break-words w-full min-h-[88vh] mb-6 shadow-lg rounded-md bg-gray-900 border-0">
                {/* Personal detail form */}
                <div className="rounded-t-md bg-gray-900 text-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between border-b-gray-700 border-dotted border-b-2 pb-4">
                    <h6 className="text-xl font-bold">Struk</h6>
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
                          // setTimeout(() => settingsFormRef.current.focus(), 10);
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
                          Simpan
                          <i className={`fas fa-save ml-2`}></i>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-auto px-4 pt-0">
                  <div className="flex flex-wrap">
                    <div className="w-full">
                      <div className="relative w-full hidden">
                        <div className="w-full gap-8">
                          <div className="w-full">
                            <label className="normal-case text-gray-400 text-xs font-bold mb-2 flex items-center justify-between">
                              <span>Logo</span>
                            </label>
                            <input
                              ref={logoRef}
                              type="file"
                              name="logo"
                              accept="image/*"
                              onChange={onSelectFile}
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

                      <div className={`${isEditSettings ? "hidden" : "block"}`}>
                        <table className="mx-8 text-sm w-11/12">
                          <tbody>
                            <tr className="text-white">
                              <td className=" font-semibold text-lg w-1/4 align-top">
                                Logo
                              </td>
                              <td className="px-4 "></td>
                              <td className="pl-4 text-lg tracking-wider">
                                {selectedFile ? (
                                  <img
                                    src={preview}
                                    className="max-h-28 max-w-sm grayscale mb-1 mt-2"
                                  />
                                ) : (
                                  <React.Fragment>
                                    {settingsForm.logo ? (
                                      <img
                                        src={
                                          process.env.NEXT_PUBLIC_SERVER_URL +
                                          settingsForm.logo
                                        }
                                        className="max-h-28 min-w-[32px] max-w-sm mb-1 border border-zinc-600 rounded-lg border-dashed"
                                      />
                                    ) : (
                                      <img
                                        src={"/apdocLogo.png"}
                                        className="max-h-28 min-w-[32px] max-w-sm mb-1 border border-zinc-600 rounded-lg border-dashed"
                                      />
                                    )}
                                  </React.Fragment>
                                )}
                              </td>
                            </tr>
                            <tr className="text-white">
                              <td className="py-[9.1px] font-semibold text-lg w-1/4">
                                Nama
                              </td>
                              <td className="px-4 "></td>
                              <td className="px-4 text-lg tracking-wider">
                                {settingsForm?.name}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">No telepon</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settingsForm?.phone || "-"}
                              </td>
                            </tr>
                            <tr className="">
                              <td className="py-1 text-slate-300">~</td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Alamat</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settingsForm?.address || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">RT/RW</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settingsForm?.rt + " / " + settingsForm?.rw}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Desa</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settings?.village?.name || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Kecamatan</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settings?.district?.name || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Kabupaten/Kota</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settings?.city?.name || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Provinsi</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settings?.province?.name || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Kode pos</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settingsForm?.postal_code || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]"></td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                <div className="">
                                  <ReactToPrint
                                    trigger={() => (
                                      <div className="btn outline-none w-full text-white mt-4">
                                        Tes print{" "}
                                        <i className="fas fa-print ml-2"></i>
                                      </div>
                                    )}
                                    content={() => structRef.current}
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                        className={`${!isEditSettings ? "hidden" : "block"}`}
                      >
                        <table className="mx-8 text-sm w-11/12">
                          <tbody>
                            <tr className="text-white">
                              <td className=" font-semibold text-lg w-1/4 align-top">
                                Logo
                              </td>
                              <td className="px-4 "></td>
                              <td className=" pl-4 text-lg tracking-wider flex gap-4">
                                {selectedFile ? (
                                  <img
                                    src={preview}
                                    className="max-h-28 max-w-sm mb-1 overflow-hidden cursor-pointer"
                                  />
                                ) : (
                                  <React.Fragment>
                                    {settingsForm.logo ? (
                                      <img
                                        onClick={() => logoRef.current.click()}
                                        src={
                                          process.env.NEXT_PUBLIC_SERVER_URL +
                                          settingsForm.logo
                                        }
                                        className="max-h-28 max-w-sm mb-1 bg-slate-800 rounded-lg overflow-hidden cursor-pointer"
                                      />
                                    ) : (
                                      <img
                                        src={"/apdocLogo.png"}
                                        className="max-h-28 max-w-sm mb-1 bg-slate-800 rounded-lg overflow-hidden"
                                      />
                                    )}
                                  </React.Fragment>
                                )}
                                <i
                                  className="fas fa-edit mt-2 text-slate-300"
                                  onClick={() => logoRef.current.click()}
                                ></i>
                              </td>
                            </tr>
                            <tr className="text-white">
                              <td className="py-[9.1px] font-semibold text-lg w-1/4">
                                Nama
                              </td>
                              <td className="px-4 "></td>
                              <td className="px-4 text-lg tracking-wider">
                                <input
                                  ref={settingsFormRef}
                                  type="text"
                                  name="name"
                                  value={settingsForm.name || ""}
                                  disabled={!isEditSettings}
                                  onChange={(e) => handleSettingsForm(e)}
                                  required
                                  className={`${
                                    isEditSettings
                                      ? "bg-slate-800"
                                      : "bg-zinc-100"
                                  } border-0 px-3 text-lg placeholder-blueGray-300 text-white rounded shadow w-full ease-linear transition-all duration-150`}
                                />
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">No telepon</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                <input
                                  type="text"
                                  name="phone"
                                  value={settingsForm.phone || ""}
                                  disabled={!isEditSettings}
                                  onChange={(e) => handleSettingsForm(e)}
                                  required
                                  className={`${
                                    isEditSettings
                                      ? "bg-slate-800"
                                      : "bg-zinc-100"
                                  } border-0 px-3 text-sm placeholder-blueGray-300 text-slate-300 rounded shadow w-full ease-linear transition-all duration-150`}
                                />
                              </td>
                            </tr>
                            <tr className="">
                              <td className="py-1 text-slate-300">~</td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Alamat</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settingsForm?.address || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">RT/RW</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settingsForm?.rt + " / " + settingsForm?.rw}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Desa</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settings?.village?.name || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Kecamatan</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settings?.district?.name || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Kabupaten/Kota</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settings?.city?.name || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Provinsi</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settings?.province?.name || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]">Kode pos</td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                {settingsForm?.postal_code || "-"}
                              </td>
                            </tr>
                            <tr className="text-gray-400 w-full">
                              <td className="py-[9.1px]"></td>
                              <td className="px-4 "></td>
                              <td className="px-4 ">
                                <div className="">
                                  <ReactToPrint
                                    trigger={() => (
                                      <div className="btn outline-none w-full text-white mt-4">
                                        Tes Print{" "}
                                        <i className="fas fa-print ml-2"></i>
                                      </div>
                                    )}
                                    content={() => structRef.current}
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="relative flex flex-col min-w-0 break-words mb-6 w-full max-w-sm bg-gray-900 p-8 rounded-md">
            <img src="/jagged2.svg" className="rotate-180"></img>
            <div
              ref={structRef}
              className="px-6 pb-2 h-full bg-white tracking- font-mono overflow-hidden"
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
                        src={
                          process.env.NEXT_PUBLIC_SERVER_URL + settingsForm.logo
                        }
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
                <div className="text-xs text-center mt-1 uppercase">
                  {settingsForm.address}, RT {settingsForm?.rt}, RW{" "}
                  {settingsForm?.rw}, {settingsForm.district?.name},{" "}
                  {settingsForm.city?.name}, {settingsForm.village?.name},{" "}
                  {settingsForm.postal_code}
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
                  <small className="font-semibold">
                    Item 001 <span className="font-normal">#33,300 x30</span>
                  </small>
                  <small className="font-semibold">
                    {numeral("999000").format("0,0")}
                  </small>
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
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
