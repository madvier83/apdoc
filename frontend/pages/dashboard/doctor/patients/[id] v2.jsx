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
  const putModalRef = useRef();
  const detailModalRef = useRef();

  const [isRecord, setIsRecord] = useState(true);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [record, setRecord] = useState([]);
  const [recordLoading, setRecordLoading] = useState(true);
  const [patient, setPatient] = useState([]);
  const [patientLoading, setPatientLoading] = useState(true);
  const [diagsosis, setDiagnosis] = useState([]);
  const [diagsosisLoading, setDiagnosisLoading] = useState(true);

  const initialRecordForm = {
    id: "",
    patient_id: "",
    height: "",
    weight: "",
    diagnoses: [],
    complaint: "",
    inspection: "",
    therapy: "",
    files: [],
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
    formData.append("patient_id", addForm.patient_id);
    formData.append("complaint", addForm.complaint);
    formData.append("inspection", addForm.inspection);
    formData.append("therapy", addForm.therapy);
    formData.append("diagnoses[]", addForm.diagnoses);
    formData.append("files[]", addForm.files);

    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }

    try {
      const response = await axios.post(`/record`, formData, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "multipart/form-data",
        },
      });
      addModalRef.current.click();
      getRecord();
      setAddForm(initialRecordForm);
      setAddForm({ patient_id: selectedPatient.id });
      setAddFormError(initialRecordForm);
    } catch (err) {
      setAddFormError(initialRecordForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putRecord(e) {
    setPutForm({ patient_id: selectedPatient.id });
    e.preventDefault();
    let data = new FormData();
    data.append("patient_id", putForm.patient_id);
    data.append("height", putForm.height);
    data.append("weight", putForm.weight);
    data.append("diagnoses", putForm.diagnoses);
    data.append("complaint", putForm.complaint);
    data.append("inspection", putForm.inspection);
    data.append("therapy", putForm.therapy);
    data.append("files", putForm.files);

    try {
      const response = await axios.put(`/record/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      putModalRef.current.click();
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

  useEffect(() => {
    getPatient();
    getRecord();
    getDiagnosis();
  }, []);

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
  }, [...selectedDiagnosis]);
  console.log(selectedDiagnosis)

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
                  "relative flex flex-row gap-4 min-w-0 break-words w-full min-h-fit h-full text-blueGray-700 rounded-md"
                }
              >
                <div className="flex-row gap-4 w-1/2 bg-white rounded-md">
                  <div className="px-8 pt-8 rounded-md">
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
                  <div className="px-8 pb-8 rounded-md">
                    <div className="border-t border-dashed my-8"></div>
                    <div className="">
                      <small className="text-2xl font-semibold">
                        Height & weight
                      </small>{" "}
                      <br />
                    </div>
                    <div className="my-3"></div>
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
                  </div>
                </div>

                <div className="rounded-md bg-white px-4 py-4 border-0 w-1/2">
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
                            <div className="card-body pl-2 pr-6">
                              <div className="flex">
                                <span className="font-semibold ">
                                  {moment(obj.created_at).format(
                                    "DD MMMM YYYY, h:mm A"
                                  )}
                                </span>
                                <label
                                  className="ml-auto btn btn-xs btn-success bg-emerald-400 font-bold"
                                  htmlFor="modal-put"
                                  onClick={() => {
                                    putSelectedDiagnosis(obj);
                                    setPutForm(obj);
                                  }}
                                >
                                  Edit <i className="fas fa-edit ml-2"></i>
                                </label>
                                <label
                                  className=" btn btn-xs btn-error bg-rose-400 text-white ml-1 font-bold"
                                  htmlFor={obj.id}
                                >
                                  Delete <i className="fas fa-trash ml-2"></i>
                                </label>
                              </div>
                              <ModalDelete
                                id={obj.id}
                                callback={() => deleteRecord(obj.id)}
                                title={`Delete Record ${moment(
                                  obj.created_at
                                ).format("DD MMMM YYYY")}?`}
                              ></ModalDelete>
                              <table className="w-full">
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
                              <span className="text-xs text-zinc-400 mt-1">
                                ({moment(obj.created_at).fromNow()})
                              </span>
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
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Height</span>
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={addForm.height}
                    onChange={(e) => handleAddInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {addFormError.height && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {addFormError.height}
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
                    value={addForm.weight}
                    onChange={(e) => handleAddInput(e)}
                    placeholder=""
                    autoComplete="new-off"
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {addFormError.weight && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {addFormError.weight}
                      </span>
                    </label>
                  )}
                </div>
              </div>
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

              <label className="label">
                <span className="label-text">File</span>
              </label>
              <input
                type="file"
                name="file"
                value={addForm.file}
                onChange={(e) => handleAddInput(e)}
                className="border-slate-300 w-full"
              />
              {addFormError.file && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.file}
                  </span>
                </label>
              )}
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

        <ModalBox id="modal-put">
          <h3 className="font-bold text-lg mb-4">Edit Record</h3>
          <form onSubmit={(e) => putRecord(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <div className="flex gap-4">
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
              </div>
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

              <label className="label">
                <span className="label-text">File</span>
              </label>
              <input
                type="file"
                name="file"
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
              )}
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

        {/* <ModalBox id="modal-details">
          <h3 className="font-bold text-lg mb-4">Detail Patient</h3>

          <input type="hidden" autoComplete="off" />
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">NIK</span>
            </label>
            <input
              type="text"
              value={putForm.nik}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
            />
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={putForm.name}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
            />
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              value={putForm.phone}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
            />
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <textarea
              type="text"
              rows={3}
              value={putForm.address}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full h-16"
            ></textarea>
            <div className="flex gap-4 w-full">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Birth Place</span>
                </label>
                <input
                  type="text"
                  value={putForm.birth_place}
                  onChange={() => {}}
                  disabled
                  className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Birth Date</span>
                </label>
                <input
                  type="date"
                  value={putForm.birth_date}
                  onChange={() => {}}
                  disabled
                  className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  name="gender"
                  value={putForm.gender}
                  onChange={() => {}}
                  disabled
                  className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-action rounded-sm">
            <button
              className="btn btn-ghost rounded-md"
              onClick={() => {
                detailModalRef.current.click();
                setTimeout(() => putModalRef.current.click(), 120);
              }}
            >
              Edit
            </button>
            <label
              htmlFor="modal-details"
              ref={detailModalRef}
              className="btn bg-slate-600 border-none text-white rounded-md"
            >
              Close
            </label>
          </div>
        </ModalBox> */}
      </DashboardLayout>
    </>
  );
}
