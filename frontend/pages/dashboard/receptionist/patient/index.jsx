import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";

import moment from "moment/moment";
import axios from "../../../api/axios";
import Highlighter from "react-highlight-words";

import DashboardLayout from "../../../../layouts/DashboardLayout";
import Loading from "../../../../components/loading";
import ModalBox from "../../../../components/Modals/ModalBox";
import ModalDelete from "../../../../components/Modals/ModalDelete";

export default function Patients() {
  const token = getCookies("token");
  const router = useRouter();

  const addModalRef = useRef();
  const putModalRef = useRef();
  const detailModalRef = useRef();
  const exportModalRef = useRef();
  const tableRef = useRef();

  const [clinic, setClinic] = useState();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState(true);

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);

  const initialPatientForm = {
    clinic_id: "",
    id: "",
    nik: "",
    name: "",
    phone: "",
    address: "",
    gender: "",
    birth_date: "",
    birth_place: "",
  };

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialPatientForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialPatientForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialPatientForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialPatientForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getPatients() {
    if (!clinic) {
      return;
    }
    setPatientsLoading(true);
    try {
      const response = await axios.get(
        `/patients/${clinic && clinic + "/"}${perpage}${
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
      setPatients(response.data);
      setPatientsLoading(false);
    } catch (err) {
      console.error(err);
      setPatients({ data: [] });
      setPatientsLoading(false);
    }
  }

  async function addPatients(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/patient", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      // console.log(response)
      addModalRef.current.click();
      getPatients();
      setAddForm(initialPatientForm);
      setAddForm({clinic_id: clinic});
      setAddFormError(initialPatientForm);
    } catch (err) {
      setAddFormError(initialPatientForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putPatients(e) {
    e.preventDefault();
    console.log(putForm);
    try {
      const response = await axios.put(`/patient/${putForm.id}`, putForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      putModalRef.current.click();
      getPatients();
      setPutForm(initialPatientForm);
      setPutFormError(initialPatientForm);
    } catch (err) {
      setPutFormError(initialPatientForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deletePatient(id) {
    try {
      const response = await axios.delete(`/patient/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getPatients();
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
          link.setAttribute("download", `Patients_${clinic}_${moment().format("YYYY-MM-DD")}.xlsx`);
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
      getPatients();
      exportModalRef.current.click();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPatients();
  }, []);

  useEffect(() => {
    const getData = setTimeout(() => {
      getPatients();
    }, 300);

    if (page > patients?.last_page) {
      setPage(patients.last_page);
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
  }, [patients]);

  return (
    <>
      <DashboardLayout title="Patients" clinic={clinic} setClinic={setClinic}>
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Patients Table
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
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <label
                  className="bg-zinc-500 text-white active:bg-zinc-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-export"
                >
                  <i className="fas fa-cog"></i>
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
                  <th className="pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
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
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        sortBy == "birth_date" && setOrder((p) => !p);
                        setSortBy("birth_date");
                      }}
                    >
                      <p>Birth</p>

                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "birth_date" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        sortBy == "address" && setOrder((p) => !p);
                        setSortBy("address");
                      }}
                    >
                      <p>Address</p>

                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "address" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        sortBy == "phone" && setOrder((p) => !p);
                        setSortBy("phone");
                      }}
                    >
                      <p>Phone</p>

                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "phone" && "opacity-40"
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
                  data={patients}
                  dataLoading={patientsLoading}
                  reload={getPatients}
                ></Loading>
                {!patientsLoading &&
                  patients?.data?.map((obj, index) => {
                    return (
                      <tr key={obj.id} className="hover:bg-zinc-50">
                        <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                          <span className={"ml-3 font-bold "}>
                            {index + patients.from}
                          </span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <i
                            className={`text-md mr-2 ${
                              obj.gender == "male"
                                ? "text-blue-400 fas fa-mars"
                                : "text-pink-400 fas fa-venus"
                            }`}
                          ></i>{" "}
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
                          <span className={"capitalize"}>
                            {moment(obj.birth_date).format("DD MMM YYYY")}
                            {/* {obj.birth_place} */}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span className="">
                            {obj.address?.substring(0, 50)}{" "}
                            {obj.address.length > 50 && "..."}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <a
                            href={`${
                              obj.phone
                                ? `https://wa.me/` +
                                  obj.phone?.replace(/\D/g, "")
                                : ""
                            }`}
                            target="_blank"
                            className={""}
                          >
                            <i className="fa-brands fa-whatsapp text-emerald-500 mr-1"></i>{" "}
                            {obj.phone}
                          </a>
                        </td>
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.created_at).format("DD MMM YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td> */}
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          {/* <div className="tooltip tooltip-left" data-tip="Detail"> */}
                          <label
                            className="bg-violet-500 text-white active:bg-violet-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            htmlFor="modal-details"
                            onClick={() => {
                              setPutForm(obj);
                              setPutFormError(initialPatientForm);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </label>
                          {/* </div> */}
                          {/* <div className="tooltip tooltip-left" data-tip="Edit"> */}
                          <label
                            className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            htmlFor="modal-put"
                            onClick={() => {
                              setPutForm(obj);
                              setPutFormError(initialPatientForm);
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
                            callback={() => deletePatient(obj.id)}
                            title={`Delete patient?`}
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
                Results {patients.from}-{patients.to} of {patients.total}
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
                  max={patients.last_page}
                  onChange={(e) => setPage(e.target.value)}
                />
                {/* <p className="font-bold w-8 text-center">{page}</p> */}
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= patients.last_page ? true : false}
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
                <button
                  className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                  disabled={page >= patients.last_page ? true : false}
                  onClick={() => {
                    setPage(patients.last_page);
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
          <h3 className="font-bold text-lg mb-4">Add Patient</h3>
          <form onSubmit={addPatients} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">NIK</span>
              </label>
              <input
                required
                type="text"
                name="nik"
                value={addForm.nik}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.message && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.message}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={addForm.name}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                autoComplete="new-off"
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
                <span className="label-text">Phone</span>
              </label>
              <input
                required
                type="text"
                name="phone"
                value={addForm.phone}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.phone && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.phone}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                type="text"
                name="address"
                value={addForm.address}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.address && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.address}
                  </span>
                </label>
              )}

              <div className="flex gap-4 w-full">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Birth Place</span>
                  </label>
                  <input
                    type="text"
                    name="birth_place"
                    value={addForm.birth_place}
                    onChange={(e) => handleAddInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {addFormError.birth_place && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {addFormError.birth_place}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Birth Date</span>
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={addForm.birth_date}
                    onChange={(e) => handleAddInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {addFormError.birth_date && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {addFormError.birth_date}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={addForm.gender}
                    onChange={(e) => handleAddInput(e)}
                    className="input input-bordered input-primary border-slate-300 w-full"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {addFormError.gender && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {addFormError.gender}
                      </span>
                    </label>
                  )}
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
          <h3 className="font-bold text-lg mb-4">Edit Patient</h3>
          <form onSubmit={putPatients} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">NIK</span>
              </label>
              <input
                required
                type="text"
                name="nik"
                value={putForm.nik}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.message || putFormError.nik}
                  </span>
                </label>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={putForm.name}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                autoComplete="new-off"
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
                <span className="label-text">Phone</span>
              </label>
              <input
                required
                type="text"
                name="phone"
                value={putForm.phone}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.phone && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.phone}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                type="text"
                name="address"
                value={putForm.address}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.address && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.address}
                  </span>
                </label>
              )}

              <div className="flex gap-4 w-full">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Birth Place</span>
                  </label>
                  <input
                    type="text"
                    name="birth_place"
                    value={putForm.birth_place}
                    onChange={(e) => handlePutInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {putFormError.birth_place && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {putFormError.birth_place}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Birth Date</span>
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={putForm.birth_date}
                    onChange={(e) => handlePutInput(e)}
                    placeholder=""
                    className="input input-bordered input-primary border-slate-300 w-full"
                  />
                  {putFormError.birth_date && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {putFormError.birth_date}
                      </span>
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={putForm.gender}
                    onChange={(e) => handlePutInput(e)}
                    className="input input-bordered input-primary border-slate-300 w-full"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {putFormError.gender && (
                    <label className="label">
                      <span className="label-text-alt text-rose-300">
                        {putFormError.gender}
                      </span>
                    </label>
                  )}
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
                Save
              </button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-details">
          <h3 className="font-bold text-lg mb-4">Detail Patient</h3>

          <input type="hidden" autoComplete="off" />
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">NIK</span>
            </label>
            <input
              type="text"
              value={putForm.nik}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
            />
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={putForm.name}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
            />
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              value={putForm.phone}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
            />
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <textarea
              type="text"
              rows={3}
              value={putForm.address}
              onChange={() => {}}
              disabled
              className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full h-16"
            ></textarea>
            <div className="flex gap-4 w-full">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Birth Place</span>
                </label>
                <input
                  type="text"
                  value={putForm.birth_place}
                  onChange={() => {}}
                  disabled
                  className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Birth Date</span>
                </label>
                <input
                  type="date"
                  value={putForm.birth_date}
                  onChange={() => {}}
                  disabled
                  className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  name="gender"
                  value={putForm.gender}
                  onChange={() => {}}
                  disabled
                  className="input input-bordered input-primary border-slate-100 bg-slate-200 cursor-text w-full"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-action rounded-sm">
            <button
              className="btn btn-ghost rounded-md"
              onClick={() => {
                detailModalRef.current.click();
                setTimeout(() => putModalRef.current.click(), 120);
              }}
            >
              Edit
            </button>
            <label
              htmlFor="modal-details"
              ref={detailModalRef}
              className="btn btn-ghost border-none rounded-md"
            >
              Close
            </label>
          </div>
        </ModalBox>

        <ModalBox id="modal-export">
          <h3 className="font-bold text-lg mb-4">Position Table Config</h3>
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
