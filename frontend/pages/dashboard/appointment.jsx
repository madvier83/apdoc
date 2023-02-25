import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import ModalDelete from "../../components/Modals/ModalDelete";
import numeral from "numeral";

export default function Appointment() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const putModalRef = useRef();

  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);

  const initialItemForm = {
    patient_id: "",
    description: "",
    appointment_date: "",
  };

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialItemForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialItemForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialItemForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialItemForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getItem() {
    try {
      const response = await axios.get("appointments", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      console.log(response.data.data);
      setItem(response.data.data);
      setItemLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getPatients() {
    try {
      const response = await axios.get("patients", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setPatients(response.data);
      setPatientsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    try {
      const response = await axios.post("appointment", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getItem();
      setAddForm(initialItemForm);
      setAddFormError(initialItemForm);
    } catch (err) {
      setAddFormError(initialItemForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putItem(e) {
    e.preventDefault();
    console.log(putForm);
    try {
      const response = await axios.put(`appointment/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      putModalRef.current.click();
      getItem();
      setPutForm(initialItemForm);
      setPutFormError(initialItemForm);
    } catch (err) {
      setPutFormError(initialItemForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteItem(id) {
    try {
      const response = await axios.delete(`appointment/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getItem();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getItem();
    getPatients();
  }, []);

  return (
    <>
      <DashboardLayout title="Appointment">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Appointment Table
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
                  <th className="pl-1 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Name
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Description
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Appointment
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Date
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Time
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
                {itemLoading && (
                  <tr>
                    <td colSpan={99}>
                      <div className="flex w-full justify-center my-4">
                        <img src="/loading.svg" alt="now loading" />
                      </div>
                    </td>
                  </tr>
                )}
                {item?.map((obj, index) => {
                  return (
                    <tr key={obj.id} className="hover:bg-zinc-50">
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                        <span className={"ml-3 font-bold"}>{index + 1}</span>
                      </th>
                      <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                        <i
                          className={`text-md mr-2 ${
                            obj.patient?.gender == "male"
                              ? "text-blue-400 fas fa-mars"
                              : "text-pink-400 fas fa-venus"
                          }`}
                        ></i>{" "}
                        <span className={"font-bold"}>{obj.patient?.name}</span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span>{obj.description.slice(0, 40)} ...</span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span className="ml-2">
                          {moment(obj.appointment_date).fromNow()}
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span>
                          {moment(obj.appointment_date).format("DD MMM YYYY")}
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span>
                          {moment(obj.appointment_date).format("h:mm A")}
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.created_at).format("DD MMM YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {/* <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                        Active */}
                        <span className="tooltip tooltip-left" data-tip="Edit">
                          <label
                            className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            htmlFor="modal-put"
                            onClick={() => {
                              setPutForm(obj);
                              setPutFormError("");
                            }}
                          >
                            <i className="fas fa-pen-to-square"></i>
                          </label>
                        </span>
                        <span
                          className="tooltip tooltip-left"
                          data-tip="Delete"
                        >
                          <label
                            className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            htmlFor={obj.id}
                          >
                            <i className="fas fa-trash"></i>
                          </label>
                        </span>
                        <ModalDelete
                          id={obj.id}
                          callback={() => deleteItem(obj.id)}
                          title={`Delete appointment?`}
                        ></ModalDelete>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Add Appointment</h3>
          <form onSubmit={addItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Patients</span>
              </label>
              <select
                name="patient_id"
                onChange={(e) => handleAddInput(e)}
                required
                value={addForm.patient_id}
                className="input input-bordered without-ring input-primary border-slate-300 w-full"
              >
                <option value="">Unasigned</option>
                {patients?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
              </select>
              {addFormError.patient_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.patient_id}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                name="description"
                value={addForm.description}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.description && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.description}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Appointment date</span>
              </label>
              <input
                type="datetime-local"
                name="appointment_date"
                value={addForm.appointment_date}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.appointment_date && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.appointment_date}
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
          <h3 className="font-bold text-lg mb-4">Update Appointment</h3>
          <form onSubmit={putItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Patients</span>
              </label>
              <select
                name="patient_id"
                onChange={(e) => handlePutInput(e)}
                required
                value={putForm.patient_id}
                className="input input-bordered without-ring input-primary border-slate-300 w-full"
              >
                <option value="">Unasigned</option>
                {patients?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
              </select>
              {putFormError.patient_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.patient_id}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                name="description"
                value={putForm.description}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.description && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.description}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Appointment date</span>
              </label>
              <input
                type="datetime-local"
                name="appointment_date"
                value={putForm.appointment_date}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.appointment_date && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.appointment_date}
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
              <button className="btn btn-success bg-success rounded-md">
                Update
              </button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
