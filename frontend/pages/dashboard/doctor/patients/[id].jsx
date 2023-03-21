import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../../api/axios";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import ModalBox from "../../../../components/Modals/ModalBox";
import ModalDelete from "../../../../components/Modals/ModalDelete";
import { Chart } from "react-google-charts";
import { MultiSelect } from "react-multi-select-component";
import { useRouter } from "next/router";

export default function Patients() {
  const token = getCookies("token");
  const router = useRouter();
  const [patientId, setPatientId] = useState(null);

  const addModalRef = useRef();
  const addFileModalRef = useRef();
  const putModalRef = useRef();
  const detailModalRef = useRef();

  const [isRecord, setIsRecord] = useState(true);
  const [isGrowth, setIsGrowth] = useState(false);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [record, setRecord] = useState([]);
  const [recordLoading, setRecordLoading] = useState(true);
  const [patient, setPatient] = useState([]);
  const [patientLoading, setPatientLoading] = useState(true);
  const [diagsosis, setDiagnosis] = useState([]);
  const [diagsosisLoading, setDiagnosisLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const initialRecordForm = {
    id: "",
    patient_id: "",
    // height: "",
    // weight: "",
    diagnoses: [],
    complaint: "",
    inspection: "",
    therapy: "",
    // files: [],
  };
  const [selectedPatient, setSelectedPatient] = useState(initialRecordForm);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRecordForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRecordForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRecordForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRecordForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getPatient() {
    setRecordLoading(true);
    try {
      const response = await axios.get(`/patient/${router.query.id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setSelectedPatient(response.data);
      setPatientLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getRecord() {
    setRecordLoading(true);
    try {
      const response = await axios.get(`/record/${router.query.id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      setRecord(response.data);
      setRecordLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getDiagnosis() {
    try {
      const response = await axios.get(`/diagnoses`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      const data = response?.data?.map((obj) => {
        return {
          label: obj.code,
          value: obj.id,
        };
      });
      // console.log(data);
      setDiagnosis(data);
      setDiagnosisLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addRecord(e) {
    e.preventDefault();
    let formData = new FormData();
    // files.length > 0 && formData.append("files", files[0]);
    formData.append("patient_id", addForm.patient_id);
    formData.append("complaint", addForm.complaint);
    formData.append("inspection", addForm.inspection);
    formData.append("therapy", addForm.therapy);
    formData.append(`diagnoses`, JSON.stringify(addForm.diagnoses));

    // for (var key of formData.entries()) {
    //   console.log(key[0] + ", " + key[1]);
    // }

    try {
      const response = await axios.post(`/record`, formData, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "multipart/form-data",
        },
      });
      addModalRef.current.click();
      // setFiles([]);
      getRecord();
      setAddForm(initialRecordForm);
      setAddForm({ patient_id: selectedPatient.id });
      setAddFormError(initialRecordForm);
    } catch (err) {
      console.error(err);
      setAddFormError(initialRecordForm);
      setAddFormError(err.response?.data);
    }
  }

  async function addFile(e, id) {
    e.preventDefault();
    let formData = new FormData();
    files.length > 0 && formData.append("files", files[0]);

    try {
      const response = await axios.post(`/record-image/${id}`, formData, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "multipart/form-data",
        },
      });
      addFileModalRef.current.click();
      getRecord();
      e.target.value = null;
    } catch (err) {
      console.error(err);
      setAddFormError(err.response?.data);
    }
  }

  async function deleteFile(id) {
    try {
      const response = await axios.delete(`/record-image/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "multipart/form-data",
        },
      });
      getRecord();
      setFiles([]);
    } catch (err) {
      console.error(err);
      setAddFormError(err.response?.data);
    }
  }

  async function putRecord(e) {
    setPutForm({ patient_id: selectedPatient.id });
    e.preventDefault();
    let formData = new FormData();
    files.length > 0 && formData.append("files", files[0]);
    formData.append("patient_id", putForm.patient_id);
    formData.append("complaint", putForm.complaint);
    formData.append("inspection", putForm.inspection);
    formData.append("therapy", putForm.therapy);
    formData.append(`diagnoses`, JSON.stringify(putForm.diagnoses));

    try {
      const response = await axios.post(`/record/${putForm.id}`, formData, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "multipart/form-data",
        },
      });
      putModalRef.current.click();
      setFiles([]);
      getRecord();
      setPutForm({ patient_id: selectedPatient.id });
      setPutForm(initialRecordForm);
      setPutFormError(initialRecordForm);
    } catch (err) {
      console.error(err);
      setPutFormError(initialRecordForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteRecord(id) {
    try {
      const response = await axios.delete(`/record/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getRecord();
    } catch (err) {
      console.error(err);
    }
  }

  function putSelectedDiagnosis(obj) {
    let data = obj.record_diagnoses?.map((obj) => {
      return { label: obj.diagnose?.code, value: obj.diagnose?.id };
    });
    setSelectedDiagnosis(data);
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFiles([]);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setFiles(e.target.files);
  };

  useEffect(() => {
    if (router.isReady) {
      getPatient();
      getRecord();
      getDiagnosis();
    }
  }, [router.isReady]);

  useEffect(() => {
    // selectedPatient.id && getRecord();
    setAddForm({ patient_id: selectedPatient.id });
    setPutForm({ patient_id: selectedPatient.id });
  }, [selectedPatient]);

  useEffect(() => {
    let data = selectedDiagnosis.map((obj) => {
      return obj.value;
    });
    setAddForm({ diagnoses: data });
    setPutForm({ diagnoses: data });
  }, [selectedDiagnosis]);

  return (
    <>
      <DashboardLayout title="Patient Records">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700"
          }
        >
          <div className="flex flex-row gap-4">
            <div className="w-full">
              <div
                className={
                  "relative flex flex-col min-w-0 break-words w-full min-h-fit h-full text-blueGray-700 rounded-md"
                }
              >
                <div className="flex gap-4">
                  <div className="p-8 rounded-md bg-white w-1/3">
                    <h2 className="card-title text-base font-semibold lg:text-2xl text-zinc-900 truncate">
                      {/* <i className="fa-solid fa-user mr-1"></i>{" "} */}
                      {selectedPatient?.name}
                      {/* {selectedPatient?.gender == "male" ? (
                          <i className="fas fa-mars z-10 text-xl ml-1 text-blue-400"></i>
                        ) : (
                          <i className="fas fa-venus z-10 text-xl ml-1 text-rose-400"></i>
                        )} */}
                    </h2>
                    <small className="text-zinc-400">
                      NIK: {selectedPatient?.nik} | Gender:{" "}
                      {selectedPatient?.gender}
                    </small>
                    <div className="border-t border-dashed my-3"></div>
                    <div className="mb-4">
                      <small className="text-zinc-400">Phone</small> <br />
                      <span className="font-sm text-zinc-800 line-clamp-2">
                        <a
                          href={`https://wa.me/${selectedPatient?.phone?.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          className={""}
                        >
                          {selectedPatient?.phone}
                          <i className="fa-brands fa-whatsapp text-zinc-300 ml-1"></i>
                        </a>
                      </span>
                    </div>
                    <small className="text-zinc-400">Date of birth</small>{" "}
                    <br />
                    <span className="font-sm text-zinc-800">
                      {selectedPatient?.birth_place +
                        ", " +
                        moment(selectedPatient?.birth_date).format(
                          "DD MMMM YYYY"
                        )}
                    </span>
                    <div className="mt-4">
                      <small className="text-zinc-400">Address</small> <br />
                      <span className="font-sm text-zinc-800 line-clamp-2">
                        {selectedPatient?.address}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 rounded-md bg-white w-2/3">
                    <div className="flex justify-between items-center">
                      <small className="text-2xl font-semibold">
                        Height & weight
                      </small>{" "}
                      <div className="flex gap-1">
                        <div
                          className="btn btn-xs btn-ghost bg-zinc-200 text-zinc-500 font-bold"
                          onClick={() => setIsGrowth((prev) => !prev)}
                        >
                          Edit <i className="fas fa-edit ml-1"></i>
                        </div>
                        <div
                          className="btn btn-xs btn-primary font-bold"
                          onClick={() => setIsGrowth((prev) => !prev)}
                        >
                          Add <i className="fas fa-plus ml-1"></i>
                        </div>
                      </div>
                    </div>
                    <div className="my-3"></div>
                    {isGrowth ? (
                      <div className="flex"></div>
                    ) : (
                      <div className="mt-4 w-full">
                        <Chart
                          chartType="LineChart"
                          data={[
                            [
                              "Patient",
                              "Height",
                              { role: "annotation" },

                              "Weight",
                              { role: "annotation" },
                            ],
                            ["20 Jan 2023", 169, "169", 55, "55"],
                            ["22 Jan 2023", 171, "171", 55, "55"],
                            ["28 Jan 2023", 171, "171", 54, "54"],
                            ["20 Feb 2023", 172, "172", 52, "52"],
                            ["27 Feb 2023", 174, "174", 50, "50"],
                          ]}
                          options={{
                            legend: { position: "top", alignment: "end" },
                            chartArea: { width: "90%", height: "80%" },
                            bar: { groupWidth: "50%" },
                            annotations: {
                              textStyle: {
                                fontSize: 16,
                                color: "black",
                              },
                            },
                            lineWidth: 2,
                            backgroundColor: { fill: "transparent" },
                            pointSize: 10,
                            pointShape: "diamond",
                            lineDashStyle: [14, 2, 7, 2],
                            colors: ["#f43f5e", "#6366f1"],
                          }}
                          width={"100%"}
                          height={"240px"}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-md mt-4 bg-white px-4 py-4 border-0 mb-8">
                  <div className="flex items-center justify-between pb-4">
                    <div className="relative w-full px-4 max-w-full">
                      <h1 className="text-2xl font-semibold">
                        <i className="fa-solid fa-heart-pulse mr-1"></i> Records
                      </h1>
                    </div>
                    <div className="relative w-full px-4 max-w-full text-right">
                      <label
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        htmlFor="modal-add"
                        onClick={() => setSelectedDiagnosis([])}
                      >
                        Add record <i className="fas fa-add"></i>
                      </label>
                      <button
                        className="bg-rose-400 text-white active:bg-rose-400 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => router.back()}
                      >
                        Back <i className="fas fa-arrow-left"></i>
                      </button>
                    </div>
                  </div>
                  {recordLoading && (
                    <div className="flex w-full justify-center my-4">
                      <img src="/loading.svg" alt="now loading" />
                    </div>
                  )}
                  {!recordLoading && record?.length <= 0 && (
                    <div className="flex w-full justify-center my-16">
                      <h1 className="text-zinc-400">No Record</h1>
                    </div>
                  )}
                  <div className="flex flex-col ml-4">
                    {!recordLoading &&
                      record?.map((obj) => {
                        return (
                          <div
                            className={`${obj.is_delete != 0 && "hidden"}`}
                            key={obj.id}
                          >
                            <div className="border-t border-dashed"></div>
                            <div className="card-body pr-6 pl-0 pt-4 pb-2">
                              <div className="flex">
                                <div className="flex items-center">
                                  <span className="font-semibold text-xl">
                                    {moment(obj.created_at).format(
                                      "dddd, DD MMMM YYYY, h:mm A"
                                    )}
                                  </span>
                                  <span className="text-xs ml-2 mt-2">
                                    ({moment(obj.created_at).fromNow()})
                                  </span>
                                </div>
                                <div className="dropdown dropdown-end ml-auto rounded-md">
                                  <label
                                    tabIndex={0}
                                    className="btn btn-ghost btn-sm m-1"
                                  >
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                  </label>
                                  <ul
                                    tabIndex={0}
                                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-md w-32"
                                  >
                                    <label
                                      className="btn btn-sm flex justify-between  btn-ghost font-semibold rounded-md"
                                      htmlFor="modal-put"
                                      onClick={() => {
                                        putSelectedDiagnosis(obj);
                                        setPutForm(obj);
                                      }}
                                    >
                                      Edit <i className="fas fa-edit ml-2"></i>
                                    </label>
                                    <label
                                      className="btn btn-sm flex justify-between  btn-ghost font-semibold rounded-md"
                                      htmlFor={obj.id}
                                    >
                                      Delete{" "}
                                      <i className="fas fa-trash ml-2"></i>
                                    </label>
                                  </ul>
                                </div>
                              </div>
                              <ModalDelete
                                id={obj.id}
                                callback={() => deleteRecord(obj.id)}
                                title={`Delete Record ${moment(
                                  obj.created_at
                                ).format("DD MMMM YYYY")}?`}
                              ></ModalDelete>
                              <table className="">
                                <tbody>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Complaint</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">{obj.complaint}</td>
                                  </tr>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Inspection</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">{obj.inspection}</td>
                                  </tr>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Diagnoses</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">
                                      {obj.record_diagnoses?.length > 0 ? (
                                        obj.record_diagnoses.map((obj) => {
                                          return (
                                            <p className="" key={obj.id}>
                                              {obj.diagnose.code} -{" "}
                                              {obj.diagnose.description}
                                            </p>
                                          );
                                        })
                                      ) : (
                                        <p>-</p>
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Therapy</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">{obj.therapy}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="text-zinc-500 text-sm ml-[2px]">
                              Files
                            </div>
                            <div className="flex gap-2 mb-4">
                              {obj.record_files?.length > 0 &&
                                obj.record_files?.map((obj) => {
                                  return (
                                    <React.Fragment key={obj.id}>
                                      <label className="relative group">
                                        <div className="rounded-md group-hover:brightness-[.3] duration-300 overflow-hidden bg-white border border-gray-400 w-28 h-28 my-4">
                                          <img
                                            className="object-cover grayscale opacity-80"
                                            src={`http://localhost:8000/${obj.file}`}
                                            alt=""
                                          />
                                        </div>
                                        <div className="absolute opacity-0 group-hover:opacity-100 duration-300 top-[35%] left-[11%]">
                                          <div className="flex">
                                            <label
                                              htmlFor={"fileNo" + obj.id}
                                              className="btn btn-sm w-10 h-10 px-0 py-0 bg-rose-400 border-none"
                                            >
                                              <i className="fas fa-trash text-sm"></i>
                                            </label>
                                            <label
                                              htmlFor={`filePreview` + obj.id}
                                              className="btn btn-sm w-10 h-10 px-0 py-0 ml-2 bg-indigo-500 border-none"
                                            >
                                              <i className="fas fa-eye text-sm"></i>
                                            </label>
                                          </div>
                                        </div>
                                      </label>
                                      <ModalDelete
                                        id={"fileNo" + obj.id}
                                        callback={() => deleteFile(obj.id)}
                                        title={`Delete File?`}
                                      ></ModalDelete>
                                      <ModalBox id={`filePreview` + obj.id}>
                                        <img
                                          src={`http://localhost:8000/${obj.file}`}
                                          alt=""
                                        />
                                        <div className="modal-action pt-0 mt-0">
                                          <label
                                            className="btn mt-2"
                                            htmlFor={`filePreview` + obj.id}
                                          >
                                            Close
                                          </label>
                                        </div>
                                      </ModalBox>
                                    </React.Fragment>
                                  );
                                })}
                              <label
                                htmlFor="modal-add-files"
                                onClick={() => setPutForm(obj)}
                              >
                                <div className="btn flex items-center justify-center rounded-md overflow-hidden border border-gray-400 border-dashed bg-gray-50 text-gray-500 w-28 bg-cover h-28 my-4">
                                  <i className="fas fa-plus"></i>
                                </div>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Add Record</h3>
          <form onSubmit={(e) => addRecord(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Complaint</span>
              </label>
              <textarea
                type="text"
                name="complaint"
                value={addForm.complaint}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.complaint && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.complaint}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Inspeciton</span>
              </label>
              <textarea
                type="text"
                name="inspection"
                value={addForm.inspection}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.inspection && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.inspection}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Diagnosa</span>
              </label>
              {/* <pre>{JSON.stringify(selectedDiagnosis)}</pre> */}
              {/* <p>{JSON.stringify(selectedDiagnosis)}</p> */}
              <MultiSelect
                options={diagsosis || []}
                value={selectedDiagnosis}
                onChange={setSelectedDiagnosis}
                hasSelectAll={false}
              />
              <label className="label">
                <span className="label-text">Therapy</span>
              </label>
              <textarea
                type="text"
                name="therapy"
                value={addForm.therapy}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.therapy && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.therapy}
                  </span>
                </label>
              )}

              {/* <label className="label">
                <span className="label-text">File</span>
              </label>
              <input
                type="file"
                name="file"
                // multiple={true}
                accept="image/*"
                value={addForm.file}
                onChange={(e) => onSelectFile(e)}
                className="border-slate-300 w-full"
              />
              {addFormError.file && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.file}
                  </span>
                </label>
              )} */}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-add"
                ref={addModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-primary rounded-md">Add</button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-add-files">
          <h3 className="font-bold text-lg mb-4">Add Files</h3>
          <form onSubmit={(e) => addFile(e, putForm.id)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">File</span>
              </label>
              <div className="rounded border border-slate-400 p-2">
                <input
                  type="file"
                  name="file"
                  // multiple={true}
                  accept="image/*"
                  // value={files}
                  onChange={(e) => onSelectFile(e)}
                  className="m-0 p-0 w-full"
                />
                {/* {addFormError.file && (
                <label className="label">
                <span className="label-text-alt text-rose-300">
                    {addFormError.file}
                  </span>
                </label>
              )} */}
              </div>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-add-files"
                ref={addFileModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-primary rounded-md">Add</button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-put">
          <h3 className="font-bold text-lg mb-4">Edit Record</h3>
          <form onSubmit={(e) => putRecord(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              {/* <div className="flex gap-4">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Height</span>
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={putForm.height}
                    onChange={(e) => handlePutInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {putFormError.height && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {putFormError.height}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Weight</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={putForm.weight}
                    onChange={(e) => handlePutInput(e)}
                    placeholder=""
                    autoComplete="new-off"
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {putFormError.weight && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {putFormError.weight}
                      </span>
                    </label>
                  )}
                </div>
              </div> */}
              <label className="label">
                <span className="label-text">Complaint</span>
              </label>
              <textarea
                type="text"
                name="complaint"
                value={putForm.complaint}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.complaint && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.complaint}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Inspeciton</span>
              </label>
              <textarea
                type="text"
                name="inspection"
                value={putForm.inspection}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.inspection && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.inspection}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Diagnosa</span>
              </label>
              {/* <pre>{JSON.stringify(selectedDiagnosis)}</pre> */}
              {/* <p>{JSON.stringify(selectedDiagnosis)}</p> */}
              <MultiSelect
                options={diagsosis || []}
                value={selectedDiagnosis}
                onChange={setSelectedDiagnosis}
                hasSelectAll={false}
              />
              <label className="label">
                <span className="label-text">Therapy</span>
              </label>
              <textarea
                type="text"
                name="therapy"
                value={putForm.therapy}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.therapy && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.therapy}
                  </span>
                </label>
              )}

              {/* <label className="label">
                <span className="label-text">File</span>
              </label>
              <input
                type="file"
                name="file"
                // multiple={true}
                value={putForm.file}
                onChange={(e) => handlePutInput(e)}
                className="border-slate-300 w-full"
              />
              {putFormError.file && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.file}
                  </span>
                </label>
              )} */}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-put"
                ref={putModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-success text-black rounded-md">
                Update
              </button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
