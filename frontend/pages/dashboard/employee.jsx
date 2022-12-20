import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";

export default function Position() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const updateModalRef = useRef();

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(true);

  const [positionError, setPositionError] = useState("");

  const initialAddForm = {
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
    initialAddForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };

  const [updatePosition, setUpdatePosition] = useState({ id: "", name: "" });
  const [errorUpdatePosition, setErrorUpdatePosition] = useState("");

  async function getEmployee() {
    try {
      const response = await axios.get("/employee", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setEmployees(response.data);
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
    } catch (err) {
      console.error(err);
    }
  }

  async function addEmployee(e) {
    e.preventDefault();
    // if (!position) return;
    // console.log(addForm)
    setAddForm(initialAddForm)
    try {
      const response = await axios.post("/employee", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      addModalRef.current.click();
      getEmployee();
      setAddForm(initialAddForm);
    } catch (err) {
      console.error(err.response.data);
    }
  }

  async function putEmployee(e, id) {
    e.preventDefault();
    const data = {
      name: updatePosition.name,
    };
    try {
      const response = await axios.put(`employee/${id}`, data, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      updateModalRef.current.click();
      getEmployee();
    } catch (err) {
      // console.error(err.response.data.name[0]);
      setErrorUpdatePosition(err.response?.data.name[0]);
    }
  }

  async function deletePosition(id) {
    try {
      const response = await axios.delete(`position/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getEmployee();
    } catch (err) {
      // console.error(err.response.data.name[0]);
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
                <h3 className={"font-semibold text-lg "}>Employee Table</h3>
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
                  <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
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
                {employees?.map((obj, index) => {
                  return (
                    <tr key={obj.id}>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
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
                        <div className="tooltip tooltip-left" data-tip="Edit">
                          <label
                            className="bg-green-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            htmlFor="modal-update"
                            onClick={() => {
                              setUpdatePosition(obj);
                              setErrorUpdatePosition("");
                            }}
                          >
                            <i className="fas fa-pen-to-square"></i>
                          </label>
                        </div>
                        <div
                          className="tooltip tooltip-right"
                          data-tip="Delete"
                        >
                          <button
                            className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => deletePosition(obj.id)}
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

        {/* The button to open modal */}
        {/* <label htmlFor="modal-add" className="btn">
          open modal
        </label> */}

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Add Employee</h3>
          <form onSubmit={addEmployee} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label mt-3">
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
              {positionError && (
                <label className="label mt-3">
                  <span className="label-text-alt text-rose-300">
                    {positionError}
                  </span>
                </label>
              )}
              <label className="label mt-3">
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
              {positionError && (
                <label className="label mt-3">
                  <span className="label-text-alt text-rose-300">
                    {positionError}
                  </span>
                </label>
              )}
              <label className="label mt-3">
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
              <label className="label mt-3">
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
              {positionError && (
                <label className="label mt-3">
                  <span className="label-text-alt text-rose-300">
                    {positionError}
                  </span>
                </label>
              )}

              <div className="flex gap-4 w-full">
                <div className="w-full">
                  <label className="label mt-3">
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
                  {positionError && (
                    <label className="label mt-3">
                      <span className="label-text-alt text-rose-300">
                        {positionError}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label mt-3">
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
                  {positionError && (
                    <label className="label mt-3">
                      <span className="label-text-alt text-rose-300">
                        {positionError}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label mt-3">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    type="text"
                    name="gender"
                    value={addForm.gender}
                    defaultValue={addForm.gender}
                    onChange={(e) => handleAddInput(e)}
                    className="input input-bordered input-primary border-slate-300 w-full"
                  >
                    <option disabled value="">
                      Select
                    </option>
                    <option value="laki-laki">Male</option>
                    <option value="perempuan">Female</option>
                  </select>
                  {positionError && (
                    <label className="label mt-3">
                      <span className="label-text-alt text-rose-300">
                        {positionError}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <label className="label mt-3">
                <span className="label-text">Position</span>
              </label>
              <select
                name="position_id"
                value={addForm.position}
                // defaultValue={undefined}
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
              {positionError && (
                <label className="label mt-3">
                  <span className="label-text-alt text-rose-300">
                    {positionError}
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

        <ModalBox id="modal-update">
          <h3 className="font-bold text-lg mb-8">Update Position</h3>
          <form onSubmit={(e) => putEmployee(e, updatePosition.id)}>
            <div className="form-control w-full">
              <label className="label mt-3">
                <span className="label-text">Position name</span>
              </label>
              <input
                type="text"
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
                value={updatePosition.name}
                onChange={(e) =>
                  setUpdatePosition((prev) => {
                    return {
                      ...prev,
                      name: e.target.value,
                    };
                  })
                }
              />
              {errorUpdatePosition && (
                <label className="label mt-3">
                  <span className="label-text-alt text-rose-300">
                    {errorUpdatePosition}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-update"
                ref={updateModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-success rounded-md">Update</button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
