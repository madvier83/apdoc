import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import numeral from "numeral";
import ModalDelete from "../../../components/Modals/ModalDelete";
import Loading from "../../../components/loading";

export default function History() {
  const token = getCookies("token");

  const tableRef = useRef();

  const [clinic, setClinic] = useState();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const [sortBy, setSortBy] = useState("patient_id");
  const [order, setOrder] = useState(true);

  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState({});

  async function getItem() {
    if (!clinic) {
      return;
    }
    setItemLoading(true)
    try {
      const response = await axios.get(
        `transactions/${clinic && clinic + "/"}${perpage}${
          search &&
          "/" +
            search
              .split(" ")
              .join("%")
              .replace(/[a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}&sortBy=${sortBy}&order=${order ? "asc" : "desc"}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      setItem(response.data);
      setItemLoading(false);
      // console.log(response.data);
    } catch (err) {
      console.error(err);
      setItem({})
      setItemLoading(false);
    }
  }

  async function cancelTransaction(id) {
    try {
      const response = await axios.put(
        `transaction/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      getItem();
    } catch (err) {
      console.error(err);
    }
  }

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
    tableRef.current.scroll({
      top: 0,
    });
  }, [item]);

  useEffect(() => {
    setSearch("");
    setPage(1);
  }, [clinic]);

  useEffect(() => {
    getItem();
  }, []);

  // console.log(item)

  return (
    <>
      <DashboardLayout title="History" clinic={clinic} setClinic={setClinic}>
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> History Table
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
                  } absolute text-slate-400 right-0 pr-4 cursor-pointer  top-[6px] text-xs`}
                ></i>
              </div>

              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                {/* <label
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-add"
                >
                  Add <i className="fas fa-add"></i>
                </label> */}
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
                        sortBy == "is_cancelled" && setOrder((p) => !p);
                        setSortBy("is_cancelled");
                      }}
                    >
                      <p>Status</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "is_cancelled" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "code" && setOrder((p) => !p);
                        setSortBy("code");
                      }}
                    >
                      <p>Code</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "code" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "total" && setOrder((p) => !p);
                        setSortBy("total");
                      }}
                    >
                      <p>Total</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "total" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "payment" && setOrder((p) => !p);
                        setSortBy("payment");
                      }}
                    >
                      <p>Payment</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "payment" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "payment" && setOrder((p) => !p);
                        setSortBy("payment");
                      }}
                    >
                      <p>Payment Method</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "payment" && "opacity-40"
                        }`}
                      ></i>
                    </div>
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
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <i
                            className={`text-md mr-2 ${
                              obj.patient.gender == "male"
                                ? "text-blue-400 fas fa-mars"
                                : "text-pink-400 fas fa-venus"
                            }`}
                          ></i>{" "}
                          <span className={"font-bold"}>
                            {obj.patient.name}
                          </span>
                        </td>
                        <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                          <span className={"ml-3"}>
                            <i
                              className={`fas fa-circle mr-2 ${
                                !obj.is_cancelled
                                  ? "text-emerald-400"
                                  : "text-orange-500"
                              }`}
                            ></i>{" "}
                            {!obj.is_cancelled ? "Completed" : "Canceled"}
                          </span>
                        </td>
                        <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                          <span className={"ml-3"}>{obj.code}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>Rp. {numeral(obj.total).format("0,0")}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>Rp. {numeral(obj.payment).format("0,0")}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>{obj.payment_method?.name || "Cash"}</span>
                        </td>
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.created_at).format("DD MMM YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td> */}
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          {/* <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                        Active */}
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Detail"
                          >
                            <label
                              className="bg-violet-500 text-white active:bg-violet-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              htmlFor="modal-details"
                              onClick={() => {
                                // setPutForm(obj);
                                setSelectedQueue(obj);
                              }}
                            >
                              <i className="fas fa-eye"></i>
                            </label>
                          </div>
                          {/* <div className="tooltip tooltip-left" data-tip="Edit">
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
                        </div> */}
                          {obj.is_cancelled ? (
                            <div
                              className="tooltip tooltip-left"
                              data-tip="Undo"
                            >
                              <label
                                className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                onClick={() => cancelTransaction(obj.id)}
                              >
                                <i className="fas fa-undo"></i>
                              </label>
                            </div>
                          ) : (
                            <div
                              className="tooltip tooltip-left"
                              data-tip="Cancel"
                            >
                              <label
                                className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                htmlFor={obj.id}
                              >
                                <i className="fas fa-trash"></i>
                              </label>
                            </div>
                          )}
                          <ModalDelete
                            id={obj.id}
                            callback={() => cancelTransaction(obj.id)}
                            title={`Cancel transaction ${obj.code}?`}
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

        <ModalBox id="modal-details">
          <div className="card min-h-[74vh] rounded-md md:w-full bg-base-100">
            <label
              htmlFor="modal-details"
              className="btn btn-ghost hover:bg-transparent rounded-md absolute -right-4 -top-4"
            >
              <i className="fas fa-x"></i>
            </label>
            <div
              className={`card-body p-2 justify-between ${
                selectedQueue?.id ? "" : "hidden"
              }`}
            >
              <div className="">
                <div className="flex items-center">
                  <div className="w-full">
                    <h2 className="card-title text-base lg:text-2xl text-zinc-900 truncate">
                      {selectedQueue?.patient?.name}
                    </h2>
                    <small className="text-zinc-400">
                      NIK: {selectedQueue?.patient?.nik}
                      {/* {selectedQueue?.status_id == 1 && "Active"}
                          {selectedQueue?.status_id == 2 && "Done"}
                          {selectedQueue?.status_id == 3 && "Canceled"} */}
                    </small>
                    <div className="border-t border-dashed mt-4"></div>
                  </div>
                </div>
                <div className="px-0">
                  <div className="relative">
                    <div className="w-full">
                      <div
                        // ref={queuesRef}
                        // {...queuesEvents}
                        className="overflow-y-scroll h-full mb-4"
                      >
                        <div className="mt-4">
                          <small className="text-zinc-400">Services</small>{" "}
                          <br />
                        </div>
                        <div className="flex flex-col mt-1 gap-1 rounded-md overflow-hidden">
                          <div className="">
                            <div
                              className={`flex justify-between overflow-hidden items-center px-1`}
                            >
                              <table
                                className={`group w-full text-sm breadcrumbs font-semibold text-zinc-800`}
                              >
                                <tbody>
                                  {selectedQueue?.transaction_services?.map(
                                    (obj) => {
                                      return (
                                        <React.Fragment key={obj?.id}>
                                          <tr className="rounded-md transition-all duration-300">
                                            <td
                                              className={`w-2/3 py-2 overflow-hidden`}
                                            >
                                              <span
                                                className="truncate cursor-pointer"
                                                // onClick={() => {
                                                //   promotionRef.current.click();
                                                //   setSelectedCart(obj);
                                                // }}
                                              >
                                                {obj.service.name}
                                              </span>
                                            </td>
                                            <td
                                              className={`text-center w-16 overflow-hidden`}
                                            ></td>
                                            <td className={`text-right w-22`}>
                                              <div className="div flex justify-between items-center">
                                                <div
                                                  className="tooltip tooltip-left"
                                                  data-tip="Add Discount"
                                                >
                                                  {obj.discount <= 0 && (
                                                    <label
                                                      htmlFor="addServicePromotionModal"
                                                      className="opacity-0 group-hover:xopacity-100 btn-sm text-blue-500 hover:bg-zinc-100"
                                                      // onClick={() =>
                                                      //   setSelectedServiceCart(
                                                      //     obj
                                                      //   )
                                                      // }
                                                    >
                                                      <i className="fas fa-tag"></i>
                                                    </label>
                                                  )}
                                                </div>
                                                <label
                                                  htmlFor="addServicePromotionModal"
                                                  className=""
                                                  // onClick={() =>
                                                  //   setSelectedServiceCart(
                                                  //     obj
                                                  //   )
                                                  // }
                                                >
                                                  <span>
                                                    {" "}
                                                    {numeral(
                                                      obj.service.price
                                                    ).format("0,0")}
                                                  </span>
                                                </label>
                                              </div>
                                            </td>
                                          </tr>
                                          {obj.discount > 0 && (
                                            <tr className="text-emerald-400 py-2 text-sm">
                                              <td
                                                className={`w-2/3 overflow-hidden`}
                                              >
                                                <span className="truncate">
                                                  ⤷ Discount{" "}
                                                  {obj.promotion.name} (
                                                  {obj.promotion.discount}%)
                                                </span>
                                              </td>
                                              <td
                                                className={`text-center w-16 overflow-hidden`}
                                              ></td>
                                              <td
                                                className={`text-right w-22 flex justify-between`}
                                              >
                                                <div
                                                  className=" tooltip-left"
                                                  data-tip=""
                                                >
                                                  <button
                                                    className="btn btn-ghost opacity-0 group-hover:xopacity-100 btn-sm text-rose-400 hover:bg-zinc-100"
                                                    // onClick={() => {
                                                    //   removeServiceCartPromotion(
                                                    //     obj
                                                    //   );
                                                    // }}
                                                  >
                                                    <i className="fas fa-trash"></i>
                                                  </button>
                                                </div>
                                                <span className="flex justify-end items-center">
                                                  {"-"}
                                                  {numeral(
                                                    (obj.service.price *
                                                      obj.promotion.discount) /
                                                      100
                                                  ).format("0,0")}
                                                </span>
                                              </td>
                                            </tr>
                                          )}
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <small className="text-zinc-400">Items</small>{" "}
                          {/* {cart.array?.length > 0 && (
                                <small
                                  className="animate-pulse btn btn-ghost btn-xs normal-case text-zinc-400"
                                  onClick={clearCart}
                                >
                                  Clear X
                                </small>
                              )} */}
                        </div>
                        <div className="flex flex-col mt-1 gap-1 rounded-md overflow-hidden">
                          <div className="">
                            <div
                              className={`flex justify-between overflow-hidden items-center px-1`}
                            >
                              <table
                                className={`group w-full text-sm breadcrumbs font-semibold text-zinc-800`}
                              >
                                <tbody>
                                  {selectedQueue?.transaction_items?.map(
                                    (obj) => {
                                      return (
                                        <React.Fragment key={obj?.id}>
                                          <tr className="rounded-md transition-all duration-300">
                                            <td
                                              className={`w-2/3 py-2 overflow-hidden`}
                                            >
                                              <span
                                                className="truncate cursor-pointer"
                                                // onClick={() => {
                                                //   promotionRef.current.click();
                                                //   setSelectedCart(obj);
                                                // }}
                                              >
                                                {obj.item?.name}
                                              </span>
                                              <span className="ml-2 opacity-50">
                                                #{" "}
                                                {numeral(
                                                  obj.item?.sell_price
                                                ).format("0,0")}
                                              </span>
                                            </td>
                                            <td
                                              className={`text-center w-16 overflow-hidden`}
                                            >
                                              <div
                                                className={`grid grid-flow-col items-center group-[${obj?.id}]:`}
                                              >
                                                {/* <button
                                                    // onClick={() =>
                                                    //   addToCart(obj, true)
                                                    // }
                                                    className="btn btn-sm btn-ghost opacity-20 group-hover:xopacity-100 pr-1 text-zinc-400 active:bg-zinc-100 hover:bg-zinc-100"
                                                  >
                                                    <i className="fas fa-caret-left"></i>
                                                  </button> */}
                                                <span>{obj.qty}</span>
                                                {/* <button
                                                    onClick={() =>
                                                      addToCart(obj)
                                                    }
                                                    className="btn btn-sm btn-ghost opacity-20 group-hover:xopacity-100 pl-1 text-zinc-400 active:bg-zinc-100 hover:bg-zinc-100"
                                                  >
                                                    <i className="fas fa-caret-right"></i>
                                                  </button> */}
                                              </div>
                                            </td>
                                            <td className={`text-right w-22`}>
                                              <div className="div flex justify-between items-center">
                                                <div
                                                  className="tooltip tooltip-left"
                                                  data-tip="Add Discount"
                                                >
                                                  {obj.discount <= 0 && (
                                                    <label
                                                      htmlFor="addPromotionModal"
                                                      className="btn btn-ghost opacity-0 group-hover:xopacity-100 btn-sm text-blue-500 hover:bg-zinc-100"
                                                      // onClick={() =>
                                                      //   setSelectedCart(obj)
                                                      // }
                                                    >
                                                      <i className="fas fa-tag"></i>
                                                    </label>
                                                  )}
                                                </div>
                                                <label
                                                  htmlFor="addPromotionModal"
                                                  className=""
                                                  // onClick={() =>
                                                  //   setSelectedCart(obj)
                                                  // }
                                                >
                                                  <span>
                                                    {" "}
                                                    {numeral(
                                                      obj.item.sell_price *
                                                        obj.qty
                                                    ).format("0,0")}
                                                  </span>
                                                </label>
                                              </div>
                                            </td>
                                          </tr>
                                          {obj.discount > 0 && (
                                            <tr className="text-emerald-400 py-2 text-sm">
                                              <td
                                                className={`w-2/3 overflow-hidden`}
                                              >
                                                <span className="truncate">
                                                  ⤷ Discount{" "}
                                                  {obj.promotion.name} (
                                                  {obj.promotion.discount}%)
                                                </span>
                                              </td>
                                              <td
                                                className={`text-center w-16 overflow-hidden`}
                                              ></td>
                                              <td
                                                className={`text-right w-22 flex justify-between`}
                                              >
                                                <div
                                                  className=" tooltip-left"
                                                  data-tip=""
                                                >
                                                  <button
                                                    className="btn btn-ghost opacity-0 xgroup-hover:xopacity-100 btn-sm text-rose-400 hover:bg-zinc-100"
                                                    // onClick={() => {
                                                    //   removeCartPromotion(obj);
                                                    // }}
                                                  >
                                                    <i className="fas fa-trash"></i>
                                                  </button>
                                                </div>
                                                <span className="flex justify-end items-center">
                                                  {"-"}
                                                  {numeral(
                                                    (obj.item.sell_price *
                                                      obj.qty *
                                                      obj.promotion.discount) /
                                                      100
                                                  ).format("0,0")}
                                                </span>
                                              </td>
                                            </tr>
                                          )}
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-min">
                <div className="flex justify-between w-full text-sm border-dashed border-t pt-2">
                  <p className="font-semibold ml-1">Subtotal</p>
                  <p className="font-semibold ml-1 text-right">
                    {numeral(
                      selectedQueue.total + selectedQueue.discount
                    ).format("0,0")}
                  </p>
                </div>
                <div className="flex justify-between w-full text-sm py-2">
                  <p className="font-semibold ml-1">Total Discount</p>
                  <p className="font-semibold ml-1 text-right">
                    {numeral(selectedQueue.discount).format("0,0")}
                  </p>
                </div>
                <div className="flex justify-between border-t-zinc-300 border-dashed border-t w-full text-xl pt-2">
                  <p className="font-semibold ml-1">Total</p>
                  <p className="font-semibold ml-1 text-right">
                    {numeral(selectedQueue.total).format("0,0")}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`card-body justify-between ${
                selectedQueue?.id ? "hidden" : ""
              }`}
            >
              <div className="alert py-4 btn-primary rounded-md">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current flex-shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Select patient</span>
                </div>
              </div>
            </div>
          </div>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
