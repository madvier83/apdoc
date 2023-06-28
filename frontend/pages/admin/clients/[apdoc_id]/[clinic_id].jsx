import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../../api/axios";
import AdminLayout from "../../../../layouts/AdminLayout";
import { useRouter } from "next/router";
import Highlighter from "react-highlight-words";
import { GetCookieChunk } from "../../../../services/CookieChunk";

export default function Client() {
  const token = GetCookieChunk("token_");
  const router = useRouter();

  const tableRef = useRef();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [clients, setClients] = useState([]);
  const [clientLoading, setClientLoading] = useState(true);

  async function getSlots() {
    try {
      const response = await axios.get(`/user-slots/${router.query?.clinic_id}/clinic`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      console.log(response);
      setClients(response.data);
      setClientLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getSlots();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      return;
    }

    const getData = setTimeout(() => {
      getSlots();
    }, 300);

    if (page > clients?.last_page) {
      setPage(clients.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, router.isReady]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [clients]);

  return (
    <>
      <AdminLayout title="Slots">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Slots Table
                </h3>
              </div>
              {/* <div className="relative">
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
                  className="input input-bordered input-xs input-primary border-slate-300 w-64 text-xs m-0"
                />
                <i
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className={`fas ${
                    !search ? "fa-search" : "fa-x"
                  } absolute text-slate-400 right-4 top-[6px] text-xs`}
                ></i>
              </div> */}
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right"></div>
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
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Name
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
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientLoading && (
                  <tr>
                    <td colSpan={99}>
                      <div className="flex w-full justify-center my-4">
                        <img src="/loading.svg" alt="now loading" />
                      </div>
                    </td>
                  </tr>
                )}
                {!clientLoading && clients?.length <= 0 && (
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
                {clients?.map((obj, index) => {
                  return (
                    <tr
                      key={obj.id}
                      className="hover:bg-zinc-50 cursor-pointer"
                    >
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                        <span className={"ml-3 font-bold "}>{index + 1}</span>
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
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span className={"capitalize"}>
                          <span>{obj.user?.role?.name}</span>
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span className={"capitalize"}>
                          <span>{""}</span>
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span className={"capitalize"}>
                          <span>{""}</span>
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span className={"capitalize font-bold"}>
                          {obj.status || "-"}
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
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
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {/* <div
                          className="tooltip tooltip-left"
                          data-tipClients"
                        > */}
                        {/* <label
                          className="bg-violet-500 text-white active:bg-violet-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => {
                            router.push(`${obj.clinic_id}`);
                          }}
                        >
                          <i className="fa-solid fa-house-chimney-medical"></i>
                        </label> */}
                        {/* </div> */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* <div className="flex">
            <div className="flex w-full py-2 mt-1 rounded-b-md gap-8 justify-center bottom-0 items-center align-bottom select-none bg-gray-50">
              <small className="w-44 text-right truncate">
                Results {clients.from}-{clients.to} of {clients.total}
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
                  max={clients.last_page}
                  onChange={(e) => setPage(e.target.value)}
                />
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= clients.last_page ? true : false}
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= clients.last_page ? true : false}
                  onClick={() => {
                    setPage(clients.last_page);
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
          </div> */}
        </div>
      </AdminLayout>
    </>
  );
}
