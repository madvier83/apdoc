import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import numeral from "numeral";
import ModalDelete from "../../../components/Modals/ModalDelete";
import Highlighter from "react-highlight-words";
import CurrencyInput from "react-currency-input-field";
import Loading from "../../../components/loading";

// import { Html5QrcodeScanner } from "html5-qrcode";
// import { Html5Qrcode } from "html5-qrcode";
// import ResultContainerPlugin from "../../../components/ResultContainerPlugin";
// import Html5QrcodePlugin from "../../../components/ResultContainerPlugin";

// import QRCode from "react-qr-code";

// import { QrReader } from "react-qr-reader";

export default function PurchaseOrder() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const putModalRef = useRef();
  const tableRef = useRef();
  const exportModalRef = useRef();

  const [clinic, setClinic] = useState();

  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [items, setItems] = useState([]);
  const [refresher, setRefresher] = useState(true);

  const [qrCodeValue, setQrCodeValue] = useState("");

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState(false);

  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const initialItemForm = {
    supplier_id: "",
    note: "",
    items: [],
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

  async function getItem() {
    if (!clinic) {
      return;
    }
    setItemLoading(true);
    try {
      const response = await axios.get(
        `purchase-orders/${clinic && clinic + "/"}${perpage}${
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
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setItem({});
      setItemLoading(false);
    }
  }

  async function getItems() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `items/${clinic && clinic + "/"}${perpage}${
          searchItem &&
          "/" +
            searchItem
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
      setItems(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setItem({});
    }
  }

  async function getCategory() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `suppliers/${clinic && clinic + "/"}${perpage}${
          searchCategory &&
          "/" +
            searchCategory
              .split(" ")
              .join("%")
              .replace(/[^a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      setCategory(response.data);
      setCategoryLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    try {
      const response = await axios.post("purchase-order", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getItem();
      setAddForm(initialItemForm);
      setAddForm({ clinic_id: clinic });
      setAddFormError(initialItemForm);
      setSelectedItems([]);
    } catch (err) {
      console.log(err);
      setAddFormError(initialItemForm);
      setAddFormError(err.response?.data);
      err.response?.data?.message &&
        setAddFormError({ code: err.response?.data?.message || "" });
    }
  }

  async function completePO(id) {
    try {
      const response = await axios.put(
        `purchase-order/${id}/finished`,
        {},
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "application/json",
          },
        }
      );
      getItem();
    } catch (err) {
      console.error(err);
    }
  }

  async function putItem(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `purchase-order/${putForm.id}`,
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
      err.response?.data?.message &&
        setPutFormError({ code: err.response?.data?.message || "" });
    }
  }

  async function deleteItem(id) {
    try {
      const response = await axios.delete(`purchase-order/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
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
          Authorization: "Bearer" + token.token,
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
            Authorization: "Bearer" + token.token,
          },
        }
      );
      // console.log(response);
      // getPatients();
      exportModalRef.current.click();
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getItem();
    getCategory();
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      getItem();
      getCategory();
    }, 300);

    if (page > item?.last_page) {
      setPage(item.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, clinic, sortBy, order]);

  useEffect(() => {
    setSearch("");
    setSearchCategory("");
    setPage(1);
    setAddForm(initialItemForm);
    setAddForm({ clinic_id: clinic });
  }, [clinic]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [item]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getCategory();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchCategory, clinic]);

  function addMultiItem(obj) {
    let multi = selectedItems;
    // console.log(multi)
    if (
      multi.filter((e) => {
        return e.id == obj.id;
      }).length == 0
    ) {
      multi.push({ ...obj, qty: 1 });
      setSelectedItems(multi);
    } else {
      let newMulti = [];
      multi.map((e) => {
        if (e.id != obj.id) {
          newMulti.push(e);
        }
      });
      setSelectedItems(newMulti);
    }
    setRefresher((prev) => !prev);
  }

  function handleItemQty(obj, index, e) {
    let multi = selectedItems;
    // console.log(multi)
    multi[index] = { ...multi[index], qty: e.target.value };
    setSelectedItems(multi);
    // console.log(multi[index]);
    setRefresher((prev) => !prev);
  }
  function handleItem(e, index) {
    let multi = selectedItems;
    multi[index] = { ...multi[index], [e.target.name]: e.target.value };
    setSelectedItems(multi);
    setRefresher((prev) => !prev);
  }

  useEffect(() => {
    const getData = setTimeout(() => {
      getItems();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchItem, clinic]);

  useEffect(() => {
    // console.log("a")
    let items = [];
    selectedItems.map((obj) => {
      let data = {
        item_id: obj.id,
        qty: obj.qty,
        cost: obj.buy_price,
        manufacturing: obj.manufacturing,
        expired: obj.expired,
      };
      items.push(data);
    });
    // console.log(items);
    setAddForm({ items: items });
    setPutForm({ items: items });
  }, [JSON.stringify(selectedItems)]);

  console.log(item);

  return (
    <>
      <DashboardLayout
        title="Purchase Order"
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
                  <i className="fas fa-filter mr-3"></i> Purchase Order Table
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
                  className="bg-zinc-500 text-white active:bg-zinc-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-export"af
                >
                  <i className="fas fa-cog"></i>
                </label> */}
                <label
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-add"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedItems([]);
                  }}
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
                      <p>Name</p>
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
                        sortBy == "note" && setOrder((p) => !p);
                        setSortBy("note");
                      }}
                    >
                      <p>Note</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "note" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "note" && setOrder((p) => !p);
                        setSortBy("note");
                      }}
                    >
                      <p>Items</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "note" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>

                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "status_id" && setOrder((p) => !p);
                        setSortBy("status_id");
                      }}
                    >
                      <p>Status</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "status_id" && "opacity-40"
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
                        <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                          <span className={"ml-3 font-bold"}>
                            <Highlighter
                              highlightClassName="bg-emerald-200"
                              searchWords={[search]}
                              autoEscape={true}
                              textToHighlight={obj.supplier?.name}
                            ></Highlighter>
                          </span>
                        </td>
                        <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                          <span className={"ml-3"}>
                            <Highlighter
                              highlightClassName="bg-emerald-200"
                              searchWords={[search]}
                              autoEscape={true}
                              textToHighlight={obj.note}
                            ></Highlighter>
                          </span>
                        </td>
                        <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                          <span className={"ml-3"}>
                            {obj.purchase_order_items?.length} Items
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span className="">
                            {obj.is_finished == 0 && (
                              <button className="btn-primary bg-indigo-100 text-indigo-600 text-xs font-bold normal-case px-3 py-1 rounded-md w-full">
                                Pending
                              </button>
                            )}
                            {obj.is_finished == 1 && (
                              <button className="text-emerald-600 ml-auto bg-emerald-100 text-xs font-bold normal-case px-3 py-1 rounded-md w-full">
                                Completed
                              </button>
                            )}
                          </span>
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
                          {obj.is_finished != 1 ? (
                            <>
                              <div
                                className="tooltip tooltip-left"
                                data-tip="Edit"
                              >
                                <label
                                  className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  type="button"
                                  htmlFor="modal-put"
                                  onClick={() => {
                                    setPutForm(obj);
                                    setPutFormError("");
                                    setSelectedCategory(obj.supplier);
                                    setSelectedItems(obj.purchase_order_items);
                                  }}
                                >
                                  <i className="fas fa-pen-to-square"></i>
                                </label>
                              </div>
                              <div
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
                                callback={() => deleteItem(obj.id)}
                                title={`Delete purchase order?`}
                              ></ModalDelete>
                              <div
                                className="tooltip tooltip-left"
                                data-tip="Fulfill puchase order"
                              >
                                <label
                                  className="bg-amber-400 text-white active:bg-amber-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => {
                                    completePO(obj.id);
                                  }}
                                >
                                  <i className="fas fa-check"></i>
                                </label>
                              </div>
                            </>
                          ) : (
                            <div
                              className="tooltip tooltip-left"
                              data-tip="Details"
                            >
                              <label
                                className="bg-indigo-400 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                htmlFor="modal-details"
                                onClick={() => {
                                  setPutForm(obj);
                                  setPutFormError("");
                                  setSelectedCategory(obj.supplier);
                                  setSelectedItems(obj.purchase_order_items);
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </label>
                            </div>
                          )}
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

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Add Purchase Order</h3>
          <form onSubmit={addItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Supplier</span>
              </label>

              <div className="dropdown w-full">
                {selectedCategory?.id && (
                  <div className="p-0 overflow-hidden mb-1">
                    <div
                      className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs hover:bg-rose-200 border border-slate-300 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedCategory({});
                        setAddForm({ supplier_id: null });
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
                      placeholder="Search supplier ..."
                      className="input input-bordered border-slate-300 w-full"
                    />
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                    >
                      {!category?.data?.length && (
                        <li className="rounded-sm text-sm">
                          <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                            No data found
                          </div>
                        </li>
                      )}
                      {category?.data?.map((obj) => {
                        return (
                          <li key={obj.id} className="p-0 overflow-hidden">
                            <div
                              className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                              onClick={() => {
                                setSelectedCategory(obj);
                                setAddForm({ supplier_id: obj.id });
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
              {addFormError.supplier_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.supplier_id}
                  </span>
                </label>
              )}

              <label className="label">
                <span className="label-text">Note</span>
              </label>
              <textarea
                type="text"
                name="note"
                value={addForm.note}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input h-16 input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.note && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.note}
                  </span>
                </label>
              )}

              <div className="dropdown mb-8">
                <label className="label mt-4">
                  <span className="label-text">Items</span>
                </label>
                <input
                  tabIndex={0}
                  // ref={diagnoseRef}
                  type="text"
                  name="searchAdd"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  placeholder="Add item ..."
                  className="input input-bordered input-md border-slate-300 w-full"
                />

                {searchItem && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                  >
                    {!items?.data?.length && (
                      <li className="rounded-sm text-sm">
                        <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                          No data found
                        </div>
                      </li>
                    )}
                    {items?.data?.map((obj) => {
                      return (
                        <li key={obj.id} className="p-0 overflow-hidden">
                          <div
                            className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                            onClick={() => {
                              addMultiItem(obj);
                              setSearchItem("");
                            }}
                          >
                            {obj.code + " - " + obj.name.substring(0, 50)}{" "}
                            {obj.name.length > 50 && "..."}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-2 bg-amber-200 rounded-md">
                  {selectedItems.length > 0 &&
                    selectedItems?.map((obj, index) => {
                      return (
                        <div key={obj.id} className="p-0 overflow-hidden mb-1">
                          <div className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs bg-amber-50 border border-amber-400 rounded-md cursor-pointer">
                            <div>
                              <div className="flex justify-between">
                                <p className="text-[1rem] font-semibold">
                                  <span>{obj.code}</span>
                                  {" - " + obj.name}{" "}
                                </p>
                                <div
                                  className="flex justify-center font-bold"
                                  onClick={() => {
                                    addMultiItem(obj);
                                  }}
                                >
                                  <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i>
                                </div>
                              </div>
                              <div className="border-b my-4 border-amber-300 border-dashed"></div>
                              <div className="flex mt-2 gap-4">
                                <div className="">
                                  <p>Quantity</p>
                                  <input
                                    type="number"
                                    value={obj.qty}
                                    onChange={(e) => {
                                      handleItemQty(obj, index, e);
                                    }}
                                    className="input w-20 input-bordered input-sm bg-amber-100 border-amber-300 mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Unit Cost</p>
                                  <input
                                    type="text"
                                    disabled
                                    value={numeral(obj.buy_price).format("0,0")}
                                    className="input input-bordered input-sm bg-amber-100 bg-opacity-50 border-amber-300 w-full mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Subototal</p>
                                  <input
                                    type="text"
                                    disabled
                                    value={numeral(
                                      obj.buy_price * obj.qty
                                    ).format("0,0")}
                                    className="input input-bordered input-sm bg-amber-100  bg-opacity-50 border-amber-300 w-full mt-2"
                                  />
                                </div>
                              </div>
                              <div className="flex mt-4 gap-4">
                                <div className="w-20"></div>
                                <div className="">
                                  <p>Manufacturing</p>
                                  <input
                                    type="date"
                                    name="manufacturing"
                                    value={obj.manufacturing || ""}
                                    onChange={(e) => handleItem(e, index)}
                                    className="input input-bordered input-sm bg-amber-100 border-amber-300 w-full mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Expired</p>
                                  <input
                                    type="date"
                                    name="expired"
                                    value={obj.expired || ""}
                                    onChange={(e) => handleItem(e, index)}
                                    className="input input-bordered input-sm bg-amber-100  border-amber-300 w-full mt-2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <div
                    className={`${
                      selectedItems.length <= 0 && "hidden"
                    } flex justify-between items-center px-6 bg-amber-50 border border-amber-400 rounded-md p-2 font-semibold`}
                  >
                    <p>Total :</p>
                    <p>
                      {numeral(
                        selectedItems?.reduce(
                          (total, item) => total + item.buy_price * item.qty,
                          0
                        )
                      ).format("0,0")}
                    </p>
                  </div>
                </div>
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
              <button className="btn btn-primary rounded-md">Add</button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-put">
          <h3 className="font-bold text-lg mb-4">Update Purchase Order</h3>
          <form onSubmit={putItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Supplier</span>
              </label>

              <div className="dropdown w-full">
                {selectedCategory?.id && (
                  <div className="p-0 overflow-hidden mb-1">
                    <div
                      className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs hover:bg-rose-200 border border-slate-300 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedCategory({});
                        setPutForm({ supplier_id: null });
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
                      placeholder="Search supplier ..."
                      className="input input-bordered border-slate-300 w-full"
                    />
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                    >
                      {!category?.data?.length && (
                        <li className="rounded-sm text-sm">
                          <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                            No data found
                          </div>
                        </li>
                      )}
                      {category?.data?.map((obj) => {
                        return (
                          <li key={obj.id} className="p-0 overflow-hidden">
                            <div
                              className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                              onClick={() => {
                                setSelectedCategory(obj);
                                setPutForm({ supplier_id: obj.id });
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
              {putFormError.supplier_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.supplier_id}
                  </span>
                </label>
              )}

              <label className="label">
                <span className="label-text">Note</span>
              </label>
              <textarea
                type="text"
                name="note"
                value={putForm.note}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input h-16 input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.note && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.note}
                  </span>
                </label>
              )}

              <div className="dropdown mb-8">
                <label className="label mt-4">
                  <span className="label-text">Items</span>
                </label>
                <input
                  tabIndex={0}
                  // ref={diagnoseRef}
                  type="text"
                  name="searchAdd"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  placeholder="Add item ..."
                  className="input input-bordered input-md border-slate-300 w-full"
                />

                {searchItem && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                  >
                    {!items?.data?.length && (
                      <li className="rounded-sm text-sm">
                        <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                          No data found
                        </div>
                      </li>
                    )}
                    {items?.data?.map((obj) => {
                      return (
                        <li key={obj.id} className="p-0 overflow-hidden">
                          <div
                            className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                            onClick={() => {
                              addMultiItem(obj);
                              setSearchItem("");
                            }}
                          >
                            {obj.code + " - " + obj.name.substring(0, 50)}{" "}
                            {obj.name.length > 50 && "..."}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-2 bg-amber-200 rounded-md">
                  {selectedItems.length > 0 &&
                    selectedItems?.map((obj, index) => {
                      return (
                        <div key={obj.id} className="p-0 overflow-hidden mb-1">
                          <div className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs bg-amber-50 border border-amber-400 rounded-md cursor-pointer">
                            <div>
                              <div className="flex justify-between">
                                <p className="text-[1rem] font-semibold">
                                  <span>{obj.item?.code}</span>
                                  {" - " + obj.item?.name}{" "}
                                </p>
                                <div
                                  className="flex justify-center font-bold"
                                  onClick={() => {
                                    addMultiItem(obj);
                                  }}
                                >
                                  <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i>
                                </div>
                              </div>
                              <div className="border-b my-4 border-amber-300 border-dashed"></div>
                              <div className="flex mt-2 gap-4">
                                <div className="">
                                  <p>Quantity</p>
                                  <input
                                    type="number"
                                    value={obj.qty}
                                    onChange={(e) => {
                                      handleItemQty(obj, index, e);
                                    }}
                                    className="input w-20 input-bordered input-sm bg-amber-100 border-amber-300 mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Unit Cost</p>
                                  <input
                                    type="text"
                                    disabled
                                    value={numeral(obj.item?.buy_price).format(
                                      "0,0"
                                    )}
                                    className="input input-bordered input-sm bg-amber-100 bg-opacity-50 border-amber-300 w-full mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Subototal</p>
                                  <input
                                    type="text"
                                    disabled
                                    value={numeral(
                                      obj.item?.buy_price * obj.qty
                                    ).format("0,0")}
                                    className="input input-bordered input-sm bg-amber-100  bg-opacity-50 border-amber-300 w-full mt-2"
                                  />
                                </div>
                              </div>
                              <div className="flex mt-4 gap-4">
                                <div className="w-20"></div>
                                <div className="">
                                  <p>Manufacturing</p>
                                  <input
                                    type="date"
                                    name="manufacturing"
                                    value={obj.manufacturing || ""}
                                    onChange={(e) => handleItem(e, index)}
                                    className="input input-bordered input-sm bg-amber-100 border-amber-300 w-full mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Expired</p>
                                  <input
                                    type="date"
                                    name="expired"
                                    value={obj.expired || ""}
                                    onChange={(e) => handleItem(e, index)}
                                    className="input input-bordered input-sm bg-amber-100  border-amber-300 w-full mt-2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <div
                    className={`${
                      selectedItems.length <= 0 && "hidden"
                    } flex justify-between items-center px-6 bg-amber-50 border border-amber-400 rounded-md p-2 font-semibold`}
                  >
                    <p>Total :</p>
                    <p>
                      {numeral(
                        selectedItems?.reduce(
                          (total, item) =>
                            total + item.item?.buy_price * item.qty,
                          0
                        )
                      ).format("0,0")}
                    </p>
                  </div>
                </div>
              </div>
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

        
        <ModalBox id="modal-details">
          <h3 className="font-bold text-lg mb-4">Purchase Order</h3>
          <form onSubmit={putItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Supplier</span>
              </label>

              <div className="dropdown w-full">
                {selectedCategory?.id && (
                  <div className="p-0 overflow-hidden mb-1">
                    <div
                      className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs border border-slate-300 rounded-md cursor-not-allowed bg-zinc-100"
                    >
                      <div className="flex justify-end font-bold">
                        {/* <i className="fas fa-x absolute collapse hidden group-hover:flex mt-1 transition-all text-rose-600"></i> */}
                      </div>
                      <div className="text-sm font-semibold flex">
                        <p className="text-left">{selectedCategory.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <label className="label">
                <span className="label-text">Note</span>
              </label>
              <textarea
                type="text"
                disabled
                name="note"
                value={putForm.note}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input h-16 input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.note && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.note}
                  </span>
                </label>
              )}

              <div className="dropdown mb-8">
                <label className="label mt-4">
                  <span className="label-text">Items</span>
                </label>

                <div className=" bg-gray-200 rounded-md">
                  {selectedItems.length > 0 &&
                    selectedItems?.map((obj, index) => {
                      return (
                        <div key={obj.id} className="p-0 overflow-hidden mb-1">
                          <div className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs bg-gray-50 border border-gray-400 rounded-md cursor-pointer">
                            <div>
                              <div className="flex justify-between">
                                <p className="text-[1rem] font-semibold">
                                  <span>{obj.item?.code}</span>
                                  {" - " + obj.item?.name}{" "}
                                </p>
                                <div
                                  className="flex justify-center font-bold"
                                  onClick={() => {
                                    addMultiItem(obj);
                                  }}
                                >
                                  {/* <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i> */}
                                </div>
                              </div>
                              <div className="border-b my-4 border-gray-300 border-dashed"></div>
                              <div className="flex mt-2 gap-4">
                                <div className="">
                                  <p>Quantity</p>
                                  <input
                                    type="number"
                                    disabled
                                    value={obj.qty}
                                    onChange={(e) => {
                                      handleItemQty(obj, index, e);
                                    }}
                                    className="input w-20 input-bordered input-sm bg-gray-100 border-gray-300 mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Unit Cost</p>
                                  <input
                                    type="text"
                                    disabled
                                    value={numeral(obj.item?.buy_price).format(
                                      "0,0"
                                    )}
                                    className="input input-bordered input-sm bg-gray-100 bg-opacity-50 border-gray-300 w-full mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Subototal</p>
                                  <input
                                    type="text"
                                    disabled
                                    value={numeral(
                                      obj.item?.buy_price * obj.qty
                                    ).format("0,0")}
                                    className="input input-bordered input-sm bg-gray-100  bg-opacity-50 border-gray-300 w-full mt-2"
                                  />
                                </div>
                              </div>
                              <div className="flex mt-4 gap-4">
                                <div className="w-20"></div>
                                <div className="">
                                  <p>Manufacturing</p>
                                  <input
                                    type="date"
                                    disabled
                                    name="manufacturing"
                                    value={obj.manufacturing || ""}
                                    onChange={(e) => handleItem(e, index)}
                                    className="input input-bordered input-sm bg-gray-100 border-gray-300 w-full mt-2"
                                  />
                                </div>
                                <div className="">
                                  <p>Expired</p>
                                  <input
                                    type="date"
                                    disabled
                                    name="expired"
                                    value={obj.expired || ""}
                                    onChange={(e) => handleItem(e, index)}
                                    className="input input-bordered input-sm bg-gray-100  border-gray-300 w-full mt-2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <div
                    className={`${
                      selectedItems.length <= 0 && "hidden"
                    } flex justify-between items-center px-6 bg-gray-50 border border-gray-400 rounded-md p-2 font-semibold`}
                  >
                    <p>Total :</p>
                    <p>
                      {numeral(
                        selectedItems?.reduce(
                          (total, item) =>
                            total + item.item?.buy_price * item.qty,
                          0
                        )
                      ).format("0,0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-details"
                className="btn btn-ghost rounded-md"
              >
                Close
              </label>
              {/* <button className="btn btn-success bg-success rounded-md">
                Update
              </button> */}
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-export">
          <h3 className="font-bold text-lg mb-4">Patients Table Config</h3>
          <form onSubmit={() => {}} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Export</span>
              </label>
              <div
                className="btn btn-ghost bg-zinc-200 normal-case"
                onClick={() => downloadTable()}
              >
                Download Current Template{" "}
                <i className="fas fa-download ml-2"></i>
              </div>
              <label className="label mt-4">
                <span className="label-text">Import Template</span>
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
                Upload Template <i className="fas fa-upload ml-2"></i>
              </div>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-export"
                ref={exportModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
