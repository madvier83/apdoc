import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getCookies } from "cookies-next";
import ModalBox from "../../components/Modals/ModalBox";

export default function Position() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const updateModalRef = useRef();

  const [positions, setPostions] = useState([]);
  const [positionsLoading, setPostionsLoading] = useState(true);

  const [position, setPostion] = useState("");
  const [updatePosition, setUpdatePosition] = useState({id: "", name: ""});

  async function getPositions() {
    try {
      const response = await axios.get("/position", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setPostions(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addPosition(e) {
    e.preventDefault();
    if (!position) return;
    const data = {
      name: position,
    };
    try {
      const response = await axios.post("/position", data, {
        headers: {
          "Authorization": "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      addModalRef.current.click();
      setPostion("");
      getPositions();
    } catch (err) {
      console.error(err);
    }
  }

  async function putPosition(e, id) {
    e.preventDefault()
    const data = {
      name: updatePosition.name
    }
    try {
      const response = await axios.put(`position/${id}`, data, {
        headers: {
          "Authorization": "Bearer" + token.token,
          "Content-Type": "application/json",
        }
      })
      updateModalRef.current.click();
      getPositions()
    } catch(err) {
      console.error(err)
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
      console.error(err);
    }
  }

  useEffect(() => {
    getPositions();
    // console.log(positions);
  }, []);

  return (
    <>
      <DashboardLayout title="Position">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-32 mt-1 min-h-fit shadow-lg rounded text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>Postition Table</h3>
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
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Name
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Created At
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Acitons
                  </th>
                </tr>
              </thead>
              <tbody>
                {positions?.map((obj) => {
                  return (
                    <tr key={obj.id}>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                        <span className={"ml-3 font-bold "}>{obj.name}</span>
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {obj.created_at}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {/* <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                        Active */}
                        <label
                          className="bg-emerald-500 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          htmlFor="modal-update"
                          onClick={() => setUpdatePosition(obj)}
                        >
                          <i className="fas fa-edit"></i>
                        </label>
                        <button
                          className="bg-rose-500 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => deletePosition(obj.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
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
              <label className="label">
                {/* <span className="label-text-alt">Alt label</span> */}
              </label>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-add"
                ref={addModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-primary rounded-md">Save</button>
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
                onChange={(e) => setUpdatePosition((prev) => {
                  return {
                    ...prev,
                    name: e.target.value
                  }
                })}
              />
              <label className="label">
                {/* <span className="label-text-alt">Alt label</span> */}
              </label>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-update"
                ref={updateModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-primary rounded-md">Save</button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
