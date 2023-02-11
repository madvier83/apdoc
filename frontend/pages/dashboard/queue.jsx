import React, {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { Expo, gsap } from "gsap";
import { useDraggable } from "react-use-draggable-scroll";
import { getCookies } from "cookies-next";
import moment from "moment";

import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../api/axios";

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
  const [isRegular, setIsRegular] = useState(true);

  // open service form ref
  let infoRef = useRef();
  let serviceRef = useRef();
  const addServiceTL = useRef();
  useLayoutEffect(() => {
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
      getPatients()
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
      getPatients()
    } catch (err) {
      console.error(err);
    }
  }

  const [queues, setQueues] = useState();
  async function getQueues() {
    try {
      const response = await axios.get(`queues`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      setQueues(response.data);
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
    getServices();
    getEmployees();
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
  // console.log(selectedQueue)
  // console.log(patients);

  return (
    <>
      <DashboardLayout title="Queue List">
        <div className="mt-6">
          <div className="tabs">
            <span
              onClick={() => setIsRegular(true)}
              className={`relative text-md py-3 rounded-t-md px-8 bg-gray-900 text-white cursor-pointer ${
                !isRegular && "opacity-30"
              }`}
            >
              Regular <i className="fa-regular fa-user ml-2"></i>
              {queues?.length > 0 && (
                <div className="badge badge-error font-bold absolute z-10 -top-2 -right-2">
                  {queues.length}
                </div>
              )}
              <div
                className={`bg-gray-900 rounded-b-md rounded-r-md w-8 h-8 absolute left-0`}
              ></div>
            </span>
            <span
              onClick={() => setIsRegular(false)}
              className={`relative text-md py-3 rounded-t-md px-8 bg-gray-900 text-white  cursor-pointer ${
                isRegular && "opacity-30"
              }`}
            >
              Appointment <i className="fa-regular fa-calendar-check ml-2"></i>
              {queues?.length > 0 && (
                <div className="badge badge-error font-bold absolute z-10 -top-2 -right-2">
                  {queues.length}
                </div>
              )}
            </span>
          </div>
          <div
            className={`relative max-w-6xl min-w-0 md:min-w-[720px] bg-gray-900 p-8 rounded-b-md rounded-r-md ${
              !isRegular && "rounded-l-md"
            }`}
          >
            <div
              ref={listRef}
              className="flex flex-col md:flex-row gap-4"
              style={{ display: "block" }}
            >
              <div className="h-[74vh] min-h-fit md:w-1/2">
                <div
                  ref={servicesRef}
                  {...servicesEvents}
                  className="h-full rounded-md overflow-y-scroll overflow-x-hidden"
                >
                  {queues?.map((obj) => {
                    return (
                      <div
                        key={obj.id}
                        onClick={() => setSelectedQueue(obj)}
                        className={`card cursor-pointer overflow-hidden ${
                          obj.id == selectedQueue.id
                            ? "bg-indigo-900 bg-opacity-50"
                            : "bg-slate-800"
                        } bg-opacity-70 rounded-md shadow-md mb-4`}
                      >
                        <div className="card-body">
                          <div className="flex items-center">
                            <div className="avatar mr-6">
                              <div className="w-16 mask mask-hexagon shadow-md bg-primary flex items-center justify-center">
                                <h1 className="text-xl font-semibold text-white mb-1">
                                  {obj.queue_number}
                                </h1>
                              </div>
                              {obj.patient.gender == "male" ? (
                                <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm font-bold text-blue-400 p-1 rounded-full"></i>
                              ) : (
                                <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm text-rose-400 p-1 rounded-full"></i>
                              )}
                            </div>
                            <div className="">
                              <h2 className="card-title text-base lg:text-lg text-primary-content">
                                {obj.patient.name}
                              </h2>
                              <small className="text-zinc-400">
                                NIK: {obj.patient.nik} |{" "}
                                {obj.status_id == 1 && "Active"}
                                {obj.status_id == 2 && "Done"}
                                {obj.status_id == 3 && "Canceled"}
                              </small>
                            </div>
                            <div
                              className={`ml-auto ${
                                obj.id == selectedQueue.id ? "block" : "hidden"
                              }`}
                            >
                              <div
                                onClick={() => cancelQueue(obj.id)}
                                className="btn btn-ghost text-rose-400 bg-rose-900 bg-opacity-50"
                              >
                                Cancel <i className="fas fa-trash ml-2"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <label
                    htmlFor="addQueueModal"
                    onClick={getPatients}
                    className="card select-none cursor-pointer rounded-md bg-slate-800 shadow-md mb-4 animate-pulse"
                  >
                    <div className="card-body">
                      <div className="flex items-center text-zinc-400">
                        <div className="mx-auto">
                          <span className="font-semibold">Add to queue</span>
                          <i className="fas fa-plus ml-2"></i>
                        </div>
                      </div>
                    </div>
                  </label>
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
                      <div className="avatar mr-6">
                        <div className="w-16 mask mask-hexagon shadow-md bg-primary flex items-center justify-center">
                          <h1 className="text-xl font-semibold text-white mb-1">
                            {selectedQueue?.queue_number}
                          </h1>
                        </div>

                        {selectedQueue?.patient?.gender == "male" ? (
                          <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm font-bold text-blue-400 p-1 rounded-full"></i>
                        ) : (
                          <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm text-rose-400 p-1 rounded-full"></i>
                        )}
                      </div>
                      <div className="w-full">
                        <h2 className="card-title text-base lg:text-lg text-zinc-600 truncate">
                          {selectedQueue?.patient?.name}
                        </h2>
                        <small className="text-zinc-400">
                          NIK: {selectedQueue?.patient?.nik} |{" "}
                          {selectedQueue.status_id == 1 && "Active"}
                          {selectedQueue.status_id == 2 && "Done"}
                          {selectedQueue.status_id == 3 && "Canceled"}
                        </small>
                      </div>
                    </div>
                    <div className="px-0" ref={infoRef}>
                      <div className="relative">
                        <div className="absolute w-full">
                          <div className="mt-4">
                            <small className="text-zinc-400">
                              Date of birth
                            </small>{" "}
                            <br />
                            <span className="font-sm text-zinc-800">
                              {selectedQueue?.patient?.birth_place +
                                ", " +
                                moment(
                                  selectedQueue?.patient?.birth_date
                                ).format("MMMM Do YYYY")}
                            </span>
                          </div>
                          <div className="mt-4">
                            <small className="text-zinc-400">Address</small>{" "}
                            <br />
                            <span className="font-sm text-zinc-800 line-clamp-2">
                              {selectedQueue?.patient?.address}
                            </span>
                          </div>
                          <div className="mt-4">
                            <small className="text-zinc-400">Services</small>{" "}
                            <br />
                          </div>
                          <div className="flex flex-col mt-1 gap-1 rounded-md overflow-hidden h-[24vh]">
                            <div
                              ref={queuesRef}
                              {...queuesEvents}
                              className="overflow-y-scroll"
                            >
                              {selectedQueue?.queue_details?.map((obj) => {
                                return (
                                  <div
                                    key={obj.id}
                                    className={`flex justify-between overflow-hidden items-center px-1 ${
                                      obj.is_cancelled && "opacity-25"
                                    }`}
                                  >
                                    <div
                                      className={`text-sm breadcrumbs font-semibold text-zinc-800`}
                                    >
                                      <ul>
                                        <li
                                          className={`max-w-36 overflow-hidden ${
                                            obj.is_cancelled &&
                                            "line-through text-rose-600"
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
                                            "line-through text-rose-600"
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

                    <div
                      ref={serviceRef}
                      className="text-zinc-600"
                      style={{ display: "none" }}
                    >
                      <div className="w-auto">
                        <label className="label ml-0 pl-0">
                          <small className="label-text text-zinc-400 text-xs mt-4">
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
                          <option value="">Unasigned</option>
                          {services?.map((obj) => {
                            return (
                              <option key={obj.id} value={obj.id}>
                                {obj.name}
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
                      </div>
                    </div>
                  </div>

                  {!isAddService ? (
                    <div className="flex gap-2 mt-6 items-end">
                      <button className="btn btn-success bg-success text-white w-1/2">
                        Contact{" "}
                        <i className="fa-brands fa-whatsapp ml-2 font-bold"></i>
                      </button>
                      <button className="btn btn-primary w-1/2">
                        Checkout <i className="fas fa-check ml-2"></i>
                      </button>
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
        </div>

        {/* Patients Modal */}
        <input type="checkbox" id="addQueueModal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box px-0 pt-1 w-11/12 max-w-7xl">
            <div
              className={
                "relative flex flex-col min-w-0 break-words w-full mb-32 min-h-fit rounded text-blueGray-700 bg-white"
              }
            >
              <div className="rounded-t mb-0 px-4 py-4 border-0">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className={"font-semibold text-lg "}>
                      <i className="fas fa-filter mr-3"></i> Patients Table
                    </h3>
                  </div>
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                    <label
                      className=""
                      ref={queueAddedRef}
                      htmlFor="addQueueModal"
                    >
                      <i className="fas fa-x font-bold"></i>
                    </label>
                  </div>
                </div>
              </div>
              <div className="min-h-[80vh] block w-full overflow-x-auto">
                {/* Projects table */}
                <table className="items-center w-full bg-transparent border-collapse">
                  <thead>
                    <tr>
                      <th className="pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        #
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Name
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Birth
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Phone
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Created At
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Updated At
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Acitons
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientsLoading && (
                      <tr>
                        <td colSpan={99}>
                          <div className="flex w-full justify-center my-4">
                            <img src="/loading.svg" alt="now loading" />
                          </div>
                        </td>
                      </tr>
                    )}
                    {patients?.map((obj, index) => {
                      return (
                        <tr key={obj.id}>
                          <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            <span className={"ml-3 font-bold "}>
                              {index + 1}
                            </span>
                          </th>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <i
                              className={`text-md mr-2 ${
                                obj.gender == "male"
                                  ? "text-blue-400 fas fa-mars"
                                  : "text-pink-400 fas fa-venus"
                              }`}
                            ></i>{" "}
                            <span className={"font-bold"}>{obj.name}</span>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <span className={"capitalize"}>
                              {moment(obj.birth_date).format("MMM Do YYYY")} -{" "}
                              {obj.birth_place}
                            </span>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <a
                              href={`https://wa.me/${obj.phone.replace(
                                /\D/g,
                                ""
                              )}`}
                              target="_blank"
                              className={""}
                            >
                              <i className="fa-brands fa-whatsapp text-emerald-500 mr-1"></i>{" "}
                              {obj.phone}
                            </a>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {moment(obj.created_at).format("MMM Do YYYY")}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {moment(obj.updated_at).fromNow()}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {obj.queues[0]?.status_id == 1 ? (
                              <button
                                className="btn btn-xs btn-disabled text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              >
                                Already In Queue
                              </button>
                            ) : (
                              <button
                                // htmlFor="addQueueModal"
                                onClick={() => addToQueue(obj.id)}
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
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
