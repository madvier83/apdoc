import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import ModalDelete from "../../components/Modals/ModalDelete";

export default function Slots() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const addModalScrollRef = useRef();
  const putModalRef = useRef();
  const putModalScrollRef = useRef();
  const detailModalRef = useRef();

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(true);

  const initialForm = {
    id: "",
    // name: "",
    email: "",
    phone: "",
    role_id: "",
    clinic_id: "2",
    employee_id: "",
  };

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getUser() {
    try {
      const response = await axios.get("/user-slots", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setUsers(response.data);
      setUsersLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getRole() {
    try {
      const response = await axios.get("/access", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setRoles(response.data);
      setRolesLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getEmployee() {
    try {
      const response = await axios.get("/employees", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setEmployee(response.data);
      setEmployeeLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addRole(e) {
    console.log(putForm);
    e.preventDefault();
    try {
      const response = await axios.post(`/user-slot/${addForm.id}`, addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response);
      setAddForm(initialForm);
      setAddFormError(initialForm);
      addModalRef.current.click();
      getUser();
    } catch (err) {
      setAddFormError(err.response?.data);
      console.error(err);
    }
  }
  async function putRole(e) {
    console.log(putForm);
    e.preventDefault();
    try {
      const response = await axios.put(`/user-slot/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response);
      setPutForm(initialForm);
      setPutFormError(initialForm);
      putModalRef.current.click();
      getUser();
    } catch (err) {
      setPutFormError(err.response?.data);
      console.error(err);
    }
  }

  async function deleteRole(id) {
    // console.log(putForm);
    try {
      const response = await axios.delete(`/user-slot/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response);
      setPutForm(initialForm);
      setPutFormError(initialForm);
      putModalRef.current.click();
      getUser();
    } catch (err) {
      setPutFormError(err.response?.data);
      console.error(err);
    }
  }

  useEffect(() => {
    getUser();
    getRole();
    getEmployee();
  }, []);

  console.log(users);

  return (
    <>
      <DashboardLayout title="User Slots">
        <div className="flex gap-4">
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
            }
          >
            <div className="rounded-t mb-0 px-4 py-4 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className={"font-semibold text-lg "}>
                    <i className="fas fa-filter mr-3"></i> User Slots Table
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <label
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    htmlFor="modal-add"
                    onClick={() => {
                      addModalScrollRef.current.scroll({
                        top: 0,
                        // behavior: "smooth",
                      });
                    }}
                  >
                    Add slot <i className="fas fa-add"></i>
                  </label>
                </div>
              </div>
            </div>
            <div className="min-h-[80vh] block w-full overflow-x-auto">
              {/* Projects table */}
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      #
                    </th>
                    <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Employee
                    </th>
                    <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Role
                    </th>
                    <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Clinic
                    </th>
                    <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Expiration Date
                    </th>
                    <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Slot Status
                    </th>
                    <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Employee Status
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
                  {usersLoading && (
                    <tr>
                      <td colSpan={99}>
                        <div className="flex w-full justify-center my-4">
                          <img src="/loading.svg" alt="now loading" />
                        </div>
                      </td>
                    </tr>
                  )}
                  {users?.map((obj, index) => {
                    return (
                      <tr key={obj.id} className="hover:bg-zinc-50">
                        <th className="border-t-0 pl-6 border-l-0 border-r-0 text-xs whitespace-nowrap text-left py-4 flex items-center">
                          <span className={"ml-3 font-bold"}>{index + 1}</span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <span
                            className={`${
                              !obj.user?.name ? "opacity-40" : "font-bold"
                            }`}
                          >
                            {obj.user?.name || "Unasigned"}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <span className={``}>-</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <span className={``}>-</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <span className={``}>-</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <span className={"font-bold capitalize"}>
                            {obj.status || "-"}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <span
                            className={`${
                              obj.user?.is_verified == 1
                                ? "font-bold text-emerald-500"
                                : "opacity-40"
                            }`}
                          >
                            {obj.user?.is_verified == 1
                              ? "Verified"
                              : "Unverified"}
                          </span>
                        </td>
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          {moment(obj.created_at).format("DD MMM YYYY")}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          {moment(obj.updated_at).fromNow()}
                        </td> */}
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Settings"
                          >
                            {obj.user ? (
                              <label
                                className="bg-blue-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                htmlFor="modal-put"
                                onClick={() => {
                                  // console.log(obj);
                                  setPutFormError(initialForm);
                                  setPutForm({
                                    id: obj.id,
                                    // name: obj.user.name,
                                    email: obj.user.email,
                                    phone: obj.user.phone,
                                    role_id: obj.user.role_id,
                                    employee_id: obj.user.employee.id,
                                  });
                                }}
                              >
                                <i className="fas fa-cog"></i>
                              </label>
                            ) : (
                              <label
                                className="bg-blue-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                htmlFor="modal-add"
                                onClick={() => {
                                  setAddForm(initialForm);
                                  setAddForm({ initialForm, id: obj.id });
                                }}
                              >
                                <i className="fas fa-cog"></i>
                              </label>
                            )}
                          </div>
                          {/* <div
                            className="tooltip tooltip-left"
                            data-tip="Delete"
                          >
                            <label
                            className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            htmlFor={obj.id}
                          >
                            <i className="fas fa-trash"></i>
                          </label>
                          </div>
                          <ModalDelete
                            id={obj.id}
                            callback={() => deleteRole(obj.id)}
                            title={`Delete role?`}
                          ></ModalDelete> */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <ModalBox id="modal-put">
        <form onSubmit={putRole} autoComplete="off">
          <div className="overflow-y-scroll" ref={putModalScrollRef}>
            <h3 className="font-bold text-lg mb-4">Edit Slot</h3>
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Employee</span>
              </label>
              <select
                name="employee_id"
                onChange={(e) => handlePutInput(e)}
                // required
                value={putForm.employee_id}
                className="input input-bordered without-ring border-slate-300 w-full"
              >
                <option value="">Select</option>
                {employee?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
              </select>
              {putFormError.employee_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.employee_id}
                  </span>
                </label>
              )}
              {/* <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={putForm.name}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.name && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.name}
                  </span>
                </label>
              )} */}
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                name="email"
                disabled={true}
                value={putForm.email}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.email && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.email}
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
                <span className="label-text">Access</span>
              </label>
              <select
                name="role_id"
                onChange={(e) => handlePutInput(e)}
                required
                value={putForm.role_id}
                className="input input-bordered without-ring border-slate-300 w-full"
              >
                <option value="">Select</option>
                {roles?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.role.name}
                    </option>
                  );
                })}
              </select>
              {putFormError.role_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.role_id}
                  </span>
                </label>
              )}
            </div>
          </div>
          <div className="modal-action rounded-sm">
            <label
              htmlFor={putForm.id}
              className="btn btn-error text-white rounded-md mr-auto px-8"
            >
              Deactivate User
            </label>
            <label
              htmlFor="modal-put"
              ref={putModalRef}
              className="btn btn-ghost rounded-md"
            >
              Cancel
            </label>
            <button className="btn btn-success text-black rounded-md">
              Save
            </button>
          </div>
        </form>
      </ModalBox>

      <ModalDelete
        id={putForm.id}
        callback={() => deleteRole(putForm.id)}
        title={`Deactivate User?`}
      ></ModalDelete>

      <ModalBox id="modal-add">
        <form onSubmit={addRole} autoComplete="off">
          <div className="overflow-y-scroll" ref={addModalScrollRef}>
            <h3 className="font-bold text-lg mb-4">Assign Slot</h3>
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Employee</span>
              </label>
              <select
                name="employee_id"
                onChange={(e) => handleAddInput(e)}
                required
                value={addForm.employee_id}
                className="input input-bordered without-ring border-slate-300 w-full"
              >
                <option value="">Select</option>
                {employee?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
              </select>
              {addFormError.employee_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.employee_id}
                  </span>
                </label>
              )}
              {/* <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={addForm.name}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.name && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.name}
                  </span>
                </label>
              )} */}
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                name="email"
                value={addForm.email}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.email && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.email}
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
                <span className="label-text">Access</span>
              </label>
              <select
                name="role_id"
                onChange={(e) => handleAddInput(e)}
                required
                value={addForm.role_id}
                className="input input-bordered without-ring border-slate-300 w-full"
              >
                <option value="">Select</option>
                {roles?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.role.name}
                    </option>
                  );
                })}
              </select>
              {addFormError.role_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.role_id}
                  </span>
                </label>
              )}
            </div>
          </div>
          <div className="modal-action rounded-sm">
            <label
              htmlFor="modal-add"
              ref={addModalRef}
              className="btn btn-ghost rounded-md"
            >
              Cancel
            </label>
            <button className="btn btn-success text-black rounded-md">
              Save
            </button>
          </div>
        </form>
      </ModalBox>
    </>
  );
}
