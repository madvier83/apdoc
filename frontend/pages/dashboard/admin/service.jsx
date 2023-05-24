import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";
import numeral from "numeral";

import axios from "../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import ModalDelete from "../../../components/Modals/ModalDelete";
import Highlighter from "react-highlight-words";

import CurrencyInput from "react-currency-input-field";
import Loading from "../../../components/loading";

export default function Service() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const putModalRef = useRef();
  const tableRef = useRef();

  const [clinic, setClinic] = useState();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState(true);

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const initialServiceForm = {
    clinic_id: "",
    id: "",
    name: "",
    price: "",
    commission: "",
  };

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialServiceForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialServiceForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialServiceForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialServiceForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getServices() {
    if (!clinic) {
      return;
    }
    setServicesLoading(true)
    try {
      const response = await axios.get(
        `services/${clinic && clinic + "/"}${perpage}${
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
            Authorization: "Bearer" + token.token,
          },
        }
      );
      setServices(response.data);
      setServicesLoading(false);
    } catch (err) {
      console.error(err);
      setClinic({})
      setServicesLoading(false);
    }
  }

  async function addService(e) {
    e.preventDefault();
    try {
      const response = await axios.post("service", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getServices();
      setAddForm(initialServiceForm);
      setAddFormError(initialServiceForm);
    } catch (err) {
      setAddFormError(initialServiceForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putService(e) {
    e.preventDefault();
    console.log(putForm);
    try {
      const response = await axios.put(`service/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      putModalRef.current.click();
      getServices();
      setPutForm(initialServiceForm);
      setPutFormError(initialServiceForm);
    } catch (err) {
      setPutFormError(initialServiceForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteService(id) {
    try {
      const response = await axios.delete(`service/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getServices();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      getServices();
    }, 300);

    if (page > services?.last_page) {
      setPage(services.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, clinic, sortBy, order]);

  useEffect(() => {
    setSearch("");
    setPage(1);
    setAddForm({ clinic_id: clinic });
  }, [clinic]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [services]);
  
  return (
    <>
      <DashboardLayout title="Services" clinic={clinic} setClinic={setClinic}>
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Services Table
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
                        sortBy == "name" && setOrder((p) => !p);
                        setSortBy("name");
                      }}
                    >
                      <p>Service</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "name" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "price" && setOrder((p) => !p);
                        setSortBy("price");
                      }}
                    >
                      <p>Price</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "price" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "commission" && setOrder((p) => !p);
                        setSortBy("commission");
                      }}
                    >
                      <p>Commission</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "commission" && "opacity-40"
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
                <Loading data={services} dataLoading={servicesLoading} reload={getServices}></Loading>
                {!servicesLoading && services?.data?.map((obj, index) => {
                  return (
                    <tr key={obj.id} className="hover:bg-zinc-50">
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left flex items-center">
                        <span className={"ml-3 font-bold "}>
                          {index + services.from}
                        </span>
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span className={"font-bold"}>
                          <Highlighter
                            highlightClassName="bg-emerald-200"
                            searchWords={[search]}
                            autoEscape={true}
                            textToHighlight={obj.name}
                          ></Highlighter>
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span className={"font-semibold capitalize"}>
                          Rp. {numeral(obj.price).format("0,0")}
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        <span className={"font-semibold"}>
                          Rp. {numeral(obj.commission).format("0,0")}
                        </span>
                      </td>
                      {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.created_at).format("DD MMM YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td> */}
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {/* <div className="tooltip tooltip-left" data-tip="Edit"> */}
                        <label
                          className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          htmlFor="modal-put"
                          onClick={() => {
                            setPutForm(obj);
                            setPutFormError(initialServiceForm);
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
                          callback={() => deleteService(obj.id)}
                          title={`Delete service?`}
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
                Results {services.from}-{services.to} of {services.total}
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
                  max={services.last_page}
                  onChange={(e) => setPage(e.target.value)}
                />
                {/* <p className="font-bold w-8 text-center">{page}</p> */}
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= services.last_page ? true : false}
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= services.last_page ? true : false}
                  onClick={() => {
                    setPage(services.last_page);
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
          <h3 className="font-bold text-lg mb-4">Add Service</h3>
          <form onSubmit={addService} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
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
              )}
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <CurrencyInput
                name="price"
                defaultValue={0}
                value={addForm.price}
                decimalsLimit={2}
                onValueChange={(value, name) => setAddForm({price: value})}
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.price}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Commission</span>
              </label>
              <CurrencyInput
                name="commission"
                defaultValue={0}
                value={addForm.commission}
                decimalsLimit={2}
                onValueChange={(value, name) => setAddForm({commission: value})}
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.commission && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.commission}
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
          <h3 className="font-bold text-lg mb-4">Update Service</h3>
          <form onSubmit={putService} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
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
              )}
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <CurrencyInput
                name="price"
                defaultValue={0}
                value={putForm.price}
                decimalsLimit={2}
                onValueChange={(value, name) => setPutForm({price: value})}
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.price}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Commission</span>
              </label>
              <CurrencyInput
                name="commission"
                defaultValue={0}
                value={putForm.commission}
                decimalsLimit={2}
                onValueChange={(value, name) => setPutForm({commission: value})}
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.commission && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.commission}
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
