import React, {
  useEffect,
  // useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { Expo, gsap } from "gsap";
import { useDraggable } from "react-use-draggable-scroll";
import { getCookies } from "cookies-next";
import moment from "moment";
import numeral from "numeral";

import DashboardLayout from "../../../layouts/DashboardLayout";
import axios from "../../api/axios";
import Link from "next/link";
import ModalDelete from "../../../components/Modals/ModalDelete";
import Highlighter from "react-highlight-words";
import Loading from "../../../components/loading";

export default function Queue() {
  // Drag to scroll ref
  const servicesRef = useRef();
  const { events: servicesEvents } = useDraggable(servicesRef, {
    applyRubberBandEffect: true,
  });
  const queuesRef = useRef();
  const { events: queuesEvents } = useDraggable(queuesRef, {
    applyRubberBandEffect: true,
  });

  // toggle state
  const [isAddService, setIsAddService] = useState(false);
  const [addServiceError, setAddServiceError] = useState("");
  const [isRegular, setIsRegular] = useState(true);
  const tableRef = useRef();

  const [clinic, setClinic] = useState();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState(true);

  const [selectedService, setSelectedService] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [searchService, setSearchService] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");

  // open service form ref
  let infoRef = useRef();
  let serviceRef = useRef();
  const addServiceTL = useRef();
  useEffect(() => {
    addServiceTL.current = gsap.timeline({ paused: true });
    addServiceTL.current.to(infoRef.current, {
      duration: 0.25,
      opacity: 0,
      x: -50,
      display: "none",
      ease: Expo.easeInOut,
    });
    addServiceTL.current.to(serviceRef.current, {
      duration: 0,
      display: "block",
      opacity: 0,
      x: 50,
    });
    addServiceTL.current.to(serviceRef.current, {
      duration: 0.25,
      opacity: 1,
      ease: Expo.easeInOut,
      x: 0,
    });
  }, []);

  useEffect(() => {
    isAddService ? addServiceTL.current.play() : addServiceTL.current.reverse();
  }, [isAddService]);

  // add queue ref
  let listRef = useRef();

  const token = getCookies("token");
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);

  async function getPatients() {
    if (!clinic) {
      return;
    }
    setPatientsLoading(true)
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
      setPatients({})
      setPatientsLoading(false);
    }
  }

  const queueAddedRef = useRef();
  async function addToQueue(id) {
    try {
      const response = await axios.post(
        `queue/${id}`,
        {
          clinic_id: clinic,
        },
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response);
      getQueues();
      getPatients();
      queueAddedRef.current.click();
    } catch (err) {
      console.error(err);
    }
  }
  async function addToQueueAppointment(id) {
    try {
      const response = await axios.post(
        `queue/${id}/appointment`,
        {
          clinic_id: clinic,
        },
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "application/json",
          },
        }
      );
      setIsRegular(true);
      // getQueues();
      // getAppointment()
      // getPatients();
    } catch (err) {
      console.error(err);
    }
  }

  async function cancelQueue(id) {
    try {
      const response = await axios.put(
        `queue/${id}/3`,
        {},
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response);
      getQueues();
      getAppointment();
      getPatients();
    } catch (err) {
      console.error(err);
    }
  }

  const [queues, setQueues] = useState();
  const [queuesLoading, setQueuesLoading] = useState(true);
  async function getQueues() {
    if (!clinic) {
      return;
    }
    setQueuesLoading(true);
    try {
      const response = await axios.get(`queues/${clinic && clinic}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      setQueues(response.data);

      if (isRegular) {
        let isFound = false;
        response.data.map((obj) => {
          if (obj.id == selectedQueue.id) {
            setSelectedQueue(obj);
            isFound = true;
          }
        });
        if (!isFound) {
          setSelectedQueue(response.data[0]);
        }
        response.data.length <= 0 && setSelectedQueue({ dummy });
      }
      setQueuesLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  const [appointment, setAppointment] = useState();
  const [appointmentLoading, setAppointmentLoading] = useState(true);
  async function getAppointment() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `appointments/${clinic && clinic + "/"}${999999}?page=${1}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      setAppointment(response.data.data);
      setAppointmentLoading(false);

      if (!isRegular) {
        if (response.data?.data?.length > 0) {
          setSelectedQueue(response.data.data[0]);
        } else {
          setSelectedQueue(dummy);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  const [services, setServices] = useState();
  async function getServices() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `services/${clinic && clinic + "/"}${perpage}${
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
            Authorization: "Bearer" + token.token,
          },
        }
      );
      // console.log(response.data);
      setServices(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const [employees, setEmployees] = useState();
  async function getEmployees() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `employees/${clinic && clinic + "/"}${perpage}${
          searchEmployee &&
          "/" +
            searchEmployee
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
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const initialServiceForm = {
    queue_id: "",
    service_id: "",
    employee_id: "",
  };
  const [serviceForm, setServiceForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialServiceForm
  );

  async function addService() {
    if (!serviceForm.service_id) {
      return setAddServiceError("Select service");
    }
    if (!serviceForm.employee_id) {
      return setAddServiceError("Select employee");
    }
    try {
      const response = await axios.post(
        `queue-detail/${selectedQueue?.id}/${serviceForm.employee_id}/${serviceForm.service_id}`,
        {},
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response);
      getQueues();
      setIsAddService(false);
      setServiceForm(initialServiceForm);
      setSelectedService({});
      setSelectedEmployee({});
    } catch (err) {
      console.error(err);
      setAddServiceError(err.response.data.message);
    }
  }
  async function cancelService(id) {
    try {
      const response = await axios.put(
        `queue-detail/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response);
      getQueues();
    } catch (err) {
      console.error(err);
    }
  }

  const dummy = {
    id: 0,
    patient_id: 0,
    queue_number: "--",
    status_id: 1,
    clinic_id: null,
    created_at: "-",
    updated_at: "-",
    patient: {
      id: 0,
      nik: "*",
      name: "*",
      birth_place: "*",
      birth_date: "1970-01-06T08:00:03.000000Z",
      gender: "*",
      address: "*",
      phone: "*",
      clinic_id: null,
      is_delete: 0,
      created_at: "*",
      updated_at: "*",
    },
    queue_details: null,
  };
  const [selectedQueue, setSelectedQueue] = useState(dummy);

  useEffect(() => {
    setIsAddService(false);
  }, [selectedQueue]);

  useEffect(() => {
    setAddServiceError("");
    setServiceForm(initialServiceForm);
    setSelectedEmployee({});
    setSelectedService({});
  }, [isAddService]);

  useEffect(() => {
    setIsAddService(false);
    if (!isRegular && appointment?.length > 0) {
      setSelectedQueue(appointment[0]);
    } else {
      setSelectedQueue(dummy);
    }
    if (isRegular && queues?.length > 0) {
      setSelectedQueue(queues[0]);
    }
  }, [isRegular]);

  useEffect(() => {
    getQueues();
    getServices();
    getEmployees();
    getAppointment();
  }, [isRegular]);

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
    setSearchService("");
    setSearchEmployee("");
    setPage(1);
    setIsAddService(false);
    getQueues();
    getAppointment();
  }, [clinic]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getServices();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchService, clinic]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getEmployees();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchEmployee, clinic]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [patients]);

  return (
    <>
      <DashboardLayout title="Queue List" clinic={clinic} setClinic={setClinic}>
        <div className="mt-6">
          <div
            className={`relative flex flex-col md:flex-row gap-4 max-w-7xl min-w-0 md:min-w-[720px]`}
          >
            <div className="w-1/2">
              <div className="tabs bg-gray-900 rounded-t-md">
                <span
                  onClick={() => setIsRegular(true)}
                  className={`relative text-sm pt-6 rounded-t-md pl-7 pr-4 bg-gray-900 text-white cursor-pointer ${
                    !isRegular && "opacity-30"
                  }`}
                >
                  Queue <i className="fa-regular fa-user ml-2"></i>
                </span>
                <span
                  onClick={() => setIsRegular(false)}
                  className={`relative text-sm pt-6 rounded-t-md px-4 bg-gray-900 text-white  cursor-pointer ${
                    isRegular && "opacity-30"
                  }`}
                >
                  Appointment{" "}
                  <i className="fa-regular fa-calendar-check ml-2"></i>
                  {/* {queues?.length > 0 && (
                    <div className="badge badge-error font-bold absolute z-10 -top-2 -right-2">
                      {queues.length}
                    </div>
                  )} */}
                </span>
                <span
                  onClick={() => {
                    getQueues();
                    getAppointment();
                  }}
                  className={`relative text-sm pt-6 ml-auto rounded-t-md px-6 bg-gray-900 text-white cursor-pointer`}
                >
                  <i
                    className={`fas fa-refresh mx-1 ${
                      queuesLoading && "animate-spin opacity-50"
                    }`}
                  ></i>
                </span>
              </div>
              <div ref={listRef} className="" style={{ display: "block" }}>
                <div
                  className={`h-[81.6vh] min-h-fit md:w-full bg-gray-900 px-6 pt-3 rounded-b-md rounded-r-md ${
                    !isRegular && "rounded-l-md"
                  }`}
                >
                  <div
                    ref={servicesRef}
                    {...servicesEvents}
                    className="h-full rounded-md overflow-y-scroll overflow-x-hidden"
                  >
                    {isRegular &&
                      queues?.map((obj, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div
                              key={obj.id}
                              onClick={() => setSelectedQueue(obj)}
                              className={`card mt-4 cursor-pointer overflow-hidden ${
                                obj.id == selectedQueue.id
                                  ? "bg-indigo-900 text-white bg-opacity-40"
                                  : "bg-slate-800 text-gray-400"
                              } bg-opacity-70 rounded-md shadow-md mb-4`}
                            >
                              <div
                                className={`card-body py-0 px-0 group ${
                                  obj.id == selectedQueue.id
                                    ? "opacity-100"
                                    : "opacity-60"
                                }`}
                              >
                                <div className={`flex items-center `}>
                                  <div
                                    className={`${
                                      obj.id == selectedQueue.id
                                        ? "bg-indigo-900 font-bold text-2xl w-24"
                                        : "bg-indigo-900 bg-opacity-50 font-bold text-2xl w-[4.8rem]"
                                    } h-24 transition-all flex items-center justify-center mr-4 ease-out`}
                                  >
                                    <h1 className="mb-1">{obj.queue_number}</h1>
                                    {/* <h1 className="mb-1">A199</h1> */}
                                  </div>
                                  <div className="ml-2">
                                    <h2 className="card-title lg:text-lg">
                                      {obj.patient?.name}
                                    </h2>
                                    <small className="text-zinc-400">
                                      NIK: {obj.patient?.nik} |{" "}
                                      {obj.status_id == 1 && "Active"}
                                      {obj.status_id == 2 && "Done"}
                                      {obj.status_id == 3 && "Canceled"}
                                    </small>
                                  </div>
                                  <label
                                    className={`ml-auto flex h-24 items-center transition-all justify-center border-none text-gray-500 hover:text-rose-500 bg-indigo-900 bg-opacity-10 cursor-pointer ${
                                      obj.id == selectedQueue.id
                                        ? "w-16 px-3 text-lg"
                                        : "w-12 px-3 opacity-60 text-lg"
                                    } ease-out`}
                                    htmlFor={obj.queue_number}
                                  >
                                    <i className="fas fa-trash px-4"></i>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <ModalDelete
                              id={obj.queue_number}
                              callback={() => cancelQueue(obj.id)}
                              title={`Delete queue ${obj.queue_number}?`}
                            ></ModalDelete>
                          </React.Fragment>
                        );
                      })}

                    {!isRegular &&
                      appointment?.map((obj) => {
                        return (
                          <div
                            key={obj.id}
                            onClick={() => setSelectedQueue(obj)}
                            className={`card cursor-pointer overflow-hidden mt-4 ${
                              obj.id == selectedQueue.id
                                ? "bg-indigo-900 bg-opacity-50"
                                : "bg-slate-800"
                            } bg-opacity-70 rounded-md shadow-md mb-4`}
                          >
                            <div className="card-body h-24 py-5 px-6">
                              <div className="flex items-center">
                                <div className="">
                                  <h2 className="card-title text-base lg:text-lg text-primary-content">
                                    {obj.patient?.name}
                                  </h2>
                                  <small className="text-zinc-400">
                                    {moment(obj.appointment_date).format(
                                      "DD MMM YYYY, h:mm A"
                                    )}
                                  </small>
                                </div>
                                <div
                                  className={`ml-auto ${
                                    obj.id == selectedQueue.id
                                      ? "block"
                                      : "hidden"
                                  }`}
                                ></div>
                                {obj.status_id == 1 && (
                                  <button
                                    // htmlFor="addQueueModal"
                                    onClick={() =>
                                      addToQueueAppointment(obj.id)
                                    }
                                    className="btn btn-xs btn-primary text-xs font-bold uppercase px-3 py-1 ml-auto rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  >
                                    Add to queue{" "}
                                    <i className="fas fa-add ml-2"></i>
                                  </button>
                                )}
                                {obj.status_id == 2 && (
                                  <button className="btn btn-xs btn-disabled ml-auto bg-slate-100 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                                    In Queue
                                  </button>
                                )}
                                {obj.status_id == 3 && (
                                  <button className="btn btn-xs btn-disabled ml-auto bg-emerald-100 text-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                                    Completed
                                  </button>
                                )}
                                {obj.status_id == 4 && (
                                  <button className="btn btn-xs btn-disabled ml-auto bg-rose-100 text-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                                    Cancelled
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    <label
                      htmlFor="addQueueModal"
                      onClick={getPatients}
                      className={`card select-none cursor-pointer rounded-md bg-slate-800 shadow-md mb-4 ${
                        !isRegular && "hidden"
                      }`}
                    >
                      <div className="card-body py-4">
                        <div className="flex items-center text-zinc-400">
                          <div className="mx-auto">
                            <span className="font-semibold">Add to queue</span>
                            <i className="fas fa-plus ml-2"></i>
                          </div>
                        </div>
                      </div>
                    </label>
                    {appointment?.length <= 0 && (
                      <label
                        className={`card select-none rounded-md bg-slate-800 shadow-md mb-4 ${
                          isRegular && "hidden"
                        }`}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center text-zinc-400">
                            <div className="mx-auto">
                              <span className="font-semibold">
                                No Appointment
                              </span>
                            </div>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card min-h-[74vh] rounded-md md:w-1/2 bg-base-100 shadow-md">
              <div
                className={`card-body justify-between ${
                  selectedQueue.id ? "" : "hidden"
                }`}
              >
                <div className="">
                  <div className="flex items-center mb-4">
                    <div className="w-full">
                      <h2 className="card-title text-base font-semibold lg:text-2xl text-zinc-900 truncate flex">
                        {selectedQueue?.patient?.name}
                        {/* {selectedQueue?.patient?.gender == "male" ? (
                          <i className="fas fa-mars z-10 text-xl ml-1 text-blue-400"></i>
                        ) : (
                          <i className="fas fa-venus z-10 text-xl ml-1 text-rose-400"></i>
                        )} */}
                      </h2>
                      <small className="text-zinc-400">
                        NIK: {selectedQueue?.patient?.nik} | Gender:{" "}
                        {selectedQueue?.patient?.gender}
                      </small>
                      <div className="border-t border-dashed mt-4"></div>
                    </div>
                  </div>
                  <div className="px-0" ref={infoRef}>
                    <div className="relative">
                      <div className="absolute w-full">
                        <div className="">
                          <small className="text-zinc-400">Date of birth</small>{" "}
                          <br />
                          <span className="font-sm text-zinc-800">
                            {selectedQueue?.patient?.birth_place +
                              ", " +
                              moment(selectedQueue?.patient?.birth_date).format(
                                "DD MMMM YYYY"
                              )}
                          </span>
                        </div>
                        <div className="mt-4">
                          <small className="text-zinc-400">Address</small>{" "}
                          <br />
                          <span className="font-sm text-zinc-800 line-clamp-2">
                            {selectedQueue?.patient?.address}
                          </span>
                        </div>
                        {!isRegular && (
                          <div className="">
                            <div className="mt-4">
                              <small className="text-zinc-400">
                                Appointment date
                              </small>{" "}
                              <br />
                              <span className="font-sm text-zinc-800 line-clamp-2">
                                {moment(selectedQueue?.appointment_date).format(
                                  "DD MMM YYYY, h:mm A"
                                )}
                              </span>
                            </div>
                            <div className="mt-4">
                              <small className="text-zinc-400">
                                Description
                              </small>{" "}
                              <br />
                              <span className="font-sm text-zinc-800 line-clamp-2">
                                {selectedQueue?.description}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className={`${!isRegular && "hidden"}`}>
                          <div className="mt-4">
                            <small className="text-zinc-400">Services</small>{" "}
                            <br />
                          </div>
                          <div className="flex flex-col mt-1 gap-1 rounded-md overflow-hidden h-[32vh]">
                            <div
                              ref={queuesRef}
                              {...queuesEvents}
                              className="overflow-y-scroll"
                            >
                              {selectedQueue?.queue_details?.map((obj) => {
                                return (
                                  <div
                                    key={obj.id}
                                    className={`flex justify-between overflow-hidden items-center px-1`}
                                  >
                                    <div
                                      className={`text-sm breadcrumbs font-semibold text-zinc-800`}
                                    >
                                      <ul>
                                        <li
                                          className={`max-w-36 overflow-hidden ${
                                            obj.is_cancelled &&
                                            "line-through text-rose-400"
                                          }`}
                                        >
                                          <i className="fa-solid fa-kit-medical mr-2"></i>
                                          <span className="truncate">
                                            {obj.service.name}
                                          </span>
                                        </li>
                                        <li
                                          className={`max-w-36 overflow-hidden text-zinc-400 ${
                                            obj.is_cancelled &&
                                            "line-through text-rose-400"
                                          }`}
                                        >
                                          <i className="fas fa-user-doctor mr-2"></i>
                                          <span className="text-sm normal-case truncate">
                                            {obj.employee.name}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="flex">
                                      {/* {!obj.is_cancelled && (
                                        <div className="btn btn-ghost btn-sm px-2">
                                          <i className="fas fa-edit"></i>
                                        </div>
                                      )} */}
                                      <div
                                        onClick={() => cancelService(obj.id)}
                                        className="btn btn-ghost btn-sm px-2"
                                      >
                                        {obj.is_cancelled ? (
                                          <i className="fas fa-undo"></i>
                                        ) : (
                                          <i className="fas fa-trash"></i>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <div
                                className="py-2 mt-1 text-sm flex items-center justify-center bg-gray-700 text-white rounded-md font-semibold cursor-pointer select-none"
                                onClick={() => setIsAddService(true)}
                              >
                                <span>Add service</span>
                                <i className="fas fa-add ml-2 font-thin"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    ref={serviceRef}
                    className="text-zinc-600"
                    style={{ display: "none" }}
                  >
                    <div className="w-auto">
                      <label className="label ml-0 pl-0">
                        <small className="label-text text-zinc-400 text-xs">
                          Service
                        </small>
                      </label>
                      <div className="dropdown w-full">
                        {selectedService?.id && (
                          <div className="p-0 overflow-hidden mb-1">
                            <div
                              className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs hover:bg-rose-200 border border-slate-300 rounded-md cursor-pointer"
                              onClick={() => {
                                setSelectedService({});
                                setServiceForm({ service_id: null });
                              }}
                            >
                              <div className="flex justify-end font-bold">
                                <i className="fas fa-x absolute collapse hidden group-hover:flex mt-1 transition-all text-rose-600"></i>
                              </div>
                              <div className="text-sm font-semibold flex">
                                <p className="text-left">
                                  {selectedService.name}
                                </p>
                                <p className="text-right group-hover:pr-4">
                                  Rp.{" "}
                                  {numeral(selectedService.price).format("0,0")}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {!selectedService?.id && (
                          <>
                            <input
                              tabIndex={0}
                              type="text"
                              name="searchAdd"
                              value={searchService}
                              onChange={(e) => setSearchService(e.target.value)}
                              placeholder="Search service ..."
                              className="input input-bordered border-slate-300 w-full"
                            />
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
                                  <li
                                    key={obj.id}
                                    className="p-0 overflow-hidden"
                                  >
                                    <div
                                      className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                                      onClick={() => {
                                        setSelectedService(obj);
                                        setServiceForm({ service_id: obj.id });
                                        setSearchService("");
                                      }}
                                    >
                                      <p className="text-left">{obj.name}</p>
                                      <p className="text-right pr-4">
                                        Rp. {numeral(obj.price).format("0,0")}
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-auto">
                      <label className="label ml-0 pl-0">
                        <small className="label-text text-gray-400 text-xs mt-2">
                          Employee
                        </small>
                      </label>
                      <div className="dropdown w-full">
                        {selectedEmployee?.id && (
                          <div className="p-0 overflow-hidden mb-1">
                            <div
                              className="group font-normal justify-start p-3 normal-case text-justify transition-all text-xs hover:bg-rose-200 border border-slate-300 rounded-md cursor-pointer"
                              onClick={() => {
                                setSelectedEmployee({});
                                setServiceForm({ employee_id: null });
                              }}
                            >
                              <div className="flex justify-end font-bold">
                                <i className="fas fa-x absolute collapse hidden group-hover:flex mt-1 transition-all text-rose-600"></i>
                              </div>
                              <p className="text-sm font-semibold">
                                {selectedEmployee.name}
                              </p>
                            </div>
                          </div>
                        )}
                        {!selectedEmployee?.id && (
                          <>
                            <input
                              tabIndex={0}
                              type="text"
                              name="searchAdd"
                              value={searchEmployee}
                              onChange={(e) =>
                                setSearchEmployee(e.target.value)
                              }
                              placeholder="Search employee ..."
                              className="input input-bordered border-slate-300 w-full"
                            />
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu border bg-white w-full rounded-md border-slate-300 overflow-hidden"
                            >
                              {!employees?.data?.length && (
                                <li className="rounded-sm text-sm">
                                  <div className="btn btn-ghost font-semibold btn-sm justify-start p-0 pl-4 normal-case">
                                    No data found
                                  </div>
                                </li>
                              )}
                              {employees?.data?.map((obj) => {
                                return (
                                  <li
                                    key={obj.id}
                                    className="p-0 overflow-hidden"
                                  >
                                    <div
                                      className="btn btn-ghost font-normal btn-sm justify-start p-0 pl-4 normal-case truncate"
                                      onClick={() => {
                                        setSelectedEmployee(obj);
                                        setServiceForm({ employee_id: obj.id });
                                        setSearchEmployee("");
                                      }}
                                    >
                                      {obj.name}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      </div>
                      <p className="text-rose-400 text-sm mt-4">
                        {addServiceError}
                      </p>
                    </div>
                  </div>
                </div>

                {!isAddService ? (
                  <div
                    className={`flex gap-2 mt-6 items-end  ${
                      !isRegular && "hidden"
                    }`}
                  >
                    <a
                      href={`${
                        selectedQueue.phone
                          ? `https://wa.me/` + obj.phone?.replace(/\D/g, "")
                          : ""
                      }`}
                      target="_blank"
                      className="btn btn-success bg-success text-white w-1/2"
                    >
                      Contact{" "}
                      <i className="fa-brands fa-whatsapp ml-2 font-bold"></i>
                    </a>
                    <Link
                      href={`/dashboard/receptionist/patient/${selectedQueue.patient?.id}`}
                      className={`btn btn-primary w-1/2`}
                    >
                      Records <i className="fas fa-heart-pulse ml-2"></i>
                    </Link>
                    {/* <Link
                      href={"/dashboard/transaction"}
                      className={`btn btn-primary w-1/2`}
                    >
                      Checkout <i className="fas fa-check ml-2"></i>
                    </Link> */}
                  </div>
                ) : (
                  <div className="flex gap-2 mt-6 items-end">
                    <button
                      onClick={() => setIsAddService(false)}
                      className="btn btn-error text-white w-1/2"
                    >
                      Cancel <i className="fas fa-x ml-2 font-bold"></i>
                    </button>
                    <button
                      onClick={addService}
                      className="btn btn-primary w-1/2"
                    >
                      Add <i className="fas fa-plus ml-2"></i>
                    </button>
                  </div>
                )}
              </div>
              <div
                className={`card-body justify-between ${
                  selectedQueue.id ? "hidden" : ""
                }`}
              >
                <div className="alert btn-primary rounded-md">
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
                    <span>Empty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Patients Modal */}
      <input type="checkbox" id="addQueueModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box px-0 p-0 max-w-6xl">
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full min-h-fit rounded-md text-blueGray-700 bg-white"
            }
          >
            <div className="rounded-t-md mb-0 px-4 py-4 border-0">
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
                    className="bg-rose-400 text-white active:bg-rose-400 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    ref={queueAddedRef}
                    htmlFor="addQueueModal"
                  >
                    <i className="fas fa-x"></i>
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
                        className={`flex items-center justify-between cursor-pointer`}
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
                        className={`flex items-center justify-between cursor-pointer`}
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
                        className={`flex items-center justify-between cursor-pointer`}
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
                          <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap px-4 text-left">
                            <span className={"ml-3 font-bold "}>
                              {index + patients.from}
                            </span>
                          </th>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-3">
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
                                searchWords={search.split()}
                                autoEscape={true}
                                textToHighlight={obj.name}
                              ></Highlighter>
                            </span>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-3">
                            <span className={"capitalize"}>
                              {moment(obj.birth_date).format("DD MMM YYYY")}
                              {/* -{" "}
                            {obj.birth_place} */}
                            </span>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            <span className="">
                              {obj.address?.substring(0, 50)}{" "}
                              {obj.address.length > 50 && "..."}
                            </span>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-3">
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
                          {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-3">
                          {moment(obj.created_at).format("DD MMM YYYY")}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-3">
                          {moment(obj.updated_at).fromNow()}
                        </td> */}
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-3">
                            {obj.queues[0]?.status_id == 1 ? (
                              <button className="btn btn-xs btn-disabled text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                                In Queue
                              </button>
                            ) : (
                              <button
                                // htmlFor="addQueueModal"
                                onClick={() => {
                                  addToQueue(obj.id);
                                  setSearch("");
                                }}
                                className="btn btn-xs btn-primary text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              >
                                Add to queue <i className="fas fa-add ml-2"></i>
                              </button>
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
        </div>
      </div>
    </>
  );
}
