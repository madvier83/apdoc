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

import DashboardLayout from "../../../../layouts/DashboardLayout";
import axios from "../../../api/axios";
import Link from "next/link";
import ModalDelete from "../../../../components/Modals/ModalDelete";

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
  
  const [clinic, setClinic] = useState()

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
    try {
      const response = await axios.get("patients", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setPatients(response.data);
      setPatientsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  const queueAddedRef = useRef();
  async function addToQueue(id) {
    try {
      const response = await axios.post(
        `queue/${id}`,
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
      getPatients();
      queueAddedRef.current.click();
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
      getPatients();
    } catch (err) {
      console.error(err);
    }
  }

  const [queues, setQueues] = useState();
  const [queuesLoading, setQueuesLoading] = useState(true);
  async function getQueues() {
    setQueuesLoading(true);
    try {
      const response = await axios.get(`queues`, {
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
    try {
      const response = await axios.get("appointments", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
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
    try {
      const response = await axios.get(`services`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      setServices(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const [employees, setEmployees] = useState();
  async function getEmployees() {
    try {
      const response = await axios.get(`employees`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getQueues();
    // getServices();
    // getEmployees();
    getAppointment();
  }, []);

  const initialServiceForm = {
    queue_id: "",
    service_id: "",
    employee_id: "",
  };
  const [serviceForm, setServiceForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialServiceForm
  );
  const handleServiceInput = (event) => {
    const { name, value } = event.target;
    setServiceForm({ [name]: value });
  };
  // console.log(serviceForm)
  async function addService() {
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
    } catch (err) {
      console.error(err);
      setAddServiceError(err.response?.data?.message);
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

  return (
    <>
      <DashboardLayout title="Queue List" clinic={clinic} setClinic={setClinic}>
        <div className="mt-6">
          <div
            className={`relative flex flex-col md:flex-row gap-4 max-w-7xl min-w-0 md:min-w-[720px]`}
          >
            <div className="w-1/2">
              <div className="tabs bg-gray-900 rounded-md">
                <span
                  onClick={() => setIsRegular(true)}
                  className={`relative text-sm pt-6 rounded-t-md pl-7 pr-4 bg-gray-900 text-white cursor-pointer ${
                    !isRegular && "opacity-30"
                  }`}
                >
                  Regular <i className="fa-regular fa-user ml-2"></i>
                  {/* {queues?.length > 0 && (
                    <div className="badge badge-error font-bold absolute z-10 -top-2 -right-2">
                      {queues.length}
                    </div>
                  )} */}
                  <div
                    className={`bg-gray-900 rounded-b-md rounded-r-md w-8 h-8 absolute left-0`}
                  ></div>
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
                                    } h-24 transition-all duration-200 flex items-center justify-center mr-4 ease-out`}
                                  >
                                    <h1 className="mb-1">{obj.queue_number}</h1>
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
                                  {/* <label
                                    className={`ml-auto flex h-24 items-center transition-all justify-center border-none text-gray-500 bg-indigo-900 bg-opacity-10 cursor-pointer duration-500 ${
                                      obj.id == selectedQueue.id
                                        ? "w-16 text-lg"
                                        : "w-10 opacity-60"
                                    } ease-out`}
                                    htmlFor={obj.queue_number}
                                  >
                                    <i className="fas fa-trash px-4"></i>
                                  </label> */}
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
                            <div className="card-body h-24 py-5">
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
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {queues?.length <= 0 && (
                      <label
                        // htmlFor="addQueueModal"
                        // onClick={getPatients}
                        className={`card select-none rounded-md bg-slate-800 shadow-md mb-4 ${
                          !isRegular && "hidden"
                        }`}
                      >
                        <div className="card-body py-4">
                          <div className="flex items-center text-zinc-400">
                            <div className="mx-auto">
                              <span className="font-semibold">No queue</span>
                              {/* <i className="fas fa-plus ml-2"></i> */}
                            </div>
                          </div>
                        </div>
                      </label>
                    )}
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
                                      {/* <div
                                        onClick={() => cancelService(obj.id)}
                                        className="btn btn-ghost btn-sm px-2"
                                      >
                                        {obj.is_cancelled ? (
                                          <i className="fas fa-undo"></i>
                                        ) : (
                                          <i className="fas fa-trash"></i>
                                        )}
                                      </div> */}
                                    </div>
                                  </div>
                                );
                              })}
                              {/* <div
                                className="py-2 mt-1 text-sm flex items-center justify-center bg-gray-700 text-white rounded-md font-semibold cursor-pointer select-none"
                                onClick={() => setIsAddService(true)}
                              >
                                <span>Add service</span>
                                <i className="fas fa-add ml-2 font-thin"></i>
                              </div> */}
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
                      <select
                        name="service_id"
                        onChange={(e) => handleServiceInput(e)}
                        value={serviceForm.service_id}
                        required
                        className="input input-bordered without-ring input-primary border-slate-300 w-full"
                      >
                        <option value="">Select service</option>
                        {services?.map((obj) => {
                          return (
                            <option key={obj.id} value={obj.id}>
                              {obj.name} - {numeral(obj.price).format("0,0")}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="w-auto">
                      <label className="label ml-0 pl-0">
                        <small className="label-text text-gray-400 text-xs mt-2">
                          Employee
                        </small>
                      </label>
                      <select
                        name="employee_id"
                        onChange={(e) => handleServiceInput(e)}
                        value={serviceForm.employee_id}
                        required
                        className="input input-bordered without-ring input-primary border-slate-300 w-full"
                      >
                        <option value="">Unasigned</option>
                        {employees?.map((obj) => {
                          return (
                            <option key={obj.id} value={obj.id}>
                              {obj.name}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-rose-400 text-sm mt-2">
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
                      href={`https://wa.me/${selectedQueue.patient?.phone.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      className="btn btn-success bg-success text-white w-1/2"
                    >
                      Contact{" "}
                      <i className="fa-brands fa-whatsapp ml-2 font-bold"></i>
                    </a>
                    <Link
                      href={`/dashboard/doctor/patient/${selectedQueue.patient?.id}`}
                      className={`btn btn-primary w-1/2`}
                    >
                      Records <i className="fas fa-heart-pulse ml-2"></i>
                    </Link>
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
    </>
  );
}
