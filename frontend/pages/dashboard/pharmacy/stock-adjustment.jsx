import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import numeral from "numeral";
import Highlighter from "react-highlight-words";

export default function StockAdjustment() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const putModalRef = useRef();
  const tableRef = useRef();

  const [clinic, setClinic] = useState();

  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [itemDb, setItemDb] = useState([]);
  const [itemDbLoading, setItemDbLoading] = useState(true);
  const [supplyDb, setSupplyDb] = useState([]);
  const [supplyDbLoading, setSupplyDbLoading] = useState(true);

  const initialItemForm = {
    clinic_id: "",
    item_id: 0,
    item_supply_id: "",
    adjustment: "",
    note: "",
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

  async function getItemDb() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `items/${clinic && clinic + "/"}${perpage}${
          searchCategory &&
          "/" +
            searchCategory
              .split(" ")
              .join("%")
              .replace(/[a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      setItemDb(response.data);
      setItemDbLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function getSupplyDb(id) {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(`item-supply/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setSupplyDb(response.data);
      setSupplyDbLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getItem() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `stock-adjustments/${clinic && clinic + "/"}${perpage}${
          search &&
          "/" +
            search
              .split(" ")
              .join("%")
              .replace(/[a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      setItem(response.data);
      setItemLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    try {
      const response = await axios.post("stock-adjustment", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getItem();
      setAddForm(initialItemForm);
      setAddFormError(initialItemForm);
    } catch (err) {
      setAddFormError(initialItemForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putItem(e) {
    e.preventDefault();
    console.log(putForm);
    try {
      const response = await axios.put(
        `stock-adjustment/${putForm.id}`,
        putForm,
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "application/json",
          },
        }
      );
      putModalRef.current.click();
      getItem();
      setPutForm(initialItemForm);
      setPutFormError(initialItemForm);
    } catch (err) {
      setPutFormError(initialItemForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteItem(id) {
    try {
      const response = await axios.delete(`stock-adjustment/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getItem();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getItem();
    getItemDb();
  }, []);

  useEffect(() => {
    getSupplyDb(addForm.item_id);
  }, [selectedCategory]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getItem();
      getItemDb();
    }, 300);

    if (page > item?.last_page) {
      setPage(item.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, clinic]);

  useEffect(() => {
    setSearch("");
    setPage(1);
    setAddForm({clinic_id: clinic})
  }, [clinic]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [item]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getItemDb();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchCategory]);

  return (
    <>
      <DashboardLayout
        title="Stock Adjustment"
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
                  <i className="fas fa-filter mr-3"></i> Stock Adjustment Table
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
                <label
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-add"
                  onClick={() => setSelectedCategory(null)}
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
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Item
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Before
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Adjustment
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Difference
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Note
                  </th>
                  {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Created At
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Updated At
                  </th> */}
                  {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {itemLoading && (
                  <tr>
                    <td colSpan={99}>
                      <div className="flex w-full justify-center my-4">
                        <img src="/loading.svg" alt="now loading" />
                      </div>
                    </td>
                  </tr>
                )}
                {!itemLoading && item.data?.length <= 0 && (
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
                {item?.data?.map((obj, index) => {
                  return (
                    <tr key={obj.id} className="hover:bg-zinc-50">
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                        <span className={"ml-3 font-bold"}>
                          {index + item.from}
                        </span>
                      </th>
                      <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                        <span className={"ml-3 font-bold"}>
                          <Highlighter
                            highlightClassName="bg-emerald-200"
                            searchWords={[search]}
                            autoEscape={true}
                            textToHighlight={obj.item_supply.item.name}
                          ></Highlighter>
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {obj.before}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {obj.adjustment}
                      </td>
                      <td
                        className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 font-semibold ${
                          obj.difference > 0
                            ? "text-emerald-500"
                            : "text-rose-400"
                        }`}
                      >
                        {obj.difference > 0 && "+"}
                        {obj.difference}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {obj.note}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.created_at).format("DD MMM YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td>
                      {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        -
                      </td> */}
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
          <h3 className="font-bold text-lg mb-4">Add Stock Adjustment</h3>
          <form onSubmit={addItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Item</span>
              </label>

              <div className="dropdown w-full">
                {selectedCategory?.id && (
                  <div className="p-0 overflow-hidden mb-1">
                    <div
                      className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs hover:bg-rose-200 border border-slate-300 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedCategory({});
                        setAddForm({ item_id: null });
                      }}
                    >
                      <div className="flex justify-end font-bold">
                        <i className="fas fa-x absolute collapse hidden group-hover:flex mt-1 transition-all text-rose-600"></i>
                      </div>
                      <div className="text-sm font-semibold flex">
                        <p className="text-left">{selectedCategory.name}</p>
                      </div>
                    </div>
                  </div>
                )}
                {!selectedCategory?.id && (
                  <>
                    <input
                      tabIndex={0}
                      type="text"
                      name="searchAdd"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      placeholder="Search service ..."
                      className="input input-bordered border-slate-300 w-full"
                    />
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                    >
                      {!itemDb?.data?.length && (
                        <li className="rounded-sm text-sm">
                          <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                            No data found
                          </div>
                        </li>
                      )}
                      {itemDb?.data?.map((obj) => {
                        return (
                          <li key={obj.id} className="p-0 overflow-hidden">
                            <div
                              className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                              onClick={() => {
                                setSelectedCategory(obj);
                                setAddForm({ item_id: obj.id });
                                setSearchCategory("");
                              }}
                            >
                              <p className="text-left">{obj.name}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
              {addFormError.item_supply_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.item_supply_id}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Item Supply</span>
              </label>
              <select
                name="item_supply_id"
                onChange={(e) => handleAddInput(e)}
                required
                value={addForm.item_supply_id}
                className="input input-bordered without-ring input-primary border-slate-300 w-full"
              >
                <option value="">Select</option>
                {supplyDb?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      Stock: {obj.stock} | Exp:{" "}
                      {moment(obj.expired).format("DD MMM YYYY")} | Created at:{" "}
                      {moment(obj.created_at).format("DD MMM YYYY")}
                    </option>
                  );
                })}
              </select>
              {addFormError.item_supply_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.item_supply_id}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Adjustment</span>
              </label>
              <input
                type="number"
                name="adjustment"
                value={addForm.adjustment}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.adjustment && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.adjustment}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Note</span>
              </label>
              <input
                type="text"
                name="note"
                value={addForm.note}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.note && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.note}
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
      </DashboardLayout>
    </>
  );
}
