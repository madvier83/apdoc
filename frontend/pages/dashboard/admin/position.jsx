import React, { useEffect, useState, useRef } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import ModalDelete from "../../../components/Modals/ModalDelete";
import Highlighter from "react-highlight-words";

export default function Position() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const updateModalRef = useRef();
  const tableRef = useRef();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [positions, setPosition] = useState([]);
  const [positionsLoading, setPostionsLoading] = useState(true);

  const [position, setPostion] = useState("");
  const [errorPosition, setErrorPosition] = useState("");
  const [updatePosition, setUpdatePosition] = useState({ id: "", name: "" });
  const [errorUpdatePosition, setErrorUpdatePosition] = useState("");

  async function getPositions() {
    try {
      const response = await axios.get(
        `positions/${perpage}${
          search &&
          "/" +
            search
              .split(" ")
              .join("%")
              .replace(/[^a-zA-Z0-9]/, "")
        }?page=${page}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
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

  useEffect(() => {
    const getData = setTimeout(() => {
      getPositions();
    }, 300);

    if (page > positions?.last_page) {
      setPage(positions.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [positions]);

  return (
    <>
      <DashboardLayout title="Positions">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Postitions Table
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
                  <th className="pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    #
                  </th>
                  <th className="pl-3 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Name
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Created At
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Updated At
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Actions
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
                {!positionsLoading && positions.data?.length <= 0 && (
                  <tr>
                    <td colSpan={99}>
                      <div className="flex w-full justify-center mt-48">
                        <div className="text-center">
                          <h1 className="text-xl">No data found</h1>
                          <small>
                            Data is empty or try adjusting your filter
                          </small>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {positions?.data?.map((obj, index) => {
                  return (
                    <tr key={obj.id} className="hover:bg-zinc-50">
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 text-left">
                        <span className={"ml-3 font-bold"}>
                          {index + positions.from}
                        </span>
                      </th>
                      <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 text-left">
                        <span className={"ml-3 font-bold"}>
                          <Highlighter
                            highlightClassName="bg-emerald-200"
                            searchWords={[search]}
                            autoEscape={true}
                            textToHighlight={obj.name}
                          ></Highlighter>
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                        {moment(obj.created_at).format("DD MMM YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                        {moment(obj.updated_at).fromNow()}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                        {/* <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                        Active */}
                        {/* <div className="tooltip tooltip-left" data-tip="Edit"> */}
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
                        {/* </div> */}
                        {/* <div className="tooltip tooltip-left" data-tip="Delete"> */}
                        <label
                          className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          htmlFor={obj.id}
                        >
                          <i className="fas fa-trash"></i>
                        </label>
                        {/* </div> */}
                        <ModalDelete
                          id={obj.id}
                          callback={() => deletePosition(obj.id)}
                          title={`Delete position?`}
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
                Results {positions.from}-{positions.to} of {positions.total}
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
                  max={positions.last_page}
                  onChange={(e) => setPage(e.target.value)}
                />
                {/* <p className="font-bold w-8 text-center">{page}</p> */}
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= positions.last_page ? true : false}
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= positions.last_page ? true : false}
                  onClick={() => {
                    setPage(positions.last_page);
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

        {/* The button to open modal */}
        {/* <label htmlFor="modal-add" className="btn">
          open modal
        </label> */}

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Add Position</h3>
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
          <h3 className="font-bold text-lg mb-4">Update Position</h3>
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
