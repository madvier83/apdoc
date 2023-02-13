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
import { nanoid } from "nanoid";

import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
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

  const [queues, setQueues] = useState();
  async function getQueues() {
    try {
      const response = await axios.get(`queues`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setQueues(response.data);
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

  const [items, setItems] = useState();
  async function getItems() {
    try {
      const response = await axios.get(`items`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      setItems(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const [promotions, setPromotions] = useState();
  async function getPromotions() {
    try {
      const response = await axios.get(`promotions`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      setPromotions(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  async function getCategory() {
    try {
      const response = await axios.get("category-items", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setCategory(response.data);
      setCategoryLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getQueues();
    getServices();
    getEmployees();
    getPromotions();
    getItems();
    getCategory();
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

  const [cart, setCart] = useState({ array: [] });
  function addToCart(obj, remove) {
    let prevCart = cart.array;
    let newCart = [];

    let newItem = {
      id: obj.id,
      name: obj.name,
      sell_price: obj.sell_price,
      promotion_id: null,
      promotion: 0,
      promotion_name: "",
      qty: 1,
      total: obj.sell_price,
      discount: 0,
    };

    let isNewItem = true;
    prevCart.map((item) => {
      if (item.id == obj.id) {
        let oldItem;
        if (remove == true) {
          oldItem = {
            ...item,
            qty: item.qty - 1,
            total: item.sell_price * (item.qty - 1),
            discount: (item.sell_price * (item.qty - 1) * item.promotion) / 100,
          };
        } else {
          oldItem = {
            ...item,
            qty: item.qty + 1,
            total: item.sell_price * (item.qty + 1),
            discount: (item.sell_price * (item.qty + 1) * item.promotion) / 100,
          };
        }
        console.log(oldItem);
        oldItem.qty > 0 && newCart.push(oldItem);
        isNewItem = false;
      } else {
        newCart.push(item);
      }
    });
    if (isNewItem) {
      newCart.push(newItem);
    }
    setCart({ array: newCart });
  }
  function clearCart() {
    setCart({array: []})
  }

  const promotionRef = useRef();
  const [selectedCart, setSelectedCart] = useState({});
  function addPromotion(obj) {
    let newSelectedCart = {
      ...selectedCart,
      promotion_id: obj.id,
      promotion: obj.discount,
      promotion_name: obj.name,
      discount: (selectedCart.total * obj.discount) / 100,
    };

    let prevCart = cart.array;
    let newCart = [];

    prevCart.map((item) => {
      if (item.id == selectedCart.id) {
        newCart.push(newSelectedCart);
      } else {
        newCart.push(item);
      }
    });

    setCart({ array: newCart });
    promotionRef.current.click();
  }
  function removePromotion(obj) {
    let newSelectedCart = {
      ...obj,
      promotion_id: 0,
      promotion: 0,
      promotion_name: 0,
      discount: 0,
    };

    let prevCart = cart.array;
    let newCart = [];

    prevCart.map((item) => {
      if (item.id == obj.id) {
        newCart.push(newSelectedCart);
      } else {
        newCart.push(item);
      }
    });

    setCart({ array: newCart });
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
    clearCart()
  }, [selectedQueue])

  const [total, setTotal] = useState(0);
  function countTotal() {
    let currentTotal = 0;
    selectedQueue?.queue_details?.map((obj) => {
      if (obj.is_cancelled == 0) {
        currentTotal += obj.service.price;
      }
    });
    cart.array?.map(
      (obj) => (currentTotal = currentTotal + obj.total - obj.discount)
    );
    setTotal(currentTotal);
  }
  useEffect(() => {
    countTotal();
  }, [selectedQueue, cart.array]);

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
                  ref={servicesRef}
                  {...servicesEvents}
                  className="h-full rounded-md overflow-y-scroll overflow-x-hidden"
                >
                  <div
                    className={`overflow-hidden bg-opacity-70 rounded-md shadow-md mb-4`}
                  >
                    <div className="px-0 flex flex-col">
                      <div className="">
                        <label className="label px-0 pt-0">
                          <span className="label-text text-white ">
                            Patients
                          </span>
                          <span className="label-text opacity-50 ml-auto text-white">
                            {queues?.length} in queue
                          </span>
                        </label>
                        <select
                          onChange={(e) => {
                            setSelectedQueue(
                              queues.filter(
                                (obj) => e.target.value == obj.id
                              )[0]
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
                    </div>
                  </div>
                  <div className={` bg-opacity-50 rounded-md shadow-md mb-4`}>
                    <div className="px-0 flex flex-col">
                      <div className="">
                        <label className="label px-0">
                          <span className="label-text text-white ">
                            Library
                          </span>
                          <span className="label-text opacity-50 ml-auto text-white">
                            {items?.length} Items
                          </span>
                        </label>
                      </div>
                      <div className="bg-white rounded-md">
                        <div
                          tabIndex={0}
                          className="collapse p-0 m-0 rounded-md bg-white focus:bg-emerald-50 group"
                        >
                          <div className="collapse-title font-semibold capitalize text-sm group-focus:text-emerald-500 text-zinc-500 flex items-center gap-4">
                            <i className="fas fa-caret-down group-focus:-rotate-180 duration-500"></i>
                            <p>Promotion</p>
                          </div>
                          <div className="collapse-content font-normal capitalize">
                            {promotions?.map((obj) => {
                              return (
                                <div
                                  className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                                  key={obj.id}
                                >
                                  <span>{obj.name}</span>
                                  <span>{obj.discount}%</span>
                                </div>
                              );
                            })}
                            {promotions?.length <= 0 && (
                              <div className="btn btn-disabled bg-zinc-200 text-zinc-400 normal-case flex justify-between cursor-pointer transition-none">
                                No Promotion
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-md mt-4">
                        {category?.map((obj, index) => {
                          return (
                            <div
                              key={obj.id}
                              tabIndex={index}
                              className="collapse p-0 m-0 rounded-md bg-white focus:bg-emerald-50 group"
                            >
                              <div className="collapse-title font-semibold capitalize text-sm group-focus:text-emerald-500 text-zinc-500 flex items-center gap-4">
                                <i className="fas fa-caret-down group-focus:rotate-180 duration-500"></i>
                                <span>{obj.name}</span>
                              </div>
                              <div className="collapse-content font-normal capitalize">
                                {obj.items?.map((item) => {
                                  return (
                                    <div
                                      className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                                      key={item.id}
                                      onClick={() => addToCart(item)}
                                    >
                                      <span>{item.name}</span>
                                      <span>
                                        {numeral(item.sell_price).format("0,0")}
                                      </span>
                                    </div>
                                  );
                                })}
                                {obj.items?.length <= 0 && (
                                  <div className="btn btn-disabled bg-zinc-200 text-zinc-400 normal-case flex justify-between cursor-pointer transition-none">
                                    No Item
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
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
                          <i className="fas fa-mars z-10 absolute -right-2 text-sm group-focus:text-emerald-500 w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm font-bold text-blue-400 p-1 rounded-full"></i>
                        ) : (
                          <i className="fas fa-venus z-10 absolute -right-2 text-sm group-focus:text-emerald-500 w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm text-rose-400 p-1 rounded-full"></i>
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
                        <div className="w-full">
                          <div
                            ref={queuesRef}
                            {...queuesEvents}
                            className="overflow-y-scroll h-[44vh]"
                          >
                            <div className="mt-4">
                              <small className="text-zinc-400">Services</small>{" "}
                              <br />
                            </div>
                            <div className="flex flex-col mt-1 gap-1 rounded-md overflow-hidden">
                              <div
                                className={`flex justify-between overflow-hidden items-center px-1`}
                              >
                                <table
                                  className={`w-full text-sm breadcrumbs font-semibold text-zinc-800`}
                                >
                                  <tbody>
                                    {selectedQueue?.queue_details?.map(
                                      (obj) => {
                                        return (
                                          <tr key={obj.id}>
                                            <td
                                              className={`max-w-36 py-2 overflow-hidden ${
                                                obj.is_cancelled && "hidden"
                                              }`}
                                            >
                                              <i className="fa-solid fa-kit-medical mr-2"></i>
                                              <span className="truncate">
                                                {obj.service.name}
                                              </span>
                                            </td>
                                            <td
                                              className={`text-right max-w-36 overflow-hidden ${
                                                obj.is_cancelled && "hidden"
                                              }`}
                                            >
                                              {" "}
                                              {numeral(
                                                obj.service.price
                                              ).format("0,0")}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                              <small className="text-zinc-400">Items</small>{" "}
                              {cart.array?.length > 0 && (<small className="animate-pulse btn btn-ghost btn-xs normal-case text-zinc-400" onClick={clearCart}>Clear X</small>)}
                            </div>
                            <div className="flex flex-col mt-1 gap-1 rounded-md overflow-hidden">
                              <div className="">
                                <div
                                  className={`flex justify-between overflow-hidden items-center px-1`}
                                >
                                  <table
                                    className={`group w-full text-sm breadcrumbs font-semibold text-zinc-800`}
                                  >
                                    <tbody>
                                      {cart?.array?.map((obj) => {
                                        return (
                                          <React.Fragment key={obj.id}>
                                            <tr className="rounded-md transition-all duration-300">
                                              <td
                                                className={`w-56 py-2 overflow-hidden`}
                                              >
                                                <span
                                                  className="truncate cursor-pointer"
                                                  onClick={() => {
                                                    promotionRef.current.click();
                                                    setSelectedCart(obj, promotionRef.current.click());
                                                  }}
                                                >
                                                  {obj.name}
                                                </span>
                                              </td>
                                              <td
                                                className={`text-center w-16 overflow-hidden`}
                                              >
                                                <div className="grid grid-flow-col items-center">
                                                  <button
                                                    onClick={() =>
                                                      addToCart(obj, true)
                                                    }
                                                    className="btn btn-sm btn-ghost opacity-0 group-hover:opacity-100 pr-0 text-zinc-400 active:bg-zinc-100 hover:bg-zinc-100"
                                                  >
                                                    <i className="fas fa-caret-left"></i>
                                                  </button>
                                                  <span>{obj.qty}</span>
                                                  <button
                                                    onClick={() =>
                                                      addToCart(obj)
                                                    }
                                                    className="btn btn-sm btn-ghost opacity-0 group-hover:opacity-100 pl-0 text-zinc-400 active:bg-zinc-100 hover:bg-zinc-100"
                                                  >
                                                    <i className="fas fa-caret-right"></i>
                                                  </button>
                                                </div>
                                              </td>
                                              <td className={`text-right w-22`}>
                                                <div className="div flex justify-between items-center">
                                                  <div
                                                    className="tooltip tooltip-left"
                                                    data-tip="Add Discount"
                                                  >
                                                    <label
                                                      htmlFor="addPromotionModal"
                                                      className="btn btn-ghost opacity-0 group-hover:opacity-100 btn-sm text-blue-500 hover:bg-zinc-100"
                                                      onClick={() =>
                                                        setSelectedCart(obj)
                                                      }
                                                    >
                                                      <i className="fas fa-tag"></i>
                                                    </label>
                                                  </div>
                                                  <label
                                                    htmlFor="addPromotionModal"
                                                    className=""
                                                    onClick={() =>
                                                      setSelectedCart(obj)
                                                    }
                                                  >
                                                    <span>
                                                      {" "}
                                                      {numeral(
                                                        obj.total
                                                      ).format("0,0")}
                                                    </span>
                                                  </label>
                                                </div>
                                              </td>
                                            </tr>
                                            {obj.discount > 0 && (
                                              <tr className="text-emerald-400 py-2 text-sm">
                                                <td
                                                  className={`w-56 overflow-hidden`}
                                                >
                                                  <span className="truncate">
                                                    {/* <i className=""></i> */}
                                                    - Discount{" "}
                                                    {obj.promotion_name} (
                                                    {obj.promotion}%)
                                                  </span>
                                                </td>
                                                <td
                                                  className={`text-center w-16 overflow-hidden`}
                                                ></td>
                                                <td
                                                  className={`text-right w-22 flex justify-between`}
                                                >
                                                  <div
                                                    className="tooltip tooltip-left"
                                                    data-tip="Remove Discount"
                                                  >
                                                    <button
                                                      className="btn btn-ghost opacity-0 group-hover:opacity-100 btn-sm text-rose-400 hover:bg-zinc-100"
                                                      onClick={async () => {
                                                        removePromotion(obj)
                                                      }}
                                                    >
                                                      <i className="fas fa-trash"></i>
                                                    </button>
                                                  </div>
                                                  <span className="flex justify-end items-center">
                                                    {"-"}
                                                    {numeral(
                                                      obj.discount
                                                    ).format("0,0")}
                                                  </span>
                                                </td>
                                              </tr>
                                            )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between border-t-zinc-600 border-t py-2 w-full">
                    <p className="font-semibold ml-1">Total</p>
                    <p className="font-semibold ml-1 text-right">
                      {numeral(total).format("0,0")}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-6 items-end">
                    {/* <button className="btn btn-success bg-success text-white w-1/2">
                      Contact{" "}
                      <i className="fa-brands fa-whatsapp ml-2 font-bold"></i>
                    </button> */}
                    <label for="checkoutModal" className="btn btn-primary w-full">
                      Checkout <i className="fas fa-check ml-2"></i>
                    </label>
                  </div>
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

      <ModalBox id="addPromotionModal">
        <h3 className="font-bold text-lg mb-4">Add Promotion</h3>
        {/* <form onSubmit={() => {}} autoComplete="off"> */}
        <input type="hidden" autoComplete="off" />
        <div className="form-control w-full">
          <div className="bg-white rounded-md mt-4">
            <div
              tabIndex={0}
              className="collapse collapse-open p-0 m-0 rounded-md bg-emerald-50 group"
            >
              <div className="collapse-title font-semibold capitalize text-sm text-emerald-500 flex items-center gap-4">
                <i className="fas fa-caret-down group-focus:-rotate-180 duration-500"></i>
                <p>Promotion</p>
              </div>
              <div className="collapse-content font-normal capitalize">
                {promotions?.map((obj) => {
                  return (
                    <div
                      className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                      key={obj.id}
                      onClick={() => addPromotion(obj)}
                    >
                      <span>{obj.name}</span>
                      <span>{obj.discount}%</span>
                    </div>
                  );
                })}
                {promotions?.length <= 0 && (
                  <div className="btn btn-disabled bg-zinc-200 text-zinc-400 normal-case flex justify-between cursor-pointer transition-none">
                    No Promotion
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action rounded-sm">
          <label
            htmlFor="addPromotionModal"
            ref={promotionRef}
            className="btn btn-ghost rounded-md"
          >
            Cancel
          </label>
          {/* <button className="btn btn-primary rounded-md">Add</button> */}
        </div>
        {/* </form> */}
      </ModalBox>
      <ModalBox id="checkoutModal">
        <h3 className="font-bold text-lg mb-4">Payment Method</h3>
        {/* <form onSubmit={() => {}} autoComplete="off"> */}
        <input type="hidden" autoComplete="off" />
        <div className="form-control w-full">
          <div className="bg-white rounded-md mt-4">
            <div
              tabIndex={0}
              className="collapse collapse-open p-0 m-0 rounded-md bg-emerald-50 group"
            >
              <div className="collapse-title font-semibold capitalize text-sm text-emerald-500 flex items-center gap-4">
                <i className="fas fa-caret-down group-focus:-rotate-180 duration-500"></i>
                <p>Promotion</p>
              </div>
              <div className="collapse-content font-normal capitalize">
                {promotions?.map((obj) => {
                  return (
                    <div
                      className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                      key={obj.id}
                      onClick={() => addPromotion(obj)}
                    >
                      <span>{obj.name}</span>
                      <span>{obj.discount}%</span>
                    </div>
                  );
                })}
                {promotions?.length <= 0 && (
                  <div className="btn btn-disabled bg-zinc-200 text-zinc-400 normal-case flex justify-between cursor-pointer transition-none">
                    No Promotion
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action rounded-sm">
          <label
            htmlFor="checkoutModal"
            className="btn btn-ghost rounded-md"
          >
            Cancel
          </label>
          <button className="btn btn-primary rounded-md">Checkout</button>
        </div>
        {/* </form> */}
      </ModalBox>
    </>
  );
}
