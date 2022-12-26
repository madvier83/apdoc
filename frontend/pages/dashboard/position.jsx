import React, { useEffect, useState, useRef } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";

export default function Position() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const updateModalRef = useRef();

  const [positions, setPosition] = useState([]);
  const [positionsLoading, setPostionsLoading] = useState(true);

  const [position, setPostion] = useState("");
  const [errorPosition, setErrorPosition] = useState("");
  const [updatePosition, setUpdatePosition] = useState({ id: "", name: "" });
  const [errorUpdatePosition, setErrorUpdatePosition] = useState("");

  async function getPositions() {
    try {
      const response = await axios.get("/positions", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setPosition(response.data);
      setPostionsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addPosition(e) {
    e.preventDefault();
    const data = {
      name: position,
    };
    try {
      const response = await axios.post("/position", data, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      addModalRef.current.click();
      setPostion("");
      setErrorPosition("");
      getPositions();
    } catch (err) {
      setErrorPosition(err.response?.data.name[0]);
    }
  }

  async function putPosition(e, id) {
    e.preventDefault();
    const data = {
      name: updatePosition.name,
    };
    try {
      const response = await axios.put(`position/${id}`, data, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      updateModalRef.current.click();
      getPositions();
    } catch (err) {
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
      getPositions();
    } catch (err) {
      // console.error(err.response.data.name[0]);
    }
  }

  useEffect(() => {
    getPositions();
    // console.log(positions);
  }, []);

  return (
    <>
      <DashboardLayout title="Positions">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-32 mt-1 min-h-fit shadow-lg rounded text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}><i className="fas fa-filter mr-3"></i> Postitions Table</h3>
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
                {positionsLoading && (
                  <tr>
                    <td colSpan={99}>
                      <div className="flex w-full justify-center my-4">
                        <img src="/loading.svg" alt="now loading" />
                      </div>
                    </td>
                  </tr>
                )}
                {positions?.map((obj, index) => {
                  return (
                    <tr key={obj.id}>
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                        <span className={"ml-3 font-bold"}>{index + 1}</span>
                      </th>
                      <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                        <span className={"ml-3 font-bold"}>{obj.name}</span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {moment(obj.created_at).fromNow()}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {moment(obj.updated_at).fromNow()}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {/* <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                        Active */}
                        <div className="tooltip tooltip-left" data-tip="Edit">
                          <label
                            className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
                          className="tooltip tooltip-left"
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
          <h3 className="font-bold text-lg mb-8">Add Position</h3>
          <form onSubmit={addPosition}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Position name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-primary border-slate-300 w-full"
                value={position}
                onChange={(e) => setPostion(e.target.value)}
              />
              {errorPosition && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {errorPosition}
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
          <form onSubmit={(e) => putPosition(e, updatePosition.id)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Position name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
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
                <label className="label">
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
