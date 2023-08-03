import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment"; 
import "moment/locale/id";
moment.locale("id");

import axios from "../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import numeral, { options } from "numeral";
import Highlighter from "react-highlight-words";
import Loading from "../../../components/loading";
import { GetCookieChunk } from "../../../services/CookieChunk";
import SelectedClinicBadge from "../../../components/SelectedClinicBadge";

export default function ItemSupply() {
  const token = GetCookieChunk("token_");

  const detailModalRef = useRef();
  const addModalRef = useRef();
  const putModalRef = useRef();
  const tableRef = useRef();
  const exportModalRef = useRef();

  const [selectedItem, setSelectedItem] = useState({});

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();

  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState(true);

  const [clinic, setClinic] = useState();

  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [itemDb, setItemDb] = useState([]);
  const [itemDbLoading, setItemDbLoading] = useState(true);

  const initialItemForm = {
    clinic_id: "",
    item_id: "",
    item_variant_id: "",
    total: "",
    manufacturing: "",
    expired: "",
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
    setItemDbLoading(true);
    try {
      const response = await axios.get(
        `items/${clinic && clinic + "/"}${perpage}${
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
            Authorization: "Bearer" + token,
          },
        }
      );
      setItemDb(response.data);
      setItemDbLoading(false);
    } catch (err) {
      console.error(err);
      setItemDbLoading(false);
    }
  }

  async function getItem() {
    if (!clinic) {
      return;
    }
    setItemLoading(true);
    try {
      const response = await axios.get(
        `items/${clinic && clinic + "/"}${perpage}${
          searchCategory &&
          "/" +
            searchCategory
              .split(" ")
              .join("%")
              .replace(/[^a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}&sortBy=${sortBy}&order=${order ? "asc" : "desc"}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      setItem(response.data);
      setItemLoading(false);
    } catch (err) {
      console.error(err);
      setItemLoading(false);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    try {
      const response = await axios.post("item-supply", addForm, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getItemDb();
      setAddForm(initialItemForm);
      setAddForm({ clinic_id: clinic });
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
      const response = await axios.put(`item-supply/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "application/json",
        },
      });
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
      const response = await axios.delete(`item-supply/${id}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      getItem();
    } catch (err) {
      console.error(err);
    }
  }

  async function downloadTable() {
    if (!clinic) {
      return;
    }
    try {
      axios({
        url: `export/patient?clinic=${clinic}`,
        method: "GET",
        responseType: "blob",
        headers: {
          Authorization: "Bearer" + token,
        },
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Patients_${clinic}_${moment().format("YYYY-MM-DD")}.xlsx`
          );
          document.body.appendChild(link);

          link.click();

          link.parentNode.removeChild(link);
        })
        .catch((error) => {
          console.error("Error downloading file:", error);
        });
    } catch (err) {
      console.error(err);
    }
  }

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  async function uploadTable() {
    let formData = new FormData();
    formData.append("file", selectedFile);

    for (let [key, value] of formData) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axios.post(
        `import/patient?clinic=${clinic}`,
        formData,
        {
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      getPatients();
      exportModalRef.current.click();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getItem();
    getItemDb();
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      getItemDb();
    }, 300);

    if (page > item?.last_page) {
      setPage(item.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, clinic, sortBy, order]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getItem();
    }, 300);

    if (page > item?.last_page) {
      setPage(item.last_page);
    }

    return () => clearTimeout(getData);
  }, [searchCategory, clinic]);

  useEffect(() => {
    setSearch("");
    setSelectedCategory("");
    setAddForm(initialItemForm);
    setPage(1);
    setAddForm({ clinic_id: clinic });
  }, [clinic]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [itemDb]);

  // console.log(itemDb.data);

  return (
    <>
      <DashboardLayout
        title="Pasokan item"
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
                  <i className="fas fa-filter mr-3"></i> Pasokan item
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
                <a
                  href="/dashboard/pharmacy/purchase-order"
                  target="_blank"
                  className="label-text text-blue-400 text-sm font-semibold"
                >
                  <i className="fas fa-info-circle"></i> Pesanan Pembelian
                </a>
                {/* <label
                  className="bg-zinc-500 text-white active:bg-zinc-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-export"
                >
                  <i className="fas fa-cog"></i>
                </label> */}
                {/* <label
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-add"
                  onClick={() => setSelectedCategory(null)}
                >
                  tambah <i className="fas fa-add"></i>
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
                        sortBy == "code" && setOrder((p) => !p);
                        setSortBy("code");
                      }}
                    >
                      <p>Kode</p>
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
                        sortBy == "name" && setOrder((p) => !p);
                        setSortBy("name");
                      }}
                    >
                      <p>Item</p>
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
                        sortBy == "variant" && setOrder((p) => !p);
                        setSortBy("variant");
                      }}
                    >
                      <p>variant</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "variant" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "stock" && setOrder((p) => !p);
                        setSortBy("stock");
                      }}
                    >
                      <p>Total Stok</p>
                      {/* <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "stock" && "opacity-40"
                        }`}
                      ></i> */}
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <p>Aksi</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <Loading
                  data={itemDb}
                  dataLoading={itemDbLoading}
                  reload={getItemDb}
                ></Loading>
                {!itemDbLoading &&
                  itemDb?.data?.map((obj, index) => {
                    if (obj.item_variants?.length <= 0) {
                      return (
                        <tr key={obj.id} className="hover:bg-zinc-50">
                          <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                            <span className={"ml-3 font-bold"}>
                              {index + itemDb.from}
                            </span>
                          </th>
                          <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                            <span className={"font-bold"}>{obj.code}</span>
                          </th>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>
                              <Highlighter
                                highlightClassName="bg-emerald-200"
                                searchWords={[search]}
                                autoEscape={true}
                                textToHighlight={obj.name}
                              ></Highlighter>
                            </span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle text-gray-400 border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            No variant
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            -
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4">
                            {/* <label
                              htmlFor={`modal-detail`}
                              onClick={() => setSelectedItem(obj)}
                              className="bg-violet-500 text-white active:bg-violet-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              >
                              <i className="fas fa-eye"></i>
                            </label> */}
                          </td>
                        </tr>
                      );
                    }
                    return obj.item_variants?.map((variant, index) => {
                      return (
                        <tr key={obj.id + variant.id} className="">
                          {index < 1 && (
                            <>
                              <th
                                rowSpan={obj.item_variants?.length}
                                className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left"
                              >
                                {index < 1 && (
                                  <span className={"ml-3 font-bold"}>
                                    {index + itemDb.from}
                                  </span>
                                )}
                              </th>
                              <th
                                rowSpan={obj.item_variants?.length}
                                className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left"
                              >
                                {index < 1 && (
                                  <span className={"font-bold"}>
                                    {obj.code}
                                  </span>
                                )}
                              </th>
                              <td
                                rowSpan={obj.item_variants?.length}
                                className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left"
                              >
                                {index < 1 && (
                                  <span className={"ml-3 font-bold"}>
                                    <Highlighter
                                      highlightClassName="bg-emerald-200"
                                      searchWords={[search]}
                                      autoEscape={true}
                                      textToHighlight={obj.name}
                                    ></Highlighter>
                                  </span>
                                )}
                              </td>
                            </>
                          )}
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"font-bold"}>
                              <Highlighter
                                highlightClassName="bg-emerald-200"
                                searchWords={[search]}
                                autoEscape={true}
                                textToHighlight={variant.variant || ""}
                              ></Highlighter>
                            </span>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            {variant?.item_supplys.reduce(
                              (totalStock, item) => totalStock + item.stock,
                              0
                            )}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4">
                            <label
                              htmlFor={`modal-detail`}
                              onClick={() =>
                                setSelectedItem({
                                  ...variant,
                                  name: obj.name || "",
                                })
                              }
                              className="bg-violet-500 text-white active:bg-violet-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            >
                              <i className="fas fa-eye"></i>
                            </label>
                          </td>
                        </tr>
                      );
                    });
                  })}
              </tbody>
            </table>
          </div>

          <div className="flex">
            <div className="flex w-full py-2 mt-1 rounded-b-md gap-8 justify-center bottom-0 items-center align-bottom select-none bg-gray-50">
              <small className="w-44 text-right truncate">
                Hasil {itemDb.from}-{itemDb.to} dari {itemDb.total}
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
                  max={itemDb.last_page}
                  onChange={(e) => setPage(e.target.value)}
                />
                {/* <p className="font-bold w-8 text-center">{page}</p> */}
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= itemDb.last_page ? true : false}
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= itemDb.last_page ? true : false}
                  onClick={() => {
                    setPage(itemDb.last_page);
                  }}
                >
                  <i className="fa-solid fa-angles-right"></i>
                </button>
              </div>
              <div className="flex items-center text-xs w-44">
                <p className="truncate">Jumlah baris</p>
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

        <input type="checkbox" id="modal-detail" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box px-0 p-0 max-w-2xl">
            <div
              className={
                "relative flex flex-col min-w-0 break-words w-full min-h-fit rounded-md text-blueGray-700 bg-white"
              }
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg mb-4 px-8 pt-5">
                  <i className="fa-solid fa-boxes-stacked mr-3"></i>{" "}
                  {selectedItem.name +
                    " - " +
                    selectedItem.variant +
                    " " +
                    selectedItem.unit || "Item"}
                </h3>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <label
                    className="bg-rose-400 text-white active:bg-rose-400 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    ref={detailModalRef}
                    htmlFor="modal-detail"
                  >
                    <i className="fas fa-x"></i>
                  </label>
                </div>
              </div>
              <form onSubmit={addItem} autoComplete="off">
                <input type="hidden" autoComplete="off" />
                <div className="form-control w-full">
                  <table className="items-center w-full bg-transparent border-collapse overflow-auto">
                    <thead className="sticky top-0">
                      <tr>
                        <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                          #
                        </th>
                        <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                          <div
                            className={`flex items-center justify-between cursor-pointer`}
                          >
                            <p>Stock</p>
                          </div>
                        </th>
                        <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                          <div
                            className={`flex items-center justify-between cursor-pointer`}
                          >
                            <p>Manufacturing</p>
                          </div>
                        </th>
                        <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                          <div
                            className={`flex items-center justify-between cursor-pointer`}
                          >
                            <p>Expired</p>
                          </div>
                        </th>
                        {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                          <p>Actions</p>
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="">
                      {selectedItem.item_supplys?.map((obj, index) => {
                        return (
                          <tr key={obj.id} className="hover:bg-zinc-50">
                            <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                              <span className={"ml-3 font-bold"}>
                                {index + itemDb.from}
                              </span>
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                              {obj.stock}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                              {moment(obj.manufacturing).format("DD MMM YYYY")}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                              {moment(obj.expired).format("DD MMM YYYY")}{" "}
                              <span
                                className={`font-semibold ${
                                  moment(obj.expired).format() <
                                    moment().subtract(-7, "d").format() &&
                                  "text-rose-400 animate-pulse"
                                }`}
                              >
                                {" "}
                                - Expired {moment(obj.expired).fromNow()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                      <tr className="bg-gray-100">
                        <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-3 text-left">
                          <span className={"ml-3 font-bold"}>
                            {/* {index + itemDb.from} */}
                          </span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 font-bold">
                          {selectedItem.item_supplys?.reduce(
                            (totalStock, item) => totalStock + item.stock,
                            0
                          )}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2"></td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
          </div>
        </div>

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4 flex justify-between">
            Tambah Item Supply
            <SelectedClinicBadge></SelectedClinicBadge>
          </h3>
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
                      placeholder="Search item ..."
                      className="input input-bordered border-slate-300 w-full"
                    />
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                    >
                      {!item?.data?.length && (
                        <li className="rounded-sm text-sm">
                          <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                            No data found
                          </div>
                        </li>
                      )}
                      {item?.data?.map((obj) => {
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
              {addFormError.item_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.item_id}
                  </span>
                </label>
              )}

              <label className="label">
                <span className="label-text">Variant</span>
              </label>
              <select
                type="number"
                name="item_variant_id"
                value={addForm.item_variant_id || ""}
                onChange={(e) => handleAddInput(e)}
                required
                className="input input-bordered input-primary border-slate-300 w-full"
              >
                <option disabled value={""}>
                  Select item variant
                </option>
                {selectedCategory?.item_variants?.map((variant) => {
                  return (
                    <>
                      <option key={variant.id} value={variant.id}>
                        {variant.variant} - {variant.unit}
                      </option>
                    </>
                  );
                })}
              </select>
              {addFormError.item_variant_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.item_variant_id}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Total</span>
              </label>
              <input
                type="number"
                name="total"
                value={addForm.total}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.total && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.total}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Manufacturing</span>
              </label>
              <input
                type="date"
                name="manufacturing"
                value={addForm.manufacturing}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.manufacturing && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.manufacturing}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Expired</span>
              </label>
              <input
                type="date"
                name="expired"
                value={addForm.expired}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.expired && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.expired}
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
                Batalkan
              </label>
              <button className="btn btn-primary rounded-md">Tambah</button>
            </div>
          </form>
        </ModalBox>

        {/* <ModalBox id="modal-put">
          <h3 className="font-bold text-lg mb-4">Update Item</h3>
          <form onSubmit={putItem} autoComplete="off">
            <label className="label">
              <span className="label-text">Item</span>
            </label>
            <select
              name="item_id"
              onChange={(e) => handleAddInput(e)}
              required
              value={putForm.item_id}
              className="input input-bordered without-ring input-primary border-slate-300 w-full"
            >
              <option value="">Select</option>
              {itemDb?.map((obj) => {
                return (
                  <option key={obj.id} value={obj.id}>
                    {obj.name}
                  </option>
                );
              })}
            </select>
            {putFormError.item_id && (
              <label className="label">
                <span className="label-text-alt text-rose-300">
                  {putFormError.item_id}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text">Total</span>
            </label>
            <input
              type="number"
              name="total"
              value={putForm.total}
              onChange={(e) => handleAddInput(e)}
              required
              placeholder=""
              className="input input-bordered input-primary border-slate-300 w-full"
            />
            {putFormError.total && (
              <label className="label">
                <span className="label-text-alt text-rose-300">
                  {putFormError.total}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text">Manufacturing</span>
            </label>
            <input
              type="date"
              name="manufacturing"
              value={putForm.manufacturing}
              onChange={(e) => handleAddInput(e)}
              required
              placeholder=""
              className="input input-bordered input-primary border-slate-300 w-full"
            />
            {putFormError.manufacturing && (
              <label className="label">
                <span className="label-text-alt text-rose-300">
                  {putFormError.manufacturing}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text">Expired</span>
            </label>
            <input
              type="date"
              name="expired"
              value={putForm.expired}
              onChange={(e) => handleAddInput(e)}
              required
              placeholder=""
              className="input input-bordered input-primary border-slate-300 w-full"
            />
            {putFormError.expired && (
              <label className="label">
                <span className="label-text-alt text-rose-300">
                  {putFormError.expired}
                </span>
              </label>
            )}
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-put"
                ref={putModalRef}
                className="btn btn-ghost rounded-md"
              >
                Batalkan
              </label>
              <button className="btn btn-success bg-success rounded-md">
                Update
              </button>
            </div>
          </form>
        </ModalBox> */}

        <ModalBox id="modal-export">
          <h3 className="font-bold text-lg mb-4">Patients Table Config</h3>
          <form onSubmit={() => {}} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Export template data</span>
              </label>
              <div
                className="btn btn-ghost bg-zinc-200 normal-case"
                onClick={() => downloadTable()}
              >
                Download template data{" "}
                <i className="fas fa-download ml-2"></i>
              </div>
              <label className="label mt-4">
                <span className="label-text">Import template data</span>
              </label>

              <input
                type="file"
                name="logo"
                accept="xlsx"
                onChange={onSelectFile}
                className="file-input file-input-ghost input-bordered border rounded-md border-slate-300 w-full"
              />
              <div
                onClick={() => uploadTable()}
                className="btn btn-success normal-case text-zinc-700 mt-2"
              >
                Import template data <i className="fas fa-upload ml-2"></i>
              </div>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-export"
                ref={exportModalRef}
                className="btn btn-ghost rounded-md"
              >
                Batalkan
              </label>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
