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
import numeral from "numeral";

export default function Transaction() {
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

  // add queue ref
  let listRef = useRef();

  const token = getCookies("token");

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
      console.log(response);
      getQueues();
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
      // let isFound = false;
      // response.data.map((obj) => {
      //   if (obj.id == selectedQueue?.id) {
      //     setSelectedQueue(obj);
      //     isFound = true;
      //   }
      // });
      // if (!isFound) {
      //   setSelectedQueue(response.data[0]);
      // }
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
  // console.log(selectedQueue);

  return (
    <>
      <DashboardLayout title="Transaction">
        <div className="mt-6">
          <div
            className={`relative max-w-6xl min-w-0 md:min-w-[720px] bg-gray-900 p-8 rounded-b-md rounded-t-md ${
              !isRegular && "rounded-l-md"
            }`}
          >
            <div
              ref={listRef}
              className="flex flex-col md:flex-row gap-4"
              style={{ display: "block" }}
            >
              <div className="h-[80vh] min-h-fit md:w-1/2">
                <div
                  // key={selectedQueue?.id}
                  // onClick={() => setSelectedQueue(selectedQueue)}
                  className={`card overflow-hidden ${
                    selectedQueue?.id == selectedQueue?.id
                      ? "bg-indigo-900 bg-opacity-50"
                      : "bg-slate-800"
                  } bg-opacity-70 rounded-md shadow-md mb-4`}
                >
                  <div className="card-body pt-6 flex flex-col">
                    <div className="">
                      <label className="label px-0">
                        <span className="label-text text-white ">Patients</span><span className="label-text opacity-50 ml-auto text-white">{queues?.length} in queue</span>
                      </label>
                      <select
                        onChange={(e) => {
                          setSelectedQueue(
                            queues.filter((obj) => e.target.value == obj.id)[0]
                          );
                        }}
                        className="input py-4 h-full input-bordered without-ring input-primary border-slate-300 w-full"
                      >
                        <option value={dummy.id}>Select</option>
                        {queues?.map((obj) => {
                          return (
                            <option key={obj.id} value={obj.id}>
                              {obj.patient.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    {/* <div className="flex items-center mt-4">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-hexagon shadow-md bg-primary flex items-center justify-center">
                            <h1 className="text-xl font-semibold text-white mb-1">
                              {selectedQueue?.queue_number}
                            </h1>
                          </div>
                          {selectedQueue?.patient.gender == "male" ? (
                            <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm font-bold text-blue-400 p-1 rounded-full"></i>
                          ) : (
                            <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm text-rose-400 p-1 rounded-full"></i>
                          )}
                        </div>
                        <div className="">
                          <h2 className="card-title text-base lg:text-lg text-primary-content">
                            {selectedQueue?.patient.name}
                          </h2>
                          <small className="text-zinc-400">
                            NIK: {selectedQueue?.patient.nik} |{" "}
                            {selectedQueue?.status_id == 1 && "Active"}
                            {selectedQueue?.status_id == 2 && "Done"}
                            {selectedQueue?.status_id == 3 && "Canceled"}
                          </small>
                        </div>
                      </div> */}
                  </div>
                </div>
                <div
                  ref={servicesRef}
                  {...servicesEvents}
                  className="h-full rounded-md overflow-y-scroll overflow-x-hidden"
                >
                  <div
                    className={`card overflow-hidden bg-slate-800 bg-opacity-50 rounded-md shadow-md mb-4`}
                  >
                    <div className="card-body pt-6 flex flex-col">
                      <div className="">
                        <label className="label pt-0 px-0">
                          <span className="label-text text-white ">
                            Library
                          </span>
                        </label>
                      </div>

                      <div
                        tabIndex={0}
                        className="collapse p-0 collapse-arrow rounded-md border border-base-300 bg-base-100"
                      >
                        <div className="collapse-title font-normal">
                          Promotion
                        </div>
                        <div className="collapse-content font-normal text-xs">
                          <p>
                            tabIndex={0} attribute is necessary to make the div
                            focusable
                          </p>
                        </div>
                      </div>
                      <div
                        tabIndex={0}
                        className="collapse p-0 m-0 collapse-arrow rounded-md border border-base-300 bg-base-100"
                      >
                        <div className="collapse-title font-normal">
                          Uncategorized
                        </div>
                        <div className="collapse-content font-normal text-xs">
                          <p>
                            tabIndex={0} attribute is necessary to make the div
                            focusable
                          </p>
                        </div>
                      </div>
                      <div
                        tabIndex={0}
                        className="collapse p-0 m-0 collapse-arrow rounded-md border border-base-300 bg-base-100"
                      >
                        <div className="collapse-title font-normal">Items</div>
                        <div className="collapse-content font-normal text-xs">
                          <p>
                            tabIndex={0} attribute is necessary to make the div
                            focusable
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card min-h-[74vh] rounded-md md:w-1/2 bg-base-100 shadow-md">
                <div
                  className={`card-body justify-between ${
                    selectedQueue?.id ? "" : "hidden"
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
                          {selectedQueue?.status_id == 1 && "Active"}
                          {selectedQueue?.status_id == 2 && "Done"}
                          {selectedQueue?.status_id == 3 && "Canceled"}
                        </small>
                      </div>
                    </div>
                    <div className="px-0" ref={infoRef}>
                      <div className="relative">
                        <div className="absolute w-full">
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
                                        {/* <li
                                          className={`max-w-36 overflow-hidden text-zinc-400 ${
                                            obj.is_cancelled &&
                                            "line-through text-rose-600"
                                          }`}
                                        >
                                          <i className="fas fa-user-doctor mr-2"></i>
                                          <span className="text-sm normal-case truncate">
                                            {obj.employee.name}
                                          </span>
                                        </li> */}
                                      </ul>
                                    </div>
                                    <div className="flex">
                                      Rp. {numeral(obj.service.price).format("0,0")}
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
                    selectedQueue?.id ? "hidden" : ""
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
      </DashboardLayout>
    </>
  );
}
