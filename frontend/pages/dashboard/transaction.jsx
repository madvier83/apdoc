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
  const token = getCookies("token");

  // Drag to scroll ref
  const servicesRef = useRef();
  const { events: servicesEvents } = useDraggable(servicesRef, {
    applyRubberBandEffect: true,
  });
  const queuesRef = useRef();
  const { events: queuesEvents } = useDraggable(queuesRef, {
    applyRubberBandEffect: true,
  });

  let infoRef = useRef();
  let listRef = useRef();
  const promotionRef = useRef();
  const servicePromotionRef = useRef();
  const transactionRef = useRef();

  const [total, setTotal] = useState(0);
  const [suggest, setSuggest] = useState([]);

  const [queues, setQueues] = useState();
  const [queuesLoading, setQueuesLoading] = useState(true);
  const [services, setServices] = useState();
  const [employees, setEmployees] = useState();
  const [items, setItems] = useState();
  const [promotions, setPromotions] = useState();

  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryPayments, setCategoryPayments] = useState([]);
  const [categoryPaymentsLoading, setCategoryPaymentsLoading] = useState(true);

  const [cart, setCart] = useState({ array: [] });
  const [serviceCart, setServiceCart] = useState({ array: [] });

  const [selectedCart, setSelectedCart] = useState({});
  const [selectedServiceCart, setSelectedServiceCart] = useState({});

  const dummyTransaction = {
    patient_id: 0,
    payment_id: null,
    payment: null,
    items: [],
    services: [],
  };
  const [transaction, setTransaction] = useState(dummyTransaction);
  const [paymentAmount, setPaymentAmount] = useState("");

  const dummyQueue = {
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
  const [selectedQueue, setSelectedQueue] = useState(dummyQueue);

  async function getQueues() {
    setQueuesLoading(true);
    try {
      const response = await axios.get(`queues`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setQueues(response.data);
      setQueuesLoading(false);
      response.data.length <= 0 && setSelectedQueue({ dummyQueue });
      response.data.map((obj) => {
        if (obj.id == selectedQueue.id) {
          setSelectedQueue(obj);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

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

  async function getCategoryPayments() {
    try {
      const response = await axios.get("category-payments", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setCategoryPayments(response.data);
      setCategoryPaymentsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  function addToCart(obj, remove) {
    let prevCart = cart.array;
    let newCart = [];
    let newItem = {
      id: obj.id,
      qty: 1,
      promotion_id: null,

      name: obj.name,
      sell_price: obj.sell_price,
      promotion: 0,
      promotion_name: "",
      discount: 0,
      total: obj.sell_price,
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

  function addCartPromotion(obj) {
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

  function removeCartPromotion(obj) {
    let prevCart = cart.array;
    let newCart = [];
    let newSelectedCart = {
      ...obj,
      promotion_id: 0,
      promotion: 0,
      promotion_name: 0,
      discount: 0,
    };
    prevCart.map((item) => {
      if (item.id == obj.id) {
        newCart.push(newSelectedCart);
      } else {
        newCart.push(item);
      }
    });
    setCart({ array: newCart });
  }

  function clearCart() {
    setCart({ array: [] });
  }

  function addServiceCart() {
    let newCart = [];
    selectedQueue?.queue_details?.map((obj) => {
      if (obj.is_cancelled == 0) {
        newCart.push({
          id: obj.service_id,
          employee_id: obj.employee_id,
          promotion_id: 0,

          name: obj.service.name,
          price: obj.service.price,
          promotion: 0,
          promotion_name: "",
          discount: 0,
        });
      }
    });
    setServiceCart({ array: newCart });
  }

  function addServiceCartPromotion(promotion, item) {
    let newItem = {
      ...item,
      promotion_id: promotion.id,

      promotion: promotion.discount,
      promotion_name: promotion.name,
      discount: (item.price * promotion.discount) / 100,
    };
    let prevCart = serviceCart.array;
    let newCart = [];
    prevCart.map((obj) => {
      if (obj.id == item.id) {
        newCart.push(newItem);
      } else {
        newCart.push(obj);
      }
    });
    setServiceCart({ array: newCart });
    servicePromotionRef.current.click();
  }

  function removeServiceCartPromotion(obj) {
    let prevCart = serviceCart.array;
    let newCart = [];
    let newSelectedCart = {
      ...obj,
      promotion_id: 0,
      promotion: 0,
      promotion_name: 0,
      discount: 0,
    };
    prevCart.map((item) => {
      if (item.id == obj.id) {
        newCart.push(newSelectedCart);
      } else {
        newCart.push(item);
      }
    });
    setServiceCart({ array: newCart });
  }

  function setAllCartPromotion(promotion) {
    let newServiceCart = serviceCart.array?.map((item) => {
      let newItem = {
        ...item,
        promotion_id: promotion.id,

        promotion: promotion.discount,
        promotion_name: promotion.name,
        discount: (item.price * promotion.discount) / 100,
      };
      return newItem;
    });
    setServiceCart({ array: newServiceCart });

    let newCart = cart.array?.map((item) => {
      let newItem = {
        ...item,
        promotion_id: promotion.id,

        promotion: promotion.discount,
        promotion_name: promotion.name,
        discount: (item.total * promotion.discount) / 100,
      };
      return newItem;
    });
    setCart({ array: newCart });
  }

  function countTotal() {
    let currentTotal = 0;
    serviceCart.array?.map(
      (obj) => (currentTotal = currentTotal + obj.price - obj.discount)
    );
    cart.array?.map(
      (obj) => (currentTotal = currentTotal + obj.total - obj.discount)
    );
    setTotal(currentTotal);
  }

  async function createTransaction() {
    console.log(transaction);
    try {
      const response = await axios.post(`transaction`, transaction, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      getQueues();
      setSelectedQueue(dummyQueue);
      setTransaction(dummyTransaction);
      setPaymentAmount(0);
      transactionRef.current.click();
    } catch (err) {
      console.error(err);
    }
  }

  function suggestCash() {
    const newSuggest = [];

    let cash = total;
    const fraction = [10000, 20000, 50000, 100000];
    do {
      fraction.push(fraction[fraction.length - 1] + 50000);
    } while (fraction[fraction.length - 1] < 5000000);

    let limit = 50000;
    if (cash <= 50000) limit = 100000;
    if (cash >= 100000 && cash % 100000 <= 50000) limit = 100000;
    if (cash % 100000 == 0) limit = 0;
    fraction.map(
      (obj) =>
        newSuggest.length < 2 &&
        obj - cash < limit &&
        obj > cash &&
        newSuggest.push(obj)
    );
    setSuggest(newSuggest);
  }

  useEffect(() => {
    getQueues();
    getServices();
    getEmployees();
    getPromotions();
    getItems();
    getCategory();
    getCategoryPayments();
  }, []);

  useEffect(() => {
    countTotal();
  }, [selectedQueue, cart.array, serviceCart.array]);

  useEffect(() => {
    clearCart();
    addServiceCart();
  }, [selectedQueue]);

  useEffect(() => {
    setTransaction((prev) => {
      return {
        ...prev,
        patient_id: selectedQueue?.patient_id,
        payment: paymentAmount,
        items: cart.array,
        services: serviceCart.array,
      };
    });
  }, [selectedQueue, cart.array, serviceCart.array, paymentAmount]);

  useEffect(() => {
    suggestCash();
    setTransaction((prev) => {
      return {
        ...prev,
        payment_id: null,
        payment: paymentAmount,
      };
    });
    setPaymentAmount("");
  }, [total, selectedQueue, cart.array, serviceCart.array]);

  return (
    <>
      <DashboardLayout title="Transaction">
        <div className="mt-6">
          <div
            className={`relative max-w-6xl min-w-0 md:min-w-[720px] bg-gray-900 p-8 rounded-b-md rounded-t`}
          >
            <div
              ref={listRef}
              className="flex flex-col-reverse md:flex-row gap-4"
              style={{ display: "block" }}
            >
              <div className="h-[80vh] min-h-fit md:w-1/2">
                <div
                  ref={servicesRef}
                  {...servicesEvents}
                  className="h-full rounded-md overflow-y-scroll overflow-x-hidden"
                >
                  <div
                    className={`overflow-hidden bg-opacity-70 rounded-md shadow-md mb-0`}
                  >
                    <div className="px-0 flex flex-col">
                      <div className="">
                        <label className="label px-0 pt-0">
                          <span className="label-text text-white ">
                            Patients
                          </span>
                          <span className="label-text opacity-50 ml-auto text-white">
                            {queues?.length} in queue{" "}
                            <i
                              className={`fas fa-refresh ml-1 ${
                                queuesLoading && "animate-spin opacity-50"
                              }`}
                              onClick={() => getQueues()}
                            ></i>
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
                          <option value={dummyQueue.id}>Select</option>
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
                  <div className={` bg-opacity-50 rounded-md shadow-md mb-0`}>
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
                            <p>Promotions</p>
                          </div>
                          <div className="collapse-content font-normal capitalize">
                            {promotions?.map((obj) => {
                              return (
                                <div
                                  className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                                  key={obj.id}
                                  onClick={() => setAllCartPromotion(obj)}
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
                      <div className="bg-white rounded-md mt-4 min-h-[58vh]">
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
                      {/* <div className="avatar mr-6">
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
                      </div> */}
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
                            className="overflow-y-scroll h-[47vh]"
                          >
                            <div className="mt-4">
                              <small className="text-zinc-400">Services</small>{" "}
                              <br />
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
                                      {serviceCart?.array?.map((obj) => {
                                        return (
                                          <React.Fragment key={obj.id}>
                                            <tr className="rounded-md transition-all duration-300">
                                              <td
                                                className={`w-2/3 py-2 overflow-hidden`}
                                              >
                                                <span
                                                  className="truncate cursor-pointer"
                                                  onClick={() => {
                                                    promotionRef.current.click();
                                                    setSelectedCart(obj);
                                                  }}
                                                >
                                                  {obj.name}
                                                </span>
                                              </td>
                                              <td
                                                className={`text-center w-16 overflow-hidden`}
                                              ></td>
                                              <td className={`text-right w-22`}>
                                                <div className="div flex justify-between items-center">
                                                  <div
                                                    className="tooltip tooltip-left"
                                                    data-tip="Add Discount"
                                                  >
                                                    {obj.discount <= 0 && (
                                                      <label
                                                        htmlFor="addServicePromotionModal"
                                                        className="btn btn-ghost opacity-0 group-hover:opacity-100 btn-sm text-blue-500 hover:bg-zinc-100"
                                                        onClick={() =>
                                                          setSelectedServiceCart(
                                                            obj
                                                          )
                                                        }
                                                      >
                                                        <i className="fas fa-tag"></i>
                                                      </label>
                                                    )}
                                                  </div>
                                                  <label
                                                    htmlFor="addServicePromotionModal"
                                                    className=""
                                                    onClick={() =>
                                                      setSelectedServiceCart(
                                                        obj
                                                      )
                                                    }
                                                  >
                                                    <span>
                                                      {" "}
                                                      {numeral(
                                                        obj.price
                                                      ).format("0,0")}
                                                    </span>
                                                  </label>
                                                </div>
                                              </td>
                                            </tr>
                                            {obj.discount > 0 && (
                                              <tr className="text-emerald-400 py-2 text-sm">
                                                <td
                                                  className={`w-2/3 overflow-hidden`}
                                                >
                                                  <span className="truncate">
                                                    ⤷ Discount{" "}
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
                                                      onClick={() => {
                                                        removeServiceCartPromotion(
                                                          obj
                                                        );
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
                            <div className="mt-4 flex justify-between">
                              <small className="text-zinc-400">Items</small>{" "}
                              {cart.array?.length > 0 && (
                                <small
                                  className="animate-pulse btn btn-ghost btn-xs normal-case text-zinc-400"
                                  onClick={clearCart}
                                >
                                  Clear X
                                </small>
                              )}
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
                                                className={`w-2/3 py-2 overflow-hidden`}
                                              >
                                                <span
                                                  className="truncate cursor-pointer"
                                                  onClick={() => {
                                                    promotionRef.current.click();
                                                    setSelectedCart(obj);
                                                  }}
                                                >
                                                  {obj.name}
                                                </span>
                                              </td>
                                              <td
                                                className={`text-center w-16 overflow-hidden`}
                                              >
                                                <div
                                                  className={`grid grid-flow-col items-center group-[${obj.id}]:`}
                                                >
                                                  <button
                                                    onClick={() =>
                                                      addToCart(obj, true)
                                                    }
                                                    className="btn btn-sm btn-ghost opacity-20 group-hover:opacity-100 pr-1 text-zinc-400 active:bg-zinc-100 hover:bg-zinc-100"
                                                  >
                                                    <i className="fas fa-caret-left"></i>
                                                  </button>
                                                  <span>{obj.qty}</span>
                                                  <button
                                                    onClick={() =>
                                                      addToCart(obj)
                                                    }
                                                    className="btn btn-sm btn-ghost opacity-20 group-hover:opacity-100 pl-1 text-zinc-400 active:bg-zinc-100 hover:bg-zinc-100"
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
                                                    {obj.discount <= 0 && (
                                                      <label
                                                        htmlFor="addPromotionModal"
                                                        className="btn btn-ghost opacity-0 group-hover:opacity-100 btn-sm text-blue-500 hover:bg-zinc-100"
                                                        onClick={() =>
                                                          setSelectedCart(obj)
                                                        }
                                                      >
                                                        <i className="fas fa-tag"></i>
                                                      </label>
                                                    )}
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
                                                  className={`w-2/3 overflow-hidden`}
                                                >
                                                  <span className="truncate">
                                                    ⤷ Discount{" "}
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
                                                      onClick={() => {
                                                        removeCartPromotion(
                                                          obj
                                                        );
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

                  <div className="flex justify-between border-t-zinc-300 border-dashed border-t pt-2 w-full text-xl">
                    <p className="font-semibold ml-1">Total</p>
                    <p className="font-semibold ml-1 text-right">
                      {numeral(total).format("0,0")}
                    </p>
                  </div>

                  <div className="flex gap-2 items-end">
                    {/* <button className="btn btn-success bg-success text-white w-1/2">
                      Contact{" "}
                      <i className="fa-brands fa-whatsapp ml-2 font-bold"></i>
                    </button> */}
                    <label
                      htmlFor="checkoutModal"
                      className="btn btn-primary w-full"
                    >
                      Select Payment
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
                      onClick={() => addCartPromotion(obj)}
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

      <ModalBox id="addServicePromotionModal">
        <h3 className="font-bold text-lg mb-4">Add Service Promotion</h3>
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
                      onClick={() =>
                        addServiceCartPromotion(obj, selectedServiceCart)
                      }
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
            htmlFor="addServicePromotionModal"
            ref={servicePromotionRef}
            className="btn btn-ghost rounded-md"
          >
            Cancel
          </label>
          {/* <button className="btn btn-primary rounded-md">Add</button> */}
        </div>
        {/* </form> */}
      </ModalBox>

      <ModalBox id="checkoutModal">
        <h3 className="font-bold text-lg mb-8">Payment Method</h3>
        {/* <form onSubmit={() => {}} autoComplete="off"> */}
        <div className="card">
          <div className="card-body py-2">
            <p className="font-semibold">Cash</p>
            <div
              className={`${transaction.payment_id != null && "opacity-50"}`}
            >
              <input
                type="number"
                name="payment"
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                }}
                onClick={(e) => {
                  setTransaction((prev) => {
                    return {
                      ...prev,
                      payment_id: null,
                      payment: e.target.value,
                    };
                  });
                }}
                className={`input input-bordered  w-full ${
                  transaction.payment >= total
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-rose-400 bg-zinc-50"
                }`}
              />

              <i
                className={`fas fa-check absolute right-10 top-12 rounded-md p-2 ${
                  transaction.payment_id == null ? "block" : "hidden"
                } ${
                  transaction.payment >= total
                    ? "bg-emerald-400"
                    : "bg-zinc-50 text-rose-400"
                }`}
              ></i>
              <div className="flex justify-between text-sm mt-1">
                <p>Total {numeral(total).format()}</p>
                <p
                  className={`text-right ${
                    transaction.payment >= total ? "block" : "hidden"
                  }`}
                >
                  Change {numeral(transaction.payment - total).format()}
                </p>
              </div>
              <div className="grid grid-flow-col gap-2 col-span-3 mt-4">
                <div
                  className={`btn btn-ghost bg-slate-100 text-left rounded-md cursor-pointer`}
                  onClick={() => {
                    setPaymentAmount(total);
                    setTransaction((prev) => {
                      return {
                        ...prev,
                        payment_id: null,
                      };
                    });
                  }}
                >
                  {numeral(total).format()}
                </div>
                {suggest?.map((obj) => {
                  return (
                    <div
                      key={obj}
                      className={`btn btn-ghost bg-slate-100 text-left rounded-md cursor-pointer`}
                      onClick={() => {
                        setPaymentAmount(obj);
                        setTransaction((prev) => {
                          return {
                            ...prev,
                            payment_id: null,
                          };
                        });
                      }}
                    >
                      {numeral(obj).format()}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="divider mb-2"></div>
          </div>
        </div>

        {categoryPayments.map((obj) => {
          return (
            <div className={`card`} key={obj.id}>
              <div className="card-body py-2">
                <p className="font-semibold">{obj.name}</p>
                <div className="grid grid-cols-2 gap-2">
                  {obj.payments.map((obj) => {
                    return (
                      <div
                        key={obj.id}
                        className={`btn text-left  ${
                          transaction.payment_id != obj.id && "opacity-50"
                        } ${
                          obj.id == transaction.payment_id
                            ? "btn-success text-zinc-800"
                            : "btn-ghost bg-slate-100"
                        }  rounded-md cursor-pointer`}
                        onClick={() => {
                          setTransaction((prev) => {
                            return {
                              ...prev,
                              payment_id: obj.id,
                              payment: total,
                            };
                          });
                        }}
                      >
                        <div className="card-body px-4 py-2 flex flex-row justify-between items-center">
                          <p>{obj.name}</p>
                          {transaction.payment_id == obj.id && (
                            <i className="fas fa-check text-lg"></i>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div className="modal-action rounded-sm">
          <label
            htmlFor="checkoutModal"
            className="btn btn-ghost rounded-md"
            ref={transactionRef}
          >
            Cancel
          </label>
          <button
            className="btn btn-warning rounded-md"
            onClick={createTransaction}
          >
            Checkout
          </button>
        </div>
        {/* </form> */}
      </ModalBox>
    </>
  );
}
