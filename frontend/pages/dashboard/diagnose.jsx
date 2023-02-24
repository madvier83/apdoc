import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";
import numeral from "numeral";

import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";

export default function Diagnose() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const putModalRef = useRef();

  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisLoading, setDiagnosisLoading] = useState(true);

  const initialDiagnosisForm = {
    id: "",
    code: "",
    description: "",
  };

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDiagnosisForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDiagnosisForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDiagnosisForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDiagnosisForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getDiagnosis() {
    try {
      const response = await axios.get("diagnoses", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setDiagnosis(response.data);
      setDiagnosisLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addDiagnosis(e) {
    e.preventDefault();
    try {
      const response = await axios.post("diagnose", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getDiagnosis();
      setAddForm(initialDiagnosisForm);
      setAddFormError(initialDiagnosisForm);
    } catch (err) {
      setAddFormError(initialDiagnosisForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putDiagnosis(e) {
    e.preventDefault();
    console.log(putForm);
    try {
      const response = await axios.put(`diagnose/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      putModalRef.current.click();
      getDiagnosis();
      setPutForm(initialDiagnosisForm);
      setPutFormError(initialDiagnosisForm);
    } catch (err) {
      setPutFormError(initialDiagnosisForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteDiagnosis(id) {
    try {
      const response = await axios.delete(`diagnose/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getDiagnosis();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getDiagnosis();
  }, []);

  return (
    <>
      <DashboardLayout title="Diagnose">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Diagnose Table
                </h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <label
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-add"
                >
                  Add <i className="fas fa-add"></i>
                </label>
              </div>
            </div>
          </div>
          <div className="min-h-[80vh] block w-full overflow-x-auto">
            {/* Projects table */}
            <table className="items-center w-full bg-transparent border-collapse overflow-auto">
              <thead>
                <tr>
                  <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    #
                  </th>
                  <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Code
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Description
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Created At
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Updated At
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Acitons
                  </th>
                </tr>
              </thead>
              <tbody>
                {diagnosisLoading && (
                  <tr>
                    <td colSpan={99}>
                      <div className="flex w-full justify-center my-4">
                        <img src="/loading.svg" alt="now loading" />
                      </div>
                    </td>
                  </tr>
                )}
                {diagnosis?.map((obj, index) => {
                  return (
                    <tr key={obj.id}>
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left flex items-center">
                        <span className={"ml-3 font-bold"}>{index + 1}</span>
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-2 min-w-full">
                        <span className={"font-bold ml-3 text-xl"}>
                          {obj.code}
                        </span>
                      </td>
                      <td className="border-t-0 pr-6 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <label htmlFor={`detail-${obj.id}`}>
                          <span>{obj.description.slice(0, 40)} ...</span>
                        </label>
                        <input
                          type="checkbox"
                          id={`detail-${obj.id}`}
                          className="modal-toggle"
                        />
                        <label
                          htmlFor={`detail-${obj.id}`}
                          className="modal cursor-pointer"
                        >
                          <label
                            className="modal-box px-16 py-8 bg-primary text-primary-content max-w-md relative"
                            htmlFor=""
                          >
                            <h3 className="text-3xl font-bold">{obj.code}</h3>
                            <p className="py-4 opacity-90 text-base whitespace-pre-wrap">
                              {obj.description}
                            </p>
                          </label>
                        </label>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                      {moment(obj.created_at).format("DD MMM YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <div className="tooltip tooltip-left" data-tip="Detail">
                          <label
                            htmlFor={`detail-${obj.id}`}
                            className="bg-violet-500 text-white active:bg-violet-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          >
                            <i className="fas fa-eye"></i>
                          </label>
                        </div>
                        <div className="tooltip tooltip-left" data-tip="Edit">
                          <label
                            className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            htmlFor="modal-put"
                            onClick={() => {
                              setPutForm(obj);
                              setPutFormError(initialDiagnosisForm);
                            }}
                          >
                            <i className="fas fa-pen-to-square"></i>
                          </label>
                        </div>
                        <div className="tooltip tooltip-left" data-tip="Delete">
                          <button
                            className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => deleteDiagnosis(obj.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Add Diagnose</h3>
          <form onSubmit={addDiagnosis} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Code</span>
              </label>
              <input
                type="text"
                name="code"
                value={addForm.code}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.code && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.code}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                type="text"
                name="description"
                value={addForm.description}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={6}
                className="input input-bordered input-primary border-slate-300 w-full h-32"
              ></textarea>
              {addFormError.description && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.description}
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
          <h3 className="font-bold text-lg mb-4">Update Diagnose</h3>
          <form onSubmit={putDiagnosis} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Code</span>
              </label>
              <input
                type="text"
                name="code"
                value={putForm.code}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.code && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.code}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                type="text"
                name="description"
                value={putForm.description}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={6}
                className="input input-bordered input-primary border-slate-300 w-full h-32"
              ></textarea>
              {putFormError.description && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.description}
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
              <button className="btn btn-success bg-success rounded-md">Update</button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
