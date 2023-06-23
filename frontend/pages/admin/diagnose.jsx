import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";
import numeral from "numeral";

import axios from "../api/axios";
import AdminLayout from "../../layouts/AdminLayout";
import ModalBox from "../../components/Modals/ModalBox";
import ModalDelete from "../../components/Modals/ModalDelete";

import Highlighter from "react-highlight-words";
import Loading from "../../components/loading";

export default function Diagnose() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const exportModalRef = useRef();
  const putModalRef = useRef();
  const tableRef = useRef();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState(false);

  const [clinic, setClinic] = useState("");

  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisLoading, setDiagnosisLoading] = useState(true);

  const initialDiagnosisForm = {
    id: "",
    code: "",
    description: "",
  };

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDiagnosisForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDiagnosisForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDiagnosisForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDiagnosisForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getDiagnosis() {
    setDiagnosisLoading(true);
    try {
      const response = await axios.get(
        `diagnoses/${perpage}${
          search &&
          "/" +
            search
              .split(" ")
              .join("%")
              // .replace(/[^a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}&sortBy=${sortBy}&order=${order ? "asc" : "desc"}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      // console.log(response);
      setDiagnosis(response.data);
      setDiagnosisLoading(false);
    } catch (err) {
      console.error(err);
      setDiagnosisLoading(false);
    }
  }

  async function addDiagnosis(e) {
    e.preventDefault();
    try {
      const response = await axios.post("diagnose", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getDiagnosis();
      setPage(1);
      setSearch("");
      setAddForm(initialDiagnosisForm);
      setAddFormError(initialDiagnosisForm);
    } catch (err) {
      setAddFormError(initialDiagnosisForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putDiagnosis(e) {
    e.preventDefault();
    // console.log(putForm);
    try {
      const response = await axios.put(`diagnose/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      putModalRef.current.click();
      getDiagnosis();
      setPutForm(initialDiagnosisForm);
      setPutFormError(initialDiagnosisForm);
    } catch (err) {
      setPutFormError(initialDiagnosisForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteDiagnosis(id) {
    try {
      const response = await axios.delete(`diagnose/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getDiagnosis();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const getData = setTimeout(() => {
      getDiagnosis();
    }, 300);

    if (page > diagnosis?.last_page) {
      setPage(diagnosis.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, sortBy, order]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [diagnosis]);

  async function downloadTable() {
    try {
      axios({
        url: `export/diagnose`,
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
            `Diagnosa_${clinic}_${moment().format("YYYY-MM-DD")}.xlsx`
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

  const [uploadLoading, setUploadLoading] = useState(false);
  async function uploadTable() {
    let formData = new FormData();
    formData.append("file", selectedFile);
    setUploadLoading(true);
    try {
      const response = await axios.post(
        `import/diagnose`,
        formData,
        {
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer" + token.token,
          },
        }
      );
      getDiagnosis();
      exportModalRef.current.click();
      setUploadLoading(false);
    } catch (err) {
      console.log(err);
      setUploadLoading(false);
    }
  }

  return (
    <>
      <AdminLayout title="Diagnose">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex">
              <div className="relative w-full px-4">
                <h3 className={"font-semibold text-lg truncate"}>
                  <i className="fas fa-filter mr-3"></i> Diagnose Table
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

              <div className="relative w-full px-4 text-right">
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
                  <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-100 text-gray-600">
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
                        sortBy == "Description" && setOrder((p) => !p);
                        setSortBy("Description");
                      }}
                    >
                      <p>Description</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "Description" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-100 text-gray-600">
                    Created At
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-100 text-gray-600">
                    Updated At
                  </th> */}
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-100 text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <Loading
                  data={diagnosis}
                  dataLoading={diagnosisLoading}
                  reload={getDiagnosis}
                ></Loading>
                {!diagnosisLoading &&
                  diagnosis?.data?.map((obj, index) => {
                    return (
                      <tr key={obj.id} className="hover:bg-zinc-50">
                        <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs text-left">
                          <span className={"ml-3 font-bold"}>
                            {index + diagnosis.from}
                          </span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-2 min-w-full">
                          <label htmlFor={`detail-${obj.id}`}>
                            <span className={"font-bold ml-3"}>
                              <Highlighter
                                highlightClassName="bg-emerald-200"
                                searchWords={[search]}
                                autoEscape={true}
                                textToHighlight={obj.code}
                              ></Highlighter>
                            </span>
                          </label>
                        </td>
                        <td className="border-t-0 pr-6 pl-6 w-2/3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <div className="w-full whitespace-pre-wrap line-clamp-2">
                            <Highlighter
                              highlightClassName="bg-emerald-200"
                              searchWords={[search]}
                              autoEscape={true}
                              textToHighlight={obj.description}
                            ></Highlighter>
                          </div>
                          <input
                            type="checkbox"
                            id={`detail-${obj.id}`}
                            className="modal-toggle"
                          />
                          <label
                            htmlFor={`detail-${obj.id}`}
                            className="modal cursor-pointer"
                          >
                            <label
                              className="modal-box px-16 py-16 bg-indigo-600 text-primary-content max-w-md relative"
                              htmlFor=""
                            >
                              <h3 className="text-4xl font-bold">{obj.code}</h3>
                              <p className="py-4 opacity-90 text-base text-justify whitespace-pre-wrap">
                                {obj.description}
                              </p>
                            </label>
                          </label>
                        </td>
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                      {moment(obj.created_at).format("DD MMM YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td> */}
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4">
                          {/* <div className="tooltip tooltip-left " data-tip="Detail"> */}
                          <label
                            htmlFor={`detail-${obj.id}`}
                            className="bg-violet-500 text-white active:bg-violet-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          >
                            <i className="fas fa-eye"></i>
                          </label>
                          {/* </div> */}
                          {/* <div className="tooltip tooltip-left " data-tip="Edit"> */}
                          <label
                            className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            htmlFor="modal-put"
                            onClick={() => {
                              setPutForm(obj);
                              setPutFormError(initialDiagnosisForm);
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
                            callback={() => deleteDiagnosis(obj.id)}
                            title={`Delete diagnosis?`}
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
                Results {diagnosis.from}-{diagnosis.to} of {diagnosis.total}
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
                  max={diagnosis.last_page}
                  onChange={(e) => setPage(e.target.value)}
                />
                {/* <p className="font-bold w-8 text-center">{page}</p> */}
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= diagnosis.last_page ? true : false}
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= diagnosis.last_page ? true : false}
                  onClick={() => {
                    setPage(diagnosis.last_page);
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
        {/* <div className="py-16"></div> */}

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Add Diagnose</h3>
          <form onSubmit={addDiagnosis} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Code</span>
              </label>
              <input
                type="text"
                name="code"
                value={addForm.code}
                onChange={(e) => handleAddInput(e)}
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
                <span className="label-text">Description</span>
              </label>
              <textarea
                type="text"
                name="description"
                value={addForm.description}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={6}
                className="input input-bordered input-primary border-slate-300 w-full h-32"
              ></textarea>
              {addFormError.description && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.description}
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
          <h3 className="font-bold text-lg mb-4">Update Diagnose</h3>
          <form onSubmit={putDiagnosis} autoComplete="off">
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
                <span className="label-text">Description</span>
              </label>
              <textarea
                type="text"
                name="description"
                value={putForm.description}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={6}
                className="input input-bordered input-primary border-slate-300 w-full h-32"
              ></textarea>
              {putFormError.description && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.description}
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

        <ModalBox id="modal-export">
          <h3 className="font-bold text-lg mb-4">Diagnose Table Config</h3>
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
              {!uploadLoading ? (
                <div
                  onClick={() => uploadTable()}
                  className={`btn btn-success normal-case text-zinc-700 mt-2`}
                >
                  Upload Template <i className="fas fa-upload ml-2"></i>
                </div>
              ) : (
                <div
                  className={`btn btn-ghost normal-case text-zinc-100 animate-pulse bg-emerald-800 mt-2 h-8`}
                >
                  Importing Data
                  <img
                    src="/loading.svg"
                    alt="now loading"
                    className="h-12 ml-2"
                  />
                </div>
              )}
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
      </AdminLayout>
    </>
  );
}
