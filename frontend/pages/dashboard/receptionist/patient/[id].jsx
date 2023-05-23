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
  const addGrowthModalRef = useRef();
  const addFileModalRef = useRef();
  const putModalRef = useRef();
  const putGrowthModalRef = useRef();

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
  const [growth, setGrowth] = useState([]);
  const [growthLoading, setGrowthLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const [growthChart, setGrowthChart] = useState([
    [
      "Patient",
      "Height",
      { role: "annotation" },
      "Weight",
      { role: "annotation" },
    ],
    ["", 0, "0", 0, "0"],
  ]);

  const initialRecordForm = {
    id: "",
    patient_id: "",
    diagnoses: [],
    complaint: "",
    inspection: "",
    therapy: "",
  };
  const initialGrowthForm = {
    id: "",
    height: "",
    weight: "",
  };
  const [selectedPatient, setSelectedPatient] = useState(initialRecordForm);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);

  const [addGrowthForm, setAddGrowthForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialGrowthForm
  );
  const [addGrowthFormError, setAddGrowthFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialGrowthForm
  );
  const [putGrowthForm, setPutGrowthForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialGrowthForm
  );
  const [putGrowthFormError, setPutGrowthFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialGrowthForm
  );

  const handleAddGrowthInput = (event) => {
    const { name, value } = event.target;
    setAddGrowthForm({ [name]: value });
  };
  const handlePutGrowthInput = (event) => {
    const { name, value } = event.target;
    setPutGrowthForm({ [name]: value });
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

  async function getGrowth() {
    // setRecordLoading(true);
    try {
      const response = await axios.get(`/growth/${router.query.id}/patient`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      let chart = [
        [
          "Patient",
          "Height",
          { role: "annotation" },
          "Weight",
          { role: "annotation" },
        ],
      ];
      if (response.data.length > 0) {
        response.data.map((obj) => {
          chart.push([
            moment(obj.created_at).format("DD MMM YYYY"),
            Number(obj.height),
            obj.height,
            Number(obj.weight),
            obj.weight,
          ]);
        });
        setGrowthChart(chart);
      }
      setGrowth(response.data);
      setGrowthLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addGrowth(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `/growth`,
        { patient_id: router.query.id, ...addGrowthForm },
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      addGrowthModalRef.current.click();
      // setFiles([]);
      getGrowth();
      setAddGrowthForm(initialGrowthForm);
      setAddGrowthFormError(initialGrowthForm);
    } catch (err) {
      console.error(err);
      setAddGrowthFormError(initialGrowthForm);
      setAddGrowthFormError(err.response?.data);
    }
  }

  async function deleteGrowth(id) {
    try {
      const response = await axios.delete(`/growth/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setAddGrowthForm(initialGrowthForm);
      getGrowth();
      setIsGrowth(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function putGrowth(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/growth/${putGrowthForm.id}`,
        putGrowthForm,
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "aplication/json",
          },
        }
      );
      putGrowthModalRef.current.click();
      setPutGrowthForm(initialGrowthForm);
      getGrowth();
      setIsGrowth(false);
    } catch (err) {
      console.error(err);
      setPutGrowthFormError(initialRecordForm);
      setPutGrowthFormError(err.response?.data);
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getPatient();
      getGrowth();
    }
  }, [router.isReady]);

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
                          href={`${
                            obj.phone
                              ? `https://wa.me/` + obj.phone?.replace(/\D/g, "")
                              : ""
                          }`}
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
                      {isGrowth ? (
                        <div className="flex gap-1">
                          <div
                            className="btn btn-xs btn-error bg-rose-400 text-white font-bold"
                            onClick={() => setIsGrowth((prev) => !prev)}
                          >
                            Cancel <i className="fas fa-x ml-1"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <div
                            className="btn btn-xs btn-ghost bg-zinc-200 text-zinc-500 font-bold"
                            onClick={() => setIsGrowth((prev) => !prev)}
                          >
                            Edit <i className="fas fa-edit ml-1"></i>
                          </div>
                          <label
                            htmlFor="modal-add-growth"
                            className="btn btn-xs btn-primary font-bold"
                            // onClick={() => setIsGrowth((prev) => !prev)}
                          >
                            Add <i className="fas fa-plus ml-1"></i>
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="my-3"></div>
                    {isGrowth ? (
                      <div className="h-72 pb-0 overflow-scroll bg-opacity-25 border border-zinc-200 rounded-md">
                        <table className="items-center w-full bg-transparent border-collapse overflow-auto">
                          <thead>
                            <tr>
                              <th className="pr-6 pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                #
                              </th>
                              <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Height (CM)
                              </th>
                              <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Weight (KG)
                              </th>
                              {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Created At
                              </th>
                              <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Updated At
                              </th> */}
                              <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {growthLoading && (
                              <tr>
                                <td colSpan={99}>
                                  <div className="flex w-full justify-center my-4">
                                    <img src="/loading.svg" alt="now loading" />
                                  </div>
                                </td>
                              </tr>
                            )}
                            {growth?.map((obj, index) => {
                              return (
                                <tr key={obj.id} className="hover:bg-zinc-50">
                                  <th className="border-t-0 pl-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                                    <span className={"ml-3 font-bold"}>
                                      {index + 1}
                                    </span>
                                  </th>
                                  <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                                    <span className={"ml-4 font-bold"}>
                                      {obj.height}
                                    </span>
                                  </td>
                                  <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                                    <span className={"ml-4 font-bold"}>
                                      {obj.weight}
                                    </span>
                                  </td>
                                  {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                    {moment(obj.created_at).format(
                                      "DD MMM YYYY"
                                    )}
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                    {moment(obj.updated_at).fromNow()}
                                  </td> */}
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                    <div
                                      className="tooltip tooltip-left"
                                      data-tip="Edit"
                                    >
                                      <label
                                        className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        htmlFor="modal-put-growth"
                                        onClick={() => {
                                          setPutGrowthForm(obj);
                                          setPutGrowthFormError(
                                            initialGrowthForm
                                          );
                                        }}
                                      >
                                        <i className="fas fa-pen-to-square"></i>
                                      </label>
                                    </div>
                                    <div
                                      className="tooltip tooltip-left"
                                      data-tip="Delete"
                                    >
                                      <label
                                        className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        htmlFor={"growthDelete" + obj.id}
                                      >
                                        <i className="fas fa-trash"></i>
                                      </label>
                                    </div>
                                    <ModalDelete
                                      id={"growthDelete" + obj.id}
                                      callback={() => deleteGrowth(obj.id)}
                                      title={`Delete item?`}
                                    ></ModalDelete>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="w-full h-72">
                        <Chart
                          chartType="LineChart"
                          data={growthChart}
                          options={{
                            legend: {
                              position: "top",
                              alignment: "center",
                              top: 20,
                            },
                            chartArea: { width: "92%", height: "80%" },
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
                          height={"280px"}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalBox id="modal-add-growth">
          <h3 className="font-bold text-lg mb-4">Growth Record</h3>
          <form onSubmit={(e) => addGrowth(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Height (cm)</span>
              </label>
              <input
                type="number"
                name="height"
                value={addGrowthForm.height}
                onChange={(e) => handleAddGrowthInput(e)}
                placeholder=""
                className="input input-bordered border-slate-300 w-full"
              ></input>
              {addGrowthFormError.height && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addGrowthFormError.height}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Weight (kg)</span>
              </label>
              <input
                type="number"
                name="weight"
                value={addGrowthForm.weight}
                onChange={(e) => handleAddGrowthInput(e)}
                placeholder=""
                className="input input-bordered border-slate-300 w-full"
              ></input>
              {addGrowthFormError.weight && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addGrowthFormError.weight}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-add-growth"
                ref={addGrowthModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-primary rounded-md">Add</button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-put-growth">
          <h3 className="font-bold text-lg mb-4">Update Growth Record</h3>
          <form onSubmit={(e) => putGrowth(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Height (cm)</span>
              </label>
              <input
                type="number"
                name="height"
                value={putGrowthForm.height}
                onChange={(e) => handlePutGrowthInput(e)}
                placeholder=""
                className="input input-bordered border-slate-300 w-full"
              ></input>
              {putGrowthFormError.height && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putGrowthFormError.height}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Weight (kg)</span>
              </label>
              <input
                type="number"
                name="weight"
                value={putGrowthForm.weight}
                onChange={(e) => handlePutGrowthInput(e)}
                placeholder=""
                className="input input-bordered border-slate-300 w-full"
              ></input>
              {putGrowthFormError.weight && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putGrowthFormError.weight}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-put-growth"
                ref={putGrowthModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-success text-zinc-900 rounded-md">
                Update
              </button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
