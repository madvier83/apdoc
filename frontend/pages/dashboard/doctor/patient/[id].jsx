import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../../api/axios";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import ModalBox from "../../../../components/Modals/ModalBox";
import ModalDelete from "../../../../components/Modals/ModalDelete";
import { Chart } from "react-google-charts";
import { MultiSelect } from "react-multi-select-component";
import { useRouter } from "next/router";
import { GetCookieChunk } from "../../../../services/CookieChunk";

export default function Patients() {
  const token = GetCookieChunk("token_");
  const router = useRouter();
  const [patientId, setPatientId] = useState(null);

  const addModalRef = useRef();
  const addGrowthModalRef = useRef();
  const addFileModalRef = useRef();
  const putModalRef = useRef();
  const putGrowthModalRef = useRef();
  const diagnoseRef = useRef();

  const [perpage, setPerpage] = useState(9);
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [searchService, setSearchService] = useState("");
  const [page, setPage] = useState(1);

  const [refresher, setRefresher] = useState(true);

  const [isRecord, setIsRecord] = useState(true);
  const [isGrowth, setIsGrowth] = useState(false);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [record, setRecord] = useState([]);
  const [recordLoading, setRecordLoading] = useState(true);
  const [patient, setPatient] = useState([]);
  const [patientLoading, setPatientLoading] = useState(true);
  const [diagsosis, setDiagnosis] = useState([]);
  const [diagsosisLoading, setDiagnosisLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [growth, setGrowth] = useState([]);
  const [growthLoading, setGrowthLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const [growthChart, setGrowthChart] = useState([
    [
      "Patient",
      "Tinggi",
      { role: "annotation" },
      "Berat",
      { role: "annotation" },
    ],
    ["", 0, "0", 0, "0"],
  ]);

  const initialRecordForm = {
    id: "",
    patient_id: "",
    diagnoses: [],
    items: [],
    services: [],
    description: "",
    complaint: "",
    inspection: "",
    therapy: "",
  };
  const initialGrowthForm = {
    id: "",
    height: "",
    weight: "",
  };
  const [selectedPatient, setSelectedPatient] = useState(initialRecordForm);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRecordForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRecordForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRecordForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialRecordForm
  );

  const [addGrowthForm, setAddGrowthForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialGrowthForm
  );
  const [addGrowthFormError, setAddGrowthFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialGrowthForm
  );
  const [putGrowthForm, setPutGrowthForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialGrowthForm
  );
  const [putGrowthFormError, setPutGrowthFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialGrowthForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handleAddGrowthInput = (event) => {
    const { name, value } = event.target;
    setAddGrowthForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };
  const handlePutGrowthInput = (event) => {
    const { name, value } = event.target;
    setPutGrowthForm({ [name]: value });
  };

  async function getPatient() {
    setRecordLoading(true);
    try {
      const response = await axios.get(`/patient/${router.query.id}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setSelectedPatient(response.data);
      setPatientLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getRecord() {
    // setRecordLoading(true);
    try {
      const response = await axios.get(`/record/${router.query.id}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      // console.log(response);
      setRecord(response.data);
      setRecordLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getGrowth() {
    // setRecordLoading(true);
    try {
      const response = await axios.get(`/growth/${router.query.id}/patient`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      // console.log(response.data);
      let chart = [
        [
          "Patient",
          "Tinggi",
          { role: "annotation" },
          "Berat",
          { role: "annotation" },
        ],
      ];
      if (response.data.length > 0) {
        response.data.map((obj) => {
          chart.push([
            moment(obj.created_at).format("DD MMM YYYY"),
            Number(obj.height),
            obj.height,
            Number(obj.weight),
            obj.weight,
          ]);
        });
        setGrowthChart(chart);
      }
      setGrowth(response.data);
      setGrowthLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getDiagnosis() {
    try {
      const response = await axios.get(
        `diagnoses/${perpage}${
          search &&
          "/" +
            search
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
      setDiagnosis(response.data);
      setDiagnosisLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function getItems() {
    if (!selectedPatient.clinic_id) {
      return;
    }
    try {
      const response = await axios.get(
        `items/${
          selectedPatient.clinic_id && selectedPatient.clinic_id + "/"
        }${perpage}${
          searchItem &&
          "/" +
            searchItem
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
      setItems(response.data);
      setItemsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function getServices() {
    if (!selectedPatient.clinic_id) {
      return;
    }
    try {
      const response = await axios.get(
        `services/${
          selectedPatient.clinic_id && selectedPatient.clinic_id + "/"
        }${perpage}${
          searchService &&
          "/" +
            searchService
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
      setServices(response.data);
      setServicesLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addRecord(e) {
    e.preventDefault();
    let formData = new FormData();
    // files.length > 0 && formData.append("files", files[0]);
    formData.append("patient_id", addForm.patient_id);
    formData.append("complaint", addForm.complaint);
    formData.append("inspection", addForm.inspection);
    formData.append("therapy", addForm.therapy);
    formData.append("description", addForm.description);
    formData.append(`diagnoses`, JSON.stringify(addForm.diagnoses));
    formData.append(`services`, JSON.stringify(addForm.services));
    formData.append(`items`, JSON.stringify(addForm.items));

    // for (var key of formData.entries()) {
    //   console.log(key[0] + ", " + key[1]);
    // }

    try {
      const response = await axios.post(`/record`, formData, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "multipart/form-data",
        },
      });
      addModalRef.current.click();
      // setFiles([]);
      getRecord();
      setAddForm(initialRecordForm);
      setAddForm({ patient_id: selectedPatient.id });
      setAddFormError(initialRecordForm);
    } catch (err) {
      console.error(err);
      setAddFormError(initialRecordForm);
      setAddFormError(err.response?.data);
    }
  }

  async function addGrowth(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `/growth`,
        { patient_id: router.query.id, ...addGrowthForm },
        {
          headers: {
            Authorization: "Bearer" + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      addGrowthModalRef.current.click();
      // setFiles([]);
      getGrowth();
      setAddGrowthForm(initialGrowthForm);
      setAddGrowthFormError(initialGrowthForm);
    } catch (err) {
      console.error(err);
      setAddGrowthFormError(initialGrowthForm);
      setAddGrowthFormError(err.response?.data);
    }
  }

  async function deleteGrowth(id) {
    try {
      const response = await axios.delete(`/growth/${id}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setAddGrowthForm(initialGrowthForm);
      getGrowth();
      setIsGrowth(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function putGrowth(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/growth/${putGrowthForm.id}`,
        putGrowthForm,
        {
          headers: {
            Authorization: "Bearer" + token,
            "Content-Type": "aplication/json",
          },
        }
      );
      putGrowthModalRef.current.click();
      setPutGrowthForm(initialGrowthForm);
      getGrowth();
      setIsGrowth(false);
    } catch (err) {
      console.error(err);
      setPutFormError(initialRecordForm);
      setPutFormError(err.response?.data);
    }
  }

  async function addFile(e, id) {
    e.preventDefault();
    let formData = new FormData();
    files.length > 0 && formData.append("files", files[0]);

    try {
      const response = await axios.post(`/record-image/${id}`, formData, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "multipart/form-data",
        },
      });
      addFileModalRef.current.click();
      getRecord();
      e.target.value = null;
    } catch (err) {
      console.error(err);
      setAddFormError(err.response?.data);
    }
  }

  async function deleteFile(id) {
    try {
      const response = await axios.delete(`/record-image/${id}`, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "multipart/form-data",
        },
      });
      getRecord();
      setFiles([]);
    } catch (err) {
      console.error(err);
      setAddFormError(err.response?.data);
    }
  }

  async function putRecord(e) {
    setPutForm({ patient_id: selectedPatient.id });
    e.preventDefault();
    let formData = new FormData();
    files.length > 0 && formData.append("files", files[0]);
    formData.append("patient_id", putForm.patient_id);
    formData.append("complaint", putForm.complaint);
    formData.append("inspection", putForm.inspection);
    formData.append("therapy", putForm.therapy);
    formData.append("description", putForm.description);
    formData.append(`diagnoses`, JSON.stringify(putForm.diagnoses));
    formData.append(`services`, JSON.stringify(putForm.services));
    formData.append(`items`, JSON.stringify(putForm.items));

    try {
      const response = await axios.post(`/record/${putForm.id}`, formData, {
        headers: {
          Authorization: "Bearer" + token,
          "Content-Type": "multipart/form-data",
        },
      });
      putModalRef.current.click();
      setFiles([]);
      getRecord();
      setPutForm({ patient_id: selectedPatient.id });
      setPutForm(initialRecordForm);
      setPutFormError(initialRecordForm);

      // console.log(response);
    } catch (err) {
      console.error(err);
      setPutFormError(initialRecordForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteRecord(id) {
    try {
      const response = await axios.delete(`/record/${id}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      getRecord();
    } catch (err) {
      console.error(err);
    }
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFiles([]);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setFiles(e.target.files);
  };

  function addMultiD(obj) {
    let multi = selectedDiagnosis;
    // console.log(multi)
    if (
      multi.filter((e) => {
        return e.id == obj.id;
      }).length == 0
    ) {
      multi.push(obj);
      setSelectedDiagnosis(multi);
    } else {
      let newMulti = [];
      multi.map((e) => {
        if (e.id != obj.id) {
          newMulti.push(e);
        }
      });
      setSelectedDiagnosis(newMulti);
    }
    setRefresher((prev) => !prev);
  }

  function addMultiItem(obj) {
    let multi = selectedItems;
    // console.log(multi)
    if (
      multi.filter((e) => {
        return e.id == obj.id;
      }).length == 0
    ) {
      multi.push(obj);
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

  function addMultiService(obj) {
    let multi = selectedServices;
    // console.log(multi)
    if (
      multi.filter((e) => {
        return e.id == obj.id;
      }).length == 0
    ) {
      multi.push(obj);
      setSelectedServices(multi);
    } else {
      let newMulti = [];
      multi.map((e) => {
        if (e.id != obj.id) {
          newMulti.push(e);
        }
      });
      setSelectedServices(newMulti);
    }
    setRefresher((prev) => !prev);
  }

  useEffect(() => {
    if (router.isReady) {
      getPatient();
      getRecord();
      getGrowth();
      getDiagnosis();
    }
  }, [router.isReady]);

  useEffect(() => {
    // selectedPatient.id && getRecord();
    setAddForm({ patient_id: selectedPatient.id });
    setPutForm({ patient_id: selectedPatient.id });
  }, [selectedPatient]);

  useEffect(() => {
    let diagnoses = selectedDiagnosis.map((obj) => {
      return obj.id;
    });
    let items = selectedItems.map((obj) => {
      return obj.id;
    });
    let services = selectedServices.map((obj) => {
      return obj.id;
    });
    setAddForm({ diagnoses, items, services });
    setPutForm({ diagnoses, items, services });
  }, [selectedDiagnosis, selectedItems, selectedServices, refresher]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getDiagnosis();
    }, 500);
    return () => clearTimeout(getData);
  }, [search]);
  useEffect(() => {
    const getData = setTimeout(() => {
      getServices();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchService, selectedPatient]);
  useEffect(() => {
    const getData = setTimeout(() => {
      getItems();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchItem, selectedPatient]);

  // console.log(record);
  console.log(selectedItems);
  return (
    <>
      <DashboardLayout title="Catatan Pasien">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700"
          }
        >
          <div className="flex flex-row gap-4">
            <div className="w-full">
              <div
                className={
                  "relative flex flex-col min-w-0 break-words w-full min-h-fit h-full text-blueGray-700 rounded-md"
                }
              >
                <div className="flex gap-4">
                  <div className="p-8 rounded-md bg-white w-1/3">
                    <h2 className="card-title text-base font-semibold lg:text-2xl text-zinc-900 truncate">
                      {/* <i className="fa-solid fa-user mr-1"></i>{" "} */}
                      {selectedPatient?.name}
                      {/* {selectedPatient?.gender == "male" ? (
                          <i className="fas fa-mars z-10 text-xl ml-1 text-blue-400"></i>
                        ) : (
                          <i className="fas fa-venus z-10 text-xl ml-1 text-rose-400"></i>
                        )} */}
                    </h2>
                    <small className="text-zinc-400">
                      NIK: {selectedPatient?.nik} | Gender:{" "}
                      {selectedPatient?.gender}
                    </small>
                    <div className="border-t border-dashed my-3"></div>
                    <div className="mb-4">
                      <small className="text-zinc-400">Telepon</small> <br />
                      <span className="font-sm text-zinc-800 line-clamp-2">
                        <a
                          href={`${
                            selectedPatient.phone
                              ? `https://wa.me/` +
                                selectedPatient.phone?.replace(/\D/g, "")
                              : ""
                          }`}
                          target="_blank"
                          className={""}
                        >
                          {selectedPatient?.phone}
                          <i className="fa-brands fa-whatsapp text-zinc-300 ml-1"></i>
                        </a>
                      </span>
                    </div>
                    <small className="text-zinc-400">Lahir</small>{" "}
                    <br />
                    <span className="font-sm text-zinc-800">
                      {selectedPatient?.birth_place +
                        ", " +
                        moment(selectedPatient?.birth_date).format(
                          "DD MMMM YYYY"
                        )}
                    </span>
                    <div className="mt-4">
                      <small className="text-zinc-400">Alamat</small> <br />
                      <span className="font-sm text-zinc-800">
                        {selectedPatient?.address?.substring},
                        <br />{selectedPatient?.village?.name},{" "}
                        {selectedPatient?.city?.name}, {selectedPatient?.district?.name},{" "}
                        {selectedPatient?.province?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 rounded-md bg-white w-2/3">
                    <div className="flex justify-between items-center">
                      <small className="text-2xl font-semibold">
                        Tinggi & berat badan
                      </small>{" "}
                      {isGrowth ? (
                        <div className="flex gap-1">
                          <div
                            className="btn btn-xs btn-error bg-rose-400 text-white font-bold"
                            onClick={() => setIsGrowth((prev) => !prev)}
                          >
                            Cancel <i className="fas fa-x ml-1"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <div
                            className="btn btn-xs btn-ghost bg-zinc-200 text-zinc-500 font-bold"
                            onClick={() => setIsGrowth((prev) => !prev)}
                          >
                            Edit <i className="fas fa-edit ml-1"></i>
                          </div>
                          <label
                            htmlFor="modal-add-growth"
                            className="btn btn-xs btn-primary font-bold"
                            // onClick={() => setIsGrowth((prev) => !prev)}
                          >
                            tambah <i className="fas fa-plus ml-1"></i>
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="my-3"></div>
                    {isGrowth ? (
                      <div className="h-72 pb-0 overflow-scroll bg-opacity-25 border border-zinc-200 rounded-md">
                        <table className="items-center w-full bg-transparent border-collapse overflow-auto">
                          <thead>
                            <tr>
                              <th className="pr-6 pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                #
                              </th>
                              <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Tinggi (CM)
                              </th>
                              <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Berat (KG)
                              </th>
                              <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Created At
                              </th>
                              <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Updated At
                              </th>
                              <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {growthLoading && (
                              <tr>
                                <td colSpan={99}>
                                  <div className="flex w-full justify-center my-4">
                                    <img src="/loading.svg" alt="now loading" />
                                  </div>
                                </td>
                              </tr>
                            )}
                            {growth?.map((obj, index) => {
                              return (
                                <tr key={obj.id} className="hover:bg-zinc-50">
                                  <th className="border-t-0 pl-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                                    <span className={"ml-3 font-bold"}>
                                      {index + 1}
                                    </span>
                                  </th>
                                  <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                                    <span className={"ml-4 font-bold"}>
                                      {obj.height}
                                    </span>
                                  </td>
                                  <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                                    <span className={"ml-4 font-bold"}>
                                      {obj.weight}
                                    </span>
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                    {moment(obj.created_at).format(
                                      "DD MMM YYYY"
                                    )}
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                    {moment(obj.updated_at).fromNow()}
                                  </td>
                                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                    <div
                                      className="tooltip tooltip-left"
                                      data-tip="Edit"
                                    >
                                      <label
                                        className="bg-emerald-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        htmlFor="modal-put-growth"
                                        onClick={() => {
                                          setPutGrowthForm(obj);
                                          setPutFormError("");
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
                                        htmlFor={"growthDelete" + obj.id}
                                      >
                                        <i className="fas fa-trash"></i>
                                      </label>
                                    </div>
                                    <ModalDelete
                                      id={"growthDelete" + obj.id}
                                      callback={() => deleteGrowth(obj.id)}
                                      title={`Hapus item?`}
                                    ></ModalDelete>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="w-full h-72">
                        <Chart
                          chartType="LineChart"
                          data={growthChart}
                          options={{
                            legend: {
                              position: "top",
                              alignment: "center",
                              top: 20,
                            },
                            chartArea: { width: "92%", height: "80%" },
                            bar: { groupWidth: "50%" },
                            annotations: {
                              textStyle: {
                                fontSize: 16,
                                color: "black",
                              },
                            },
                            lineWidth: 2,
                            backgroundColor: { fill: "transparent" },
                            pointSize: 10,
                            pointShape: "diamond",
                            lineDashStyle: [14, 2, 7, 2],
                            colors: ["#f43f5e", "#6366f1"],
                          }}
                          width={"100%"}
                          height={"280px"}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-md mt-4 bg-white px-4 py-4 border-0 mb-8">
                  <div className="flex items-center justify-between pb-4">
                    <div className="relative w-full px-4 max-w-full">
                      <h1 className="text-2xl font-semibold">
                        <i className="fa-solid fa-heart-pulse mr-1"></i> Catatan
                      </h1>
                    </div>
                    <div className="relative w-full px-4 max-w-full text-right">
                      <label
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        htmlFor="modal-add"
                        onClick={() => {
                          setSelectedDiagnosis([]);
                          setSelectedItems([]);
                          setSelectedServices([]);
                        }}
                      >
                        Tambah catatan <i className="fas fa-add"></i>
                      </label>
                      {/* <button
                        className="bg-rose-400 text-white active:bg-rose-400 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => router.back()}
                      >
                        Back <i className="fas fa-arrow-left"></i>
                      </button> */}
                    </div>
                  </div>
                  {recordLoading && (
                    <div className="flex w-full justify-center my-4">
                      <img src="/loading.svg" alt="now loading" />
                    </div>
                  )}
                  {!recordLoading && record?.length <= 0 && (
                    <div className="flex w-full justify-center my-16">
                      <h1 className="text-zinc-400">No Record</h1>
                    </div>
                  )}
                  <div className="flex flex-col ml-4">
                    {!recordLoading &&
                      record?.map((obj) => {
                        return (
                          <div
                            className={`${obj.is_delete != 0 && "hidden"}`}
                            key={obj.id}
                          >
                            <div className="border-t border-dashed"></div>
                            <div className="card-body pr-6 pl-0 pt-4 pb-2">
                              <div className="flex">
                                <div className="flex items-center">
                                  <span className="font-semibold text-xl">
                                    {moment(obj.created_at).format(
                                      "dddd, DD MMMM YYYY, h:mm A"
                                    )}
                                  </span>
                                  <span className="text-xs ml-2 mt-2">
                                    ({moment(obj.created_at).fromNow()})
                                  </span>
                                </div>
                                <div className="dropdown dropdown-end ml-auto rounded-md">
                                  <label
                                    tabIndex={0}
                                    className="btn btn-ghost btn-sm m-1"
                                  >
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                  </label>
                                  <ul
                                    tabIndex={0}
                                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-md w-32"
                                  >
                                    <label
                                      className="btn btn-sm flex justify-between  btn-ghost font-semibold rounded-md"
                                      htmlFor="modal-put"
                                      onClick={() => {
                                        let diagnoses =
                                          obj.record_diagnoses?.map(
                                            (e) => e.diagnose
                                          );
                                        let items = obj.record_items?.map(
                                          (e) => {
                                            return {
                                              ...e.item_variant.item,
                                              ...e.item_variant,
                                            };
                                          }
                                        );
                                        let services = obj.record_services?.map(
                                          (e) => e.service
                                        );
                                        setSelectedDiagnosis(diagnoses || []);
                                        setSelectedItems(items || []);
                                        setSelectedServices(services || []);
                                        setPutForm(obj);
                                      }}
                                    >
                                      Edit <i className="fas fa-edit ml-2"></i>
                                    </label>
                                    <label
                                      className="btn btn-sm flex justify-between  btn-ghost font-semibold rounded-md"
                                      htmlFor={obj.id}
                                    >
                                      Delete{" "}
                                      <i className="fas fa-trash ml-2"></i>
                                    </label>
                                  </ul>
                                </div>
                              </div>
                              <ModalDelete
                                id={obj.id}
                                callback={() => deleteRecord(obj.id)}
                                title={`Hapus Record ${moment(
                                  obj.created_at
                                ).format("DD MMMM YYYY")}?`}
                              ></ModalDelete>
                              <table className="">
                                <tbody>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Complaint</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">{obj.complaint}</td>
                                  </tr>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Inspection</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">{obj.inspection}</td>
                                  </tr>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Description</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">{obj.description}</td>
                                  </tr>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Therapy</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">{obj.therapy}</td>
                                  </tr>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Diagnoses</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">
                                      {obj.record_diagnoses?.length > 0 && (
                                        <div className="bg-indigo-200 w-2/3 rounded-md">
                                          {obj.record_diagnoses.map((obj) => {
                                            return (
                                              <p
                                                className="text-justify mb-1 px-4 py-3 bg-indigo-50 border border-indigo-400 rounded-md"
                                                key={obj.id}
                                              >
                                                <b>{obj.diagnose?.code}</b> -{" "}
                                                {obj.diagnose?.description}
                                              </p>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </td>
                                  </tr>

                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Services</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">
                                      {obj.record_services?.length > 0 && (
                                        <div className="bg-emerald-200 w-2/3 rounded-md">
                                          {obj.record_services.map((obj) => {
                                            return (
                                              <p
                                                className="text-justify mb-1 px-4 py-3 bg-emerald-50 border border-emerald-400 rounded-md"
                                                key={obj.id}
                                              >
                                                <b>{obj.service?.code}</b> -{" "}
                                                {obj.service?.name}
                                              </p>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </td>
                                  </tr>

                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24">Items</td>
                                    <td className="w-4">:</td>
                                    <td className="py-2">
                                      {obj.record_items?.length > 0 && (
                                        <div className="bg-amber-200 w-2/3 rounded-md">
                                          {obj.record_items.map((obj) => {
                                            return (
                                              <p
                                                className="text-justify mb-1 px-4 py-3 bg-amber-50 border border-amber-400 rounded-md"
                                                key={obj.id}
                                              >
                                                <b>
                                                  {obj.item_variant?.item?.code}
                                                </b>{" "}
                                                - {obj.item_variant?.item?.name}{" "}
                                                -{" "}
                                                {obj.item_variant.variant +
                                                  " " +
                                                  obj.item_variant.unit}
                                              </p>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="text-sm text-zinc-500 align-text-top">
                                    <td className="w-24 align-top">Files</td>
                                    <td className="w-4 align-top">:</td>
                                    <td className="py-2 flex gap-2">
                                      {obj.record_files?.length > 0 &&
                                        obj.record_files?.map((obj) => {
                                          return (
                                            <React.Fragment key={obj.id}>
                                              <label className="relative group">
                                                <div className="rounded-md group-hover:brightness-[.3] duration-300 overflow-hidden bg-slate-50 border border-gray-400 w-28 h-28">
                                                  <img
                                                    className="object-cover grayscale opacity-80"
                                                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}${obj.file}`}
                                                    alt=""
                                                  />
                                                </div>
                                                <div className="absolute opacity-0 group-hover:opacity-100 duration-300 top-[35%] left-[11%]">
                                                  <div className="flex">
                                                    <label
                                                      htmlFor={
                                                        "fileNo" + obj.id
                                                      }
                                                      className="btn btn-sm w-10 h-10 px-0 py-0 bg-rose-400 border-none"
                                                    >
                                                      <i className="fas fa-trash text-sm"></i>
                                                    </label>
                                                    <label
                                                      htmlFor={
                                                        `filePreview` + obj.id
                                                      }
                                                      className="btn btn-sm w-10 h-10 px-0 py-0 ml-2 bg-indigo-500 border-none"
                                                    >
                                                      <i className="fas fa-eye text-sm"></i>
                                                    </label>
                                                  </div>
                                                </div>
                                              </label>
                                              <ModalDelete
                                                id={"fileNo" + obj.id}
                                                callback={() =>
                                                  deleteFile(obj.id)
                                                }
                                                title={`Hapus File?`}
                                              ></ModalDelete>
                                              <ModalBox
                                                id={`filePreview` + obj.id}
                                              >
                                                <img
                                                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${obj.file}`}
                                                  alt=""
                                                />
                                                <div className="modal-action pt-0 mt-0">
                                                  <label
                                                    className="btn mt-2"
                                                    htmlFor={
                                                      `filePreview` + obj.id
                                                    }
                                                  >
                                                    Close
                                                  </label>
                                                </div>
                                              </ModalBox>
                                            </React.Fragment>
                                          );
                                        })}
                                      <label
                                        htmlFor="modal-add-files"
                                        onClick={() => setPutForm(obj)}
                                      >
                                        <div className="btn flex items-center justify-center rounded-md overflow-hidden border border-gray-400 border-dashed bg-gray-50 text-gray-500 w-28 bg-cover h-28">
                                          <i className="fas fa-plus"></i>
                                        </div>
                                      </label>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Tambah catatan</h3>
          <form onSubmit={(e) => addRecord(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Complaint</span>
              </label>
              <textarea
                type="text"
                name="complaint"
                value={addForm.complaint}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.complaint && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.complaint}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Inspeciton</span>
              </label>
              <textarea
                type="text"
                name="inspection"
                value={addForm.inspection}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.inspection && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.inspection}
                  </span>
                </label>
              )}
              <label className="label mt-2">
                <span className="label-text">Deskripsi</span>
              </label>
              <textarea
                type="text"
                name="description"
                value={addForm.description}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.description && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.description}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Therapy</span>
              </label>
              <textarea
                type="text"
                name="therapy"
                value={addForm.therapy}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {addFormError.therapy && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.therapy}
                  </span>
                </label>
              )}

              <div className="dropdown">
                <label className="label mt-4">
                  <span className="label-text">Diagnosa</span>
                </label>
                <input
                  tabIndex={0}
                  ref={diagnoseRef}
                  type="text"
                  name="searchAdd"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search diagnosa ..."
                  className="input input-bordered input-md border-slate-300 w-full"
                />
                {search && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                  >
                    {!diagsosis?.data?.length && (
                      <li className="rounded-sm text-sm">
                        <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                          No data found
                        </div>
                      </li>
                    )}
                    {diagsosis?.data?.map((obj) => {
                      return (
                        <li key={obj.id} className="p-0 overflow-hidden">
                          <div
                            className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                            onClick={() => {
                              addMultiD(obj);
                              setSearch("");
                            }}
                          >
                            {obj.code +
                              " - " +
                              obj.description.substring(0, 50)}{" "}
                            {obj.description.length > 50 && "..."}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-2 bg-indigo-200 rounded-md">
                  {selectedDiagnosis.length > 0 &&
                    selectedDiagnosis?.map((obj) => {
                      return (
                        <div key={obj.id} className="p-0 overflow-hidden mb-1">
                          <div
                            className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs hover:bg-rose-200 bg-indigo-50 border border-indigo-400 rounded-md cursor-pointer"
                            onClick={() => {
                              addMultiD(obj);
                            }}
                          >
                            <div>
                              <b>{obj.code}</b>
                              {" - " + obj.description}{" "}
                            </div>
                            <div className="flex justify-center font-bold">
                              <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="dropdown">
                <label className="label mt-4">
                  <span className="label-text">Services</span>
                </label>
                <input
                  tabIndex={0}
                  // ref={diagnoseRef}
                  type="text"
                  name="searchAdd"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  placeholder="Cari ..."
                  className="input input-bordered input-md border-slate-300 w-full"
                />

                {searchService && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                  >
                    {!services?.data?.length && (
                      <li className="rounded-sm text-sm">
                        <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                          No data found
                        </div>
                      </li>
                    )}
                    {services?.data?.map((obj) => {
                      return (
                        <li key={obj.id} className="p-0 overflow-hidden">
                          <div
                            className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                            onClick={() => {
                              addMultiService(obj);
                              setSearchService("");
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

                <div className="mt-2 bg-emerald-200 rounded-md">
                  {selectedServices.length > 0 &&
                    selectedServices?.map((obj) => {
                      return (
                        <div key={obj.id} className="p-0 overflow-hidden mb-1">
                          <div
                            className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs hover:bg-rose-200 bg-emerald-50 border border-emerald-400 rounded-md cursor-pointer"
                            onClick={() => {
                              addMultiService(obj);
                            }}
                          >
                            <div>
                              <b>{obj.code}</b>
                              {" - " + obj.name}{" "}
                            </div>
                            <div className="flex justify-center font-bold">
                              <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="dropdown">
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
                  placeholder="Search item ..."
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
                      return obj.item_variants?.map((variant) => {
                        return (
                          <li key={variant.id} className="p-0 overflow-hidden">
                            <div
                              className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                              onClick={() => {
                                addMultiItem({
                                  ...obj,
                                  ...variant,
                                  id: variant.id,
                                });
                                setSearchItem("");
                              }}
                            >
                              {obj.code + " - " + obj.name.substring(0, 20)}{" "}
                              {obj.name.length > 20 && "..."}
                              {" - " + variant.variant + " " + variant.unit}
                            </div>
                          </li>
                        );
                      });
                    })}
                  </ul>
                )}

                <div className="mt-2 bg-amber-200 rounded-md">
                  {selectedItems.length > 0 &&
                    selectedItems?.map((obj) => {
                      return (
                        <div key={obj?.id} className="p-0 overflow-hidden mb-1">
                          <div
                            className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs hover:bg-rose-200 bg-amber-50 border border-amber-400 rounded-md cursor-pointer"
                            onClick={() => {
                              addMultiItem(obj);
                            }}
                          >
                            <div>
                              <b>{obj?.code}</b>
                              {" - " + obj?.name}
                              {" - "}
                              {obj?.variant + " " + obj?.unit}
                            </div>
                            <div className="flex justify-center font-bold">
                              <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
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

        <ModalBox id="modal-add-growth">
          <h3 className="font-bold text-lg mb-4">Growth Record</h3>
          <form onSubmit={(e) => addGrowth(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label mt-4">
                <span className="label-text">Height (cm)</span>
              </label>
              <input
                type="number"
                name="height"
                step=".01"
                value={addGrowthForm.height}
                onChange={(e) => handleAddGrowthInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              ></input>
              {addGrowthFormError.height && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addGrowthFormError.height}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Berat (kg)</span>
              </label>
              <input
                type="number"
                name="weight"
                step=".01"
                value={addGrowthForm.weight}
                onChange={(e) => handleAddGrowthInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              ></input>
              {addGrowthFormError.weight && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addGrowthFormError.weight}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-add-growth"
                ref={addGrowthModalRef}
                className="btn btn-ghost rounded-md"
              >
                Batalkan
              </label>
              <button className="btn btn-primary rounded-md">Tambah</button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-add-files">
          <h3 className="font-bold text-lg mb-4">Add Files</h3>
          <form onSubmit={(e) => addFile(e, putForm.id)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">File</span>
              </label>
              <div className="rounded border border-slate-400 p-2">
                <input
                  type="file"
                  name="file"
                  // multiple={true}
                  accept="image/*"
                  // value={files}
                  onChange={(e) => onSelectFile(e)}
                  className="m-0 p-0 w-full"
                />
                {/* {addFormError.file && (
                <label className="label">
                <span className="label-text-alt text-rose-300">
                    {addFormError.file}
                  </span>
                </label>
              )} */}
              </div>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-add-files"
                ref={addFileModalRef}
                className="btn btn-ghost rounded-md"
              >
                Batalkan
              </label>
              <button className="btn btn-primary rounded-md">Tambah</button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-put">
          <h3 className="font-bold text-lg mb-4">Edit Record</h3>
          <form onSubmit={(e) => putRecord(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Complaint</span>
              </label>
              <textarea
                type="text"
                name="complaint"
                value={putForm.complaint}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.complaint && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.complaint}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Inspeciton</span>
              </label>
              <textarea
                type="text"
                name="inspection"
                value={putForm.inspection}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.inspection && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.inspection}
                  </span>
                </label>
              )}
              <label className="label mt-2">
                <span className="label-text">Deskripsi</span>
              </label>
              <textarea
                type="text"
                name="description"
                value={putForm.description}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.description && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.description}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Therapy</span>
              </label>
              <textarea
                type="text"
                name="therapy"
                value={putForm.therapy}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                rows={3}
                className="input input-bordered input-primary border-slate-300 w-full h-16"
              ></textarea>
              {putFormError.therapy && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.therapy}
                  </span>
                </label>
              )}

              <div className="dropdown">
                <label className="label mt-4">
                  <span className="label-text">Diagnosa</span>
                </label>
                <input
                  tabIndex={0}
                  ref={diagnoseRef}
                  type="text"
                  name="searchAdd"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search diagnosa ..."
                  className="input input-bordered input-md border-slate-300 w-full"
                />
                {search && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                  >
                    {!diagsosis?.data?.length && (
                      <li className="rounded-sm text-sm">
                        <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                          No data found
                        </div>
                      </li>
                    )}
                    {diagsosis?.data?.map((obj) => {
                      return (
                        <li key={obj.id} className="p-0 overflow-hidden">
                          <div
                            className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                            onClick={() => {
                              addMultiD(obj);
                              setSearch("");
                            }}
                          >
                            {obj.code +
                              " - " +
                              obj.description.substring(0, 50)}{" "}
                            {obj.description.length > 50 && "..."}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-2 bg-indigo-200 rounded-md">
                  {selectedDiagnosis.length > 0 &&
                    selectedDiagnosis?.map((obj) => {
                      return (
                        <div key={obj.id} className="p-0 overflow-hidden mb-1">
                          <div
                            className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs hover:bg-rose-200 bg-indigo-50 border border-indigo-400 rounded-md cursor-pointer"
                            onClick={() => {
                              addMultiD(obj);
                            }}
                          >
                            <div>
                              <b>{obj.code}</b>
                              {" - " + obj.description}{" "}
                            </div>
                            <div className="flex justify-center font-bold">
                              <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="dropdown">
                <label className="label mt-4">
                  <span className="label-text">Services</span>
                </label>
                <input
                  tabIndex={0}
                  // ref={diagnoseRef}
                  type="text"
                  name="searchAdd"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  placeholder="Cari ..."
                  className="input input-bordered input-md border-slate-300 w-full"
                />

                {searchService && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                  >
                    {!services?.data?.length && (
                      <li className="rounded-sm text-sm">
                        <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                          No data found
                        </div>
                      </li>
                    )}
                    {services?.data?.map((obj) => {
                      return (
                        <li key={obj.id} className="p-0 overflow-hidden">
                          <div
                            className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                            onClick={() => {
                              addMultiService(obj);
                              setSearchService("");
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

                <div className="mt-2 bg-emerald-200 rounded-md">
                  {selectedServices.length > 0 &&
                    selectedServices?.map((obj) => {
                      return (
                        <div key={obj.id} className="p-0 overflow-hidden mb-1">
                          <div
                            className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs hover:bg-rose-200 bg-emerald-50 border border-emerald-400 rounded-md cursor-pointer"
                            onClick={() => {
                              addMultiService(obj);
                            }}
                          >
                            <div>
                              <b>{obj.code}</b>
                              {" - " + obj.name}{" "}
                            </div>
                            <div className="flex justify-center font-bold">
                              <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="dropdown">
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
                  placeholder="Search item ..."
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
                      return obj.item_variants?.map((variant) => {
                        return (
                          <li key={variant.id} className="p-0 overflow-hidden">
                            <div
                              className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                              onClick={() => {
                                addMultiItem({
                                  ...obj,
                                  ...variant,
                                  id: variant.id,
                                });
                                setSearchItem("");
                              }}
                            >
                              {obj.code + " - " + obj.name.substring(0, 20)}{" "}
                              {obj.name.length > 20 && "..."}
                              {" - " + variant.variant + " " + variant.unit}
                            </div>
                          </li>
                        );
                      });
                    })}
                  </ul>
                )}
                <div className="mt-2 bg-amber-200 rounded-md">
                  {selectedItems.length > 0 &&
                    selectedItems?.map((obj) => {
                      return (
                        <div key={obj?.id} className="p-0 overflow-hidden mb-1">
                          <div
                            className="group font-normal flex items-center justify-between p-4 normal-case text-justify transition-all text-xs hover:bg-rose-200 bg-amber-50 border border-amber-400 rounded-md cursor-pointer"
                            onClick={() => {
                              addMultiItem(obj);
                            }}
                          >
                            <div>
                              <b>{obj?.code}</b>
                              {" - " + obj?.name}
                              {" - "}
                              {obj?.variant + " " + obj?.unit}
                            </div>
                            <div className="flex justify-center font-bold">
                              <i className="fas fa-x collapse hidden group-hover:flex ml-3 transition-all text-rose-600"></i>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* <label className="label">
                <span className="label-text">File</span>
              </label>
              <input
                type="file"
                name="file"
                // multiple={true}
                value={putForm.file}
                onChange={(e) => handlePutInput(e)}
                className="border-slate-300 w-full"
              />
              {putFormError.file && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.file}
                  </span>
                </label>
              )} */}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-put"
                ref={putModalRef}
                className="btn btn-ghost rounded-md"
              >
                Batalkan
              </label>
              <button className="btn btn-success text-black rounded-md">
                Update
              </button>
            </div>
          </form>
        </ModalBox>

        <ModalBox id="modal-put-growth">
          <h3 className="font-bold text-lg mb-4">Update Growth Record</h3>
          <form onSubmit={(e) => putGrowth(e)} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Tinggi (cm)</span>
              </label>
              <input
                type="number"
                name="height"
                step=".01"
                value={putGrowthForm.height}
                onChange={(e) => handlePutGrowthInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              ></input>
              {putGrowthFormError.height && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putGrowthFormError.height}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Berat (kg)</span>
              </label>
              <input
                type="number"
                name="weight"
                step=".01"
                value={putGrowthForm.weight}
                onChange={(e) => handlePutGrowthInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              ></input>
              {putGrowthFormError.weight && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putGrowthFormError.weight}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-put-growth"
                ref={putGrowthModalRef}
                className="btn btn-ghost rounded-md"
              >
                Batalkan
              </label>
              <button className="btn btn-success text-zinc-900 rounded-md">
                Update
              </button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
