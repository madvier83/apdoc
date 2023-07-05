import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import ModalDelete from "../../../components/Modals/ModalDelete";
import numeral from "numeral";
import Loading from "../../../components/loading";
import { GetCookieChunk } from "../../../services/CookieChunk";
import SelectedClinicBadge from "../../../components/SelectedClinicBadge";

export default function Appointment() {
  const token = GetCookieChunk("token_");

  const addModalRef = useRef();
  const putModalRef = useRef();
  const tableRef = useRef();

  const [clinic, setClinic] = useState();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [searchPatients, setSearchPatients] = useState("");
  const [page, setPage] = useState(1);
  
  const [sortBy, setSortBy] = useState("patient_id");
  const [order, setOrder] = useState(true);

  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState();

  const initialItemForm = {
    clinic_id: "",
    patient_id: null,
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
    if (!clinic) {
      return;
    }
    setItemLoading(true)
    try {
      const response = await axios.get(
        `appointments/${clinic && clinic + "/"}${perpage}${
          search &&
          "/" +
            search
              .split(" ")
              .join("%")
              .replace(/[^a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}&sortBy=${sortBy}&order=${order ? "asc" : "desc"}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response.data.data);
      setItem(response.data);
      setItemLoading(false);
    } catch (err) {
      console.error(err);
      setItem({})
      setItemLoading(false);
    }
  }

  async function getPatients() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `patients/${clinic && clinic + "/"}${perpage}${
          searchPatients &&
          "/" +
            searchPatients
              .split(" ")
              .join("%")
              .replace(/[^a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      setPatients(response.data);
      setPatientsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `appointment/${addForm.patient_id}`,
        addForm,
        {
          headers: {
            Authorization: "Bearer" + token,
            "Content-Type": "application/json",
          },
        }
      );
      addModalRef.current.click();
      getItem();
      setAddForm(initialItemForm);
      setAddForm({clinic_id: clinic});
      setAddFormError(initialItemForm);
      setSelectedPatient({});
    } catch (err) {
      console.log(err);
      setAddFormError(initialItemForm);
      setAddFormError(err.response?.data?.errors);
    }
  }

  async function putItem(e) {
    e.preventDefault();
    try {
      const response = await axios.put(`appointment/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "application/json",
        },
      });
      putModalRef.current.click();
      getItem();
      setPutForm(initialItemForm);
      setPutFormError(initialItemForm);
    } catch (err) {
      setPutFormError(initialItemForm);
      setPutFormError(err.response?.data?.errors);
    }
  }

  async function deleteItem(id) {
    try {
      const response = await axios.delete(`appointment/${id}`, {
        headers: {
          Authorization: "Bearer" + token,
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

  useEffect(() => {
    setAddForm({ patien_id: selectedPatient?.id || null });
  }, [selectedPatient]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getItem();
    }, 300);

    if (page > item?.last_page) {
      setPage(item.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, clinic, sortBy, order]);

  useEffect(() => {
    setSearch("");
    setSearchPatients("");
    setPage(1);
    setAddForm({ clinic_id: clinic });
  }, [clinic]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getPatients();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchPatients, clinic]);

  // console.log(item)
  return (
    <>
      <DashboardLayout
        title="Appointment"
        clinic={clinic}
        setClinic={setClinic}
      >
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

              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search..."
                  maxLength={32}
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  className="input input-bordered input-xs input-primary border-slate-300 w-64 text-xs m-0 font-semibold"
                />
                <i
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className={`fas ${
                    !search ? "fa-search" : "fa-x"
                  } absolute text-slate-400 right-0 pr-4 cursor-pointer top-[6px] text-xs`}
                ></i>
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
          <div
            ref={tableRef}
            className="h-[75vh] w-full overflow-x-auto flex flex-col justify-between"
          >
            {/* Projects table */}
            <table className="items-center w-full bg-transparent border-collapse overflow-auto">
              <thead className="sticky top-0">
                <tr>
                  <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    #
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "patient_id" && setOrder((p) => !p);
                        setSortBy("patient_id");
                      }}
                    >
                      <p>Patient</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "patient_id" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "description" && setOrder((p) => !p);
                        setSortBy("description");
                      }}
                    >
                      <p>Description</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "description" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "status_id" && setOrder((p) => !p);
                        setSortBy("status_id");
                      }}
                    >
                      <p>Status</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "status_id" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "appointment_date" && setOrder((p) => !p);
                        setSortBy("appointment_date");
                      }}
                    >
                      <p>Date Time</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "appointment_date" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Created At
                  </th> */}
                  {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Updated At
                  </th> */}
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <Loading
                  data={item}
                  dataLoading={itemLoading}
                  reload={getItem}
                ></Loading>
                {!itemLoading &&
                  item?.data?.map((obj, index) => {
                    return (
                      <tr key={obj.id} className="hover:bg-zinc-50">
                        <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                          <span className={"ml-3 font-bold"}>
                            {index + item.from}
                          </span>
                        </th>
                        <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                          <i
                            className={`text-md mr-2 ${
                              obj.patient?.gender == "male"
                                ? "text-blue-400 fas fa-mars"
                                : "text-pink-400 fas fa-venus"
                            }`}
                          ></i>{" "}
                          <span className={"font-bold"}>
                            {obj.patient?.name}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>{obj.description.slice(0, 40)}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span className="">
                            {obj.status_id == 1 && (
                              <button className="btn-primary bg-indigo-100 text-indigo-600 text-xs font-bold normal-case px-3 py-1 rounded-md w-full">
                                Pending
                              </button>
                            )}
                            {obj.status_id == 2 && (
                              <button className="btn-disabled ml-auto bg-slate-100 text-xs font-bold normal-case px-3 py-1 rounded-md w-full">
                                In Queue
                              </button>
                            )}
                            {obj.status_id == 3 && (
                              <button className="btn-disabled ml-auto bg-emerald-100 text-emerald-600 text-xs font-bold normal-case px-3 py-1 rounded-md w-full">
                                Completed
                              </button>
                            )}
                            {obj.status_id == 4 && (
                              <button className="btn-disabled ml-auto bg-rose-100 text-rose-600 text-xs font-bold normal-case px-3 py-1 rounded-md w-full">
                                Cancelled
                              </button>
                            )}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>
                            {moment(obj.appointment_date).format("DD MMM YYYY")}{" "}
                            - {moment(obj.appointment_date).format("h:mm A")}
                          </span>
                        </td>
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.created_at).format("DD MMM YYYY")}
                      </td> */}
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td> */}
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          {/* <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                        Active */}
                          <span
                            className="tooltip tooltip-left"
                            data-tip="Edit"
                          >
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

          <div className="flex">
            <div className="flex w-full py-2 mt-1 rounded-b-md gap-8 justify-center bottom-0 items-center align-bottom select-none bg-gray-50">
              <small className="w-44 text-right truncate">
                Results {item.from}-{item.to} of {item.total}
              </small>
              <div className="flex text-xs justify-center items-center">
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page <= 1 ? true : false}
                  onClick={() => {
                    setPage(1);
                  }}
                >
                  <i className="fa-solid fa-angles-left"></i>
                </button>
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page <= 1 ? true : false}
                  onClick={() => {
                    setPage((prev) => prev - 1);
                  }}
                >
                  <i className="fa-solid fa-angle-left"></i>
                </button>
                <input
                  type="number"
                  name="number"
                  className="input input-xs w-12 text-center text-xs px-0 font-bold border-none bg-gray-50"
                  value={page}
                  min={1}
                  max={item.last_page}
                  onChange={(e) => setPage(e.target.value)}
                />
                {/* <p className="font-bold w-8 text-center">{page}</p> */}
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= item.last_page ? true : false}
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= item.last_page ? true : false}
                  onClick={() => {
                    setPage(item.last_page);
                  }}
                >
                  <i className="fa-solid fa-angles-right"></i>
                </button>
              </div>
              <div className="flex items-center text-xs w-44">
                <p className="truncate">Number of rows</p>
                <select
                  className="input text-xs input-sm py-0 input-bordered without-ring input-primary bg-gray-50 border-gray-50 w-14"
                  name="perpage"
                  id=""
                  onChange={(e) => {
                    setPerpage(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4 flex justify-between">Add Appointment 
            <SelectedClinicBadge></SelectedClinicBadge></h3>
          <form onSubmit={addItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <div className="dropdown">
                <label className="label">
                  <span className="label-text">Patient</span>
                </label>
                {selectedPatient?.id && (
                  <div className="p-0 overflow-hidden mb-1">
                    <div
                      className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs hover:bg-rose-200 border border-slate-300 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedPatient({});
                        setAddForm({ patient_id: null });
                      }}
                    >
                      <div className="flex justify-end font-bold">
                        <i className="fas fa-x absolute collapse hidden group-hover:flex mt-1 transition-all text-rose-600"></i>
                      </div>
                      <p className="text-sm font-semibold">
                        {selectedPatient.name}
                      </p>
                    </div>
                  </div>
                )}
                {!selectedPatient?.id && (
                  <>
                    <input
                      tabIndex={0}
                      type="text"
                      name="searchAdd"
                      value={searchPatients}
                      onChange={(e) => setSearchPatients(e.target.value)}
                      placeholder="Search patient ..."
                      className="input input-bordered border-slate-300 w-full"
                    />
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                    >
                      {!patients?.data?.length && (
                        <li className="rounded-sm text-sm">
                          <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                            No data found
                          </div>
                        </li>
                      )}
                      {patients?.data?.map((obj) => {
                        return (
                          <li key={obj.id} className="p-0 overflow-hidden">
                            <div
                              className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                              onClick={() => {
                                setSelectedPatient(obj);
                                setAddForm({ patient_id: obj.id });
                                setSearchPatients("");
                              }}
                            >
                              {obj.name}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
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
              <textarea
                type="text"
                name="description"
                value={addForm.description}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full h-24"
              ></textarea>
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
              <div className="p-0 overflow-hidden mb-1">
                <div className="group font-semibold justify-start p-4 normal-case text-justify transition-all text-sm bg-slate-50 rounded-md cursor-pointer">
                  <p>{putForm?.patient?.name || ""}</p>
                </div>
              </div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                type="text"
                name="description"
                value={putForm.description}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full h-24"
              ></textarea>
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
