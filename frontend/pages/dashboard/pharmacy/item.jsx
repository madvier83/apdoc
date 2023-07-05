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
import { GetCookieChunk } from "../../../services/CookieChunk";
import SelectedClinicBadge from "../../../components/SelectedClinicBadge";

// import { Html5QrcodeScanner } from "html5-qrcode";
// import { Html5Qrcode } from "html5-qrcode";
// import ResultContainerPlugin from "../../../components/ResultContainerPlugin";
// import Html5QrcodePlugin from "../../../components/ResultContainerPlugin";

// import QRCode from "react-qr-code";

// import { QrReader } from "react-qr-reader";

export default function Item() {
  const token = GetCookieChunk("token_");

  const addModalRef = useRef();
  const addVariantModalRef = useRef();
  const putVariantModalRef = useRef();
  const detailModalRef = useRef();
  const putModalRef = useRef();
  const tableRef = useRef();
  const exportModalRef = useRef();

  const [clinic, setClinic] = useState();

  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();

  const [qrCodeValue, setQrCodeValue] = useState("");

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState(false);

  const [item, setItem] = useState([]);
  const [itemVariant, setItemVariant] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState({});

  const initialItemForm = {
    clinic_id: "",
    category_item_id: "",
    code: "",
    name: "",
    factory: "",
    distributor: "",
  };
  const initialVariantForm = {
    clinic_id: "",
    item_id: "",
    variant: "",
    unit: "",
    buy_price: "",
    sell_price: "",
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

  const [addVariantForm, setAddVariantForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVariantForm
  );
  const [addVariantFormError, setAddVariantFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVariantForm
  );
  const [putVariantForm, setPutVariantForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVariantForm
  );
  const [putVariantFormError, setPutVariantFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialVariantForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };
  const handleAddVariantInput = (event) => {
    const { name, value } = event.target;
    setAddVariantForm({ [name]: value });
  };
  const handlePutVariantInput = (event) => {
    const { name, value } = event.target;
    setPutVariantForm({ [name]: value });
  };

  async function getItem() {
    if (!clinic) {
      return;
    }
    setItemLoading(true);
    try {
      const response = await axios.get(
        `items/${clinic && clinic + "/"}${perpage}${
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
            Authorization: "Bearer" + token,
          },
        }
      );
      setItem(response.data);
      setItemLoading(false);
      if (selectedItem.id) {
        response.data.data.map((obj) => {
          if (obj.id == selectedItem.id) {
            setSelectedItem(obj);
            setItemVariant(obj.item_variants);
          }
        });
      }
    } catch (err) {
      console.error(err);
      setItem({});
      setItemLoading(false);
    }
  }

  async function getCategory() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `category-items/${clinic && clinic + "/"}${perpage}${
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
            Authorization: "Bearer" + token,
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
      const response = await axios.post("item", addForm, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getItem();
      setAddForm(initialItemForm);
      setAddForm({ clinic_id: clinic });
      setAddFormError(initialItemForm);
    } catch (err) {
      console.log(err);
      setAddFormError(initialItemForm);
      setAddFormError(err.response?.data);
      err.response?.data?.message &&
        setAddFormError({ code: err.response?.data?.message || "" });
    }
  }

  async function putItem(e) {
    e.preventDefault();
    try {
      const response = await axios.put(`item/${putForm.id}`, putForm, {
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
      err.response?.data?.message &&
        setPutFormError({ code: err.response?.data?.message || "" });
    }
  }

  // console.log(selectedItem)
  async function addItemVariant(e) {
    e.preventDefault();
    try {
      const response = await axios.post("item-variant", addVariantForm, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "application/json",
        },
      });
      setAddVariantForm(initialVariantForm);
      setAddVariantForm({ clinic_id: clinic });
      setAddVariantFormError(initialVariantForm);

      getItem();
      addVariantModalRef.current.click();
    } catch (err) {
      console.log(err);
      setAddVariantFormError(initialVariantForm);
      setAddVariantFormError(err.response?.data);
      err.response?.data?.message &&
        setAddVariantFormError({ code: err.response?.data?.message || "" });
    }
  }
  async function putItemVariant(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `item-variant/${putVariantForm.id}`,
        putVariantForm,
        {
          headers: {
            Authorization: "Bearer" + token,
            "Content-Type": "application/json",
          },
        }
      );
      setPutVariantForm(initialVariantForm);
      setPutVariantFormError(initialVariantForm);
      setPutVariantFormError(initialVariantForm)
      
      getItem();
      putVariantModalRef.current.click();
    } catch (err) {
      setPutVariantFormError(initialVariantForm);
      setPutVariantFormError(err.response?.data);
      err.response?.data?.message &&
        setPutVariantFormError({ code: err.response?.data?.message || "" });
    }
  }

  async function deleteItem(id) {
    try {
      const response = await axios.delete(`item/${id}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      getItem();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteVariant(id) {
    try {
      const response = await axios.delete(`item-variant/${id}`, {
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
        url: `export/item?clinic=${clinic}`,
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
            `Item_${clinic}_${moment().format("YYYY-MM-DD")}.xlsx`
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

    // for (let [key, value] of formData) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      const response = await axios.post(
        `import/item?clinic=${clinic}`,
        formData,
        {
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer" + token,
          },
        }
      );
      getItem();
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
    setAddVariantForm({ clinic_id: clinic });
  }, [clinic]);

  // console.log(selectedItem);

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

  // const [decodedResults, setDecodedResults] = useState([]);
  // const onNewScanResult = (decodedText, decodedResult) => {
  //   console.log("App [result]", decodedResult);
  //   setDecodedResults((prev) => [...prev, decodedResult]);
  // };

  // useEffect(() => {
  //   const scanner = new Html5QrcodeScanner("reader", {
  //     qrbox: {
  //       width: 250,
  //       height: 250,
  //     },
  //     fps: 5,
  //   });

  //   scanner.render(success, error);

  //   function success(result) {
  //     // scanner.clear();
  //     console.log(result);
  //   }
  //   function error(err) {
  //     console.log(err)
  //   }
  // }, []);

  // const [data, setData] = useState("No result");

  // console.log(item.data)

  return (
    <>
      <DashboardLayout title="Item" clinic={clinic} setClinic={setClinic}>
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Item Table
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
                  className="bg-emerald-500 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-export"
                >
                  <i className="fas fa-download"></i>
                </label>
                <label
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-add"
                  onClick={() => {
                    setSelectedCategory(null);
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
                  {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "unit" && setOrder((p) => !p);
                        setSortBy("unit");
                      }}
                    >
                      <p>Unit</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "unit" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "buy_price" && setOrder((p) => !p);
                        setSortBy("buy_price");
                      }}
                    >
                      <p>Buy Price</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "buy_price" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "sell_price" && setOrder((p) => !p);
                        setSortBy("sell_price");
                      }}
                    >
                      <p>Sell Price</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "sell_price" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th> */}
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "category_item_id" && setOrder((p) => !p);
                        setSortBy("category_item_id");
                      }}
                    >
                      <p>Category</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "category_item_id" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "category_item_id" && setOrder((p) => !p);
                        setSortBy("category_item_id");
                      }}
                    >
                      <p>Factory</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "category_item_id" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "distributor" && setOrder((p) => !p);
                        setSortBy("distributor");
                      }}
                    >
                      <p>Distributor</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "distributor" && "opacity-40"
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
                              textToHighlight={obj.code}
                            ></Highlighter>
                          </span>
                        </td>
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
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>{obj.unit}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>
                            Rp. {numeral(obj.buy_price).format("0,0")}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>
                            Rp. {numeral(obj.sell_price).format("0,0")}
                          </span>
                        </td> */}
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>{obj.category_item?.name}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>{obj.factory}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span>{obj.distributor}</span>
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
                            data-tip="Add Variant"
                          >
                            <label
                              className="bg-indigo-400 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              htmlFor="modal-add-variant"
                              onClick={() => {
                                setAddVariantForm((prev) => {
                                  return {
                                    initialItemForm,
                                    clinic_id: prev.clinic_id,
                                  };
                                });
                                setItemVariant(obj.item_variants)
                                setSelectedItem(obj)
                                setAddVariantForm({ item_id: obj.id });
                              }}
                            >
                              <i className="fas fa-folder-plus"></i>
                            </label>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Details"
                          >
                            <label
                              htmlFor={`modal-detail`}
                              onClick={() => {
                                setSelectedItem(obj);
                                setItemVariant(obj.item_variants);
                              }}
                              className="bg-violet-500 text-white active:bg-violet-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            >
                              <i className="fas fa-eye"></i>
                            </label>
                          </div>
                          <div className="tooltip tooltip-left" data-tip="Edit">
                            <label
                              className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              htmlFor="modal-put"
                              onClick={() => {
                                setPutForm(obj);
                                setPutFormError("");
                                setSelectedCategory(obj.category_item);
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
                            title={`Delete item?`}
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

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4 flex justify-between">Add Item 
            <SelectedClinicBadge></SelectedClinicBadge></h3>
          <form onSubmit={addItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              {/* <div id="reader"></div> */}

              {/* <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
              />
              <ResultContainerPlugin results={decodedResults} /> */}

              {/* <QrReader
                onResult={(result, error) => {
                  console.log(result)
                  if (!!result) {
                    setData(result?.text);
                  }

                  if (!!error) {
                    console.info(error);
                  }
                }}
                style={{ width: "100%" }}
              />
              <p>{data}</p> */}

              <label className="label">
                <span className="label-text">Code</span>
              </label>
              <input
                type="text"
                name="code"
                value={addForm.code}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.code && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.code}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={addForm.name}
                onChange={(e) => handleAddInput(e)}
                required
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
                <span className="label-text">Category</span>
              </label>

              <div className="dropdown w-full">
                {selectedCategory?.id && (
                  <div className="p-0 overflow-hidden mb-1">
                    <div
                      className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs hover:bg-rose-200 border border-slate-300 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedCategory({});
                        setAddForm({ category_item_id: null });
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
                      placeholder="Search category ..."
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
                                setAddForm({ category_item_id: obj.id });
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
              {addFormError.category_item_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.category_item_id}
                  </span>
                </label>
              )}
              {/* <label className="label">
                <span className="label-text">Unit</span>
              </label>
              <input
                type="text"
                name="unit"
                value={addForm.unit}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.unit && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.unit}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Buy Price</span>
              </label>
              <CurrencyInput
                name="buy_price"
                defaultValue={0}
                value={addForm.buy_price}
                decimalsLimit={2}
                onValueChange={(value, name) =>
                  setAddForm({ buy_price: value })
                }
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.buy_price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.buy_price}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Sell Price</span>
              </label>
              <CurrencyInput
                name="sell_price"
                defaultValue={0}
                value={addForm.sell_price}
                decimalsLimit={2}
                onValueChange={(value, name) =>
                  setAddForm({ sell_price: value })
                }
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.sell_price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.sell_price}
                  </span>
                </label>
              )} */}
              <label className="label">
                <span className="label-text">Factory</span>
              </label>
              <input
                type="text"
                name="factory"
                value={addForm.factory}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.factory && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.factory}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Distributor</span>
              </label>
              <input
                type="text"
                name="distributor"
                value={addForm.distributor}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.distributor && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.distributor}
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

        <ModalBox id="modal-add-variant">
          <h3 className="font-bold text-lg mb-4">Add Variant</h3>
          <form onSubmit={addItemVariant} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Variant</span>
              </label>
              <input
                type="text"
                name="variant"
                value={addVariantForm.variant}
                onChange={(e) => handleAddVariantInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addVariantFormError.variant && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addVariantFormError.variant}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Unit</span>
              </label>
              <input
                type="text"
                name="unit"
                value={addVariantForm.unit}
                onChange={(e) => handleAddVariantInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addVariantFormError.unit && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addVariantFormError.unit}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Buy Price</span>
              </label>
              <CurrencyInput
                name="buy_price"
                defaultValue={0}
                value={addVariantForm.buy_price}
                decimalsLimit={2}
                onValueChange={(value, name) =>
                  setAddVariantForm({ buy_price: value })
                }
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addVariantFormError.buy_price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addVariantFormError.buy_price}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Sell Price</span>
              </label>
              <CurrencyInput
                name="sell_price"
                defaultValue={0}
                value={addVariantForm.sell_price}
                decimalsLimit={2}
                onValueChange={(value, name) =>
                  setAddVariantForm({ sell_price: value })
                }
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addVariantFormError.sell_price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addVariantFormError.sell_price}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-add-variant"
                ref={addVariantModalRef}
                onClick={() => detailModalRef.current.click()}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-primary rounded-md">Add</button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-put">
          <h3 className="font-bold text-lg mb-4">Update Item</h3>
          <form onSubmit={putItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Code</span>
              </label>
              <input
                type="text"
                name="code"
                value={putForm.code}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.code && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.code}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={putForm.name}
                onChange={(e) => handlePutInput(e)}
                required
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
                <span className="label-text">Category</span>
              </label>

              <div className="dropdown w-full">
                {selectedCategory?.id && (
                  <div className="p-0 overflow-hidden mb-1">
                    <div
                      className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs hover:bg-rose-200 border border-slate-300 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedCategory({});
                        setPutForm({ category_item_id: null });
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
                      placeholder="Search category ..."
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
                                setPutForm({ category_item_id: obj.id });
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
              {putFormError.category_item_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.category_item_id}
                  </span>
                </label>
              )}
              {/* <label className="label">
                <span className="label-text">Unit</span>
              </label>
              <input
                type="text"
                name="unit"
                value={putForm.unit}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.unit && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.unit}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Buy Price</span>
              </label>
              <CurrencyInput
                name="buy_price"
                defaultValue={0}
                value={putForm.buy_price}
                decimalsLimit={2}
                onValueChange={(value, name) =>
                  setPutForm({ buy_price: value })
                }
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.buy_price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.buy_price}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Sell Price</span>
              </label>
              <CurrencyInput
                name="sell_price"
                defaultValue={0}
                value={putForm.sell_price}
                decimalsLimit={2}
                onValueChange={(value, name) =>
                  setPutForm({ sell_price: value })
                }
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.sell_price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.sell_price}
                  </span>
                </label>
              )} */}
              <label className="label">
                <span className="label-text">Factory</span>
              </label>
              <input
                type="text"
                name="factory"
                value={putForm.factory}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.factory && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.factory}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Distributor</span>
              </label>
              <input
                type="text"
                name="distributor"
                value={putForm.distributor}
                onChange={(e) => handlePutInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.distributor && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.distributor}
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

        <ModalBox id="modal-put-variant">
          <h3 className="font-bold text-lg mb-4">Update Variant</h3>
          <form onSubmit={putItemVariant} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Variant</span>
              </label>
              <input
                type="text"
                name="variant"
                value={putVariantForm.variant}
                onChange={(e) => handlePutVariantInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putVariantFormError.variant && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putVariantFormError.variant}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Unit</span>
              </label>
              <input
                type="text"
                name="unit"
                value={putVariantForm.unit}
                onChange={(e) => handlePutVariantInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putVariantFormError.unit && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putVariantFormError.unit}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Buy Price</span>
              </label>
              <CurrencyInput
                name="buy_price"
                defaultValue={0}
                value={putVariantForm.buy_price}
                decimalsLimit={2}
                onValueChange={(value, name) =>
                  setPutVariantForm({ buy_price: value })
                }
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putVariantFormError.buy_price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putVariantFormError.buy_price}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Sell Price</span>
              </label>
              <CurrencyInput
                name="sell_price"
                defaultValue={0}
                value={putVariantForm.sell_price}
                decimalsLimit={2}
                onValueChange={(value, name) =>
                  setPutVariantForm({ sell_price: value })
                }
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putVariantFormError.sell_price && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putVariantFormError.sell_price}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-put-variant"
                ref={putVariantModalRef}
                onClick={() => detailModalRef.current.click()}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-success bg-emerald-500 rounded-md">
                Update
              </button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-export">
          <h3 className="font-bold text-lg mb-4 flex justify-between">Items Table Config 
            <SelectedClinicBadge></SelectedClinicBadge></h3>
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

        <input
          type="checkbox"
          id="modal-detail"
          className="modal-toggle"
          ref={detailModalRef}
        />
        <div className="modal">
          <div className="modal-box px-0 p-0 max-w-2xl min-h-[50vh]">
            <div
              className={
                "relative flex flex-col min-w-0 break-words w-full min-h-fit rounded-md text-blueGray-700 bg-white"
              }
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg mb-4 px-8 pt-5">
                  <i className="fa-solid fa-boxes-stacked mr-3"></i>{" "}
                  {selectedItem.name} Variant
                </h3>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <label
                    className="bg-indigo-400 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    htmlFor="modal-add-variant"
                    onClick={() => {
                      setAddVariantForm((prev) => {
                        return {
                          initialItemForm,
                          clinic_id: prev.clinic_id,
                        };
                      });
                      setAddVariantForm({ item_id: selectedItem.id });
                      detailModalRef.current.click();
                    }}
                  >
                    <i className="fas fa-folder-plus mr-2"></i>
                    Add variant
                  </label>
                  <label
                    className="bg-rose-400 text-white active:bg-rose-400 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    htmlFor="modal-detail"
                  >
                    <i className="fas fa-x"></i>
                  </label>
                </div>
              </div>
              {/* <form onSubmit={() => {}} autoComplete="off"> */}
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
                          <p>Variant</p>
                        </div>
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                        <div
                          className={`flex items-center justify-between cursor-pointer`}
                        >
                          <p>Unit</p>
                        </div>
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                        <div
                          className={`flex items-center justify-between cursor-pointer`}
                        >
                          <p>Buy Price</p>
                        </div>
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                        <div
                          className={`flex items-center justify-between cursor-pointer`}
                        >
                          <p>Sell Price</p>
                        </div>
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                        <p>Actions</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {itemVariant?.map((obj, index) => {
                      return (
                        <tr key={obj.id} className="hover:bg-zinc-50">
                          <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                            <span className={"ml-3 font-bold"}>
                              {index + 1}
                            </span>
                          </th>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 capitalize">
                            {obj.variant}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            {obj.unit}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            {numeral(obj.buy_price).format("0,0")}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            {numeral(obj.sell_price).format("0,0")}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            <div
                              className="tooltip tooltip-left"
                              data-tip="Edit"
                            >
                              <label
                                className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                htmlFor="modal-put-variant"
                                onClick={() => {
                                  setPutVariantForm(obj);
                                  setPutVariantFormError("");
                                  detailModalRef.current.click();
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
                                htmlFor={`variant-${obj.id}`}
                              >
                                <i className="fas fa-trash"></i>
                              </label>
                            </div>
                            <ModalDelete
                              id={`variant-${obj.id}`}
                              callback={() => deleteVariant(obj.id)}
                              title={`Delete variant?`}
                            ></ModalDelete>
                          </td>
                        </tr>
                      );
                    })}
                    {itemVariant?.length <= 0 && (
                      <tr className="">
                        <td colSpan="9">
                          <div className="flex w-full items-center justify-center h-72 text-zinc-400">
                            No variant
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* </form> */}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
