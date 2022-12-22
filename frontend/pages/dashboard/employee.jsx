import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";

export default function Employee() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const putModalRef = useRef();
  const detailModalRef = useRef();

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(true);

  const initialEmployeeForm = {
    id: "",
    nik: "",
    name: "",
    phone: "",
    address: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    position_id: "",
  };

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialEmployeeForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialEmployeeForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialEmployeeForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialEmployeeForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getEmployee() {
    try {
      const response = await axios.get("/employee", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setEmployees(response.data);
      setEmployeesLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getPositions() {
    try {
      const response = await axios.get("/position", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setPositions(response.data);
      setPositionsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addEmployee(e) {
    e.preventDefault();
    try {
      const response = await axios.post("employee", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getEmployee();
      setAddForm(initialEmployeeForm);
      setAddFormError(initialEmployeeForm);
    } catch (err) {
      setAddFormError(initialEmployeeForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putEmployee(e) {
    e.preventDefault();
    console.log(putForm);
    try {
      const response = await axios.put(`employee/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      putModalRef.current.click();
      getEmployee();
      setPutForm(initialEmployeeForm);
      setPutFormError(initialEmployeeForm);
    } catch (err) {
      setPutFormError(initialEmployeeForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteEmployee(id) {
    try {
      const response = await axios.delete(`employee/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getEmployee();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getEmployee();
    getPositions();
  }, []);

  return (
    <>
      <DashboardLayout title="Employee">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-32 mt-1 min-h-fit shadow-lg rounded text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}><i className="fas fa-filter mr-3"></i>  Employee Table</h3>
                
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
          <div className="block w-full overflow-x-auto">
            {/* Projects table */}
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th className="pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    #
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Name
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Position
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Phone
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
                {employeesLoading && (
                  <tr>
                    <td colSpan={99}>
                      <div className="flex w-full justify-center my-4">
                        <img src="/loading.svg" alt="now loading" />
                      </div>
                    </td>
                  </tr>
                )}
                {employees?.map((obj, index) => {
                  return (
                    <tr key={obj.id}>
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                        <span className={"ml-3 font-bold "}>{index + 1}</span>
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <span className={"font-bold"}>{obj.name}</span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <span className={"font-bold capitalize"}>
                          <i
                            className={`fas fa-circle mr-2 ${
                              obj.position?.name
                                ? "text-emerald-400"
                                : "text-orange-400"
                            }`}
                          ></i>{" "}
                          {obj.position?.name ? obj.position.name : "unasigned"}
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <span className={"font-bold"}>{obj.phone}</span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {moment(obj.created_at).fromNow()}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {moment(obj.updated_at).fromNow()}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div
                          className="tooltip tooltip-left"
                          data-tip="Detail"
                        >
                          <label
                            className="bg-violet-500 text-white active:bg-violet-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            htmlFor="modal-details"
                            onClick={() => {
                              setPutForm(obj);
                              setPutFormError(initialEmployeeForm);
                            }}
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
                              setPutFormError(initialEmployeeForm);
                            }}
                          >
                            <i className="fas fa-pen-to-square"></i>
                          </label>
                        </div>
                        <div className="tooltip tooltip-left" data-tip="Delete">
                          <button
                            className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => deleteEmployee(obj.id)}
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
          <h3 className="font-bold text-lg mb-4">Add Employee</h3>
          <form onSubmit={addEmployee} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">NIK</span>
              </label>
              <input
                type="text"
                name="nik"
                value={addForm.nik}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.nik && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.nik}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={addForm.name}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                autoComplete="new-off"
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.name && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.name}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="text"
                name="phone"
                value={addForm.phone}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.phone && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.phone}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                type="text"
                name="address"
                value={addForm.address}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.address && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.address}
                  </span>
                </label>
              )}

              <div className="flex gap-4 w-full">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Birth Place</span>
                  </label>
                  <input
                    type="text"
                    name="birth_place"
                    value={addForm.birth_place}
                    onChange={(e) => handleAddInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {addFormError.birth_place && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {addFormError.birth_place}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Birth Date</span>
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={addForm.birth_date}
                    onChange={(e) => handleAddInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {addFormError.birth_date && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {addFormError.birth_date}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={addForm.gender}
                    onChange={(e) => handleAddInput(e)}
                    className="input input-bordered input-primary border-slate-300 w-full"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {addFormError.gender && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {addFormError.gender}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <select
                name="position_id"
                value={addForm.position_id}
                onChange={(e) => handleAddInput(e)}
                className="input input-bordered input-primary border-slate-300 w-full"
              >
                <option value="">Unasigned</option>
                {positions.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
              </select>
              {addFormError.position_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.position_id}
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
          <h3 className="font-bold text-lg mb-4">Edit Employee</h3>
          <form onSubmit={putEmployee} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">NIK</span>
              </label>
              <input
                type="text"
                name="nik"
                value={putForm.nik}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.nik && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.nik}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={putForm.name}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                autoComplete="new-off"
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.name && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.name}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="text"
                name="phone"
                value={putForm.phone}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.phone && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.phone}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                type="text"
                name="address"
                value={putForm.address}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.address && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.address}
                  </span>
                </label>
              )}

              <div className="flex gap-4 w-full">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Birth Place</span>
                  </label>
                  <input
                    type="text"
                    name="birth_place"
                    value={putForm.birth_place}
                    onChange={(e) => handlePutInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {putFormError.birth_place && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {putFormError.birth_place}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Birth Date</span>
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={putForm.birth_date}
                    onChange={(e) => handlePutInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {putFormError.birth_date && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {putFormError.birth_date}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={putForm.gender}
                    onChange={(e) => handlePutInput(e)}
                    className="input input-bordered input-primary border-slate-300 w-full"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {putFormError.gender && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {putFormError.gender}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <select
                name="position_id"
                value={putForm.position_id}
                onChange={(e) => handlePutInput(e)}
                className="input input-bordered input-primary border-slate-300 w-full"
              >
                <option value="">Unasigned</option>
                {positions.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
              </select>
              {putFormError.position_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.position_id}
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
              <button className="btn btn-success rounded-md">Save</button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-details">
          <h3 className="font-bold text-lg mb-4">Detail Employee</h3>

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
              value={putForm.birth_place}
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

            <label className="label">
              <span className="label-text">Position</span>
            </label>
            <select
              name="position_id"
              value={putForm.position_id}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
            >
              <option value="">Unasigned</option>
              {positions.map((obj) => {
                return (
                  <option key={obj.id} value={obj.id}>
                    {obj.name}
                  </option>
                );
              })}
            </select>
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
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
