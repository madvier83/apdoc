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
import { nanoid } from "nanoid";

import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import axios from "../../api/axios";
import numeral from "numeral";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import CurrencyInput from "react-currency-input-field";

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
  const structRef = useRef();
  const printRef = useRef();

  const [clinic, setClinic] = useState();
  const [search, setSearch] = useState("");
  const [record, setRecord] = useState([]);

  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [suggest, setSuggest] = useState([]);

  const [queues, setQueues] = useState();
  const [queuesLoading, setQueuesLoading] = useState(true);
  const [items, setItems] = useState();
  const [promotions, setPromotions] = useState();
  const [settings, setSettings] = useState();
  const [isPrint, setIsPrint] = useState(false);

  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryPayments, setCategoryPayments] = useState([]);
  const [categoryPaymentsLoading, setCategoryPaymentsLoading] = useState(true);
  const [code, setCode] = useState("");

  const [cart, setCart] = useState({ array: [] });
  const [serviceCart, setServiceCart] = useState({ array: [] });

  const [selectedCart, setSelectedCart] = useState({});
  const [selectedServiceCart, setSelectedServiceCart] = useState({});

  const [time, setTime] = useState("");

  const dummyTransaction = {
    clinic_id: "",
    patient_id: 0,
    payment_id: null,
    payment: null,
    items: [],
    services: [],
  };

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

  const [transaction, setTransaction] = useState(dummyTransaction);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedQueue, setSelectedQueue] = useState(dummyQueue);

  async function getSettings() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(`setting/${clinic}/clinic`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      // console.log(response.data);
      setSettings(response.data);
    } catch (err) {
      console.error(err);
    }
  }

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
      setQueues(response.data);
      setQueuesLoading(false);
      response.data.length <= 0 && setSelectedQueue({ dummyQueue });
      response.data.map((obj) => {
        if (obj?.id == selectedQueue.id) {
          setSelectedQueue(obj);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function getItems() {
    if (!clinic || !search) {
      return;
    }
    try {
      const response = await axios.get(
        `items/${clinic && clinic + "/"}${16}${
          search &&
          `/` +
            search
              .split(" ")
              .join("%")
              .replace(/[a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${1}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      setItems(response.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getRecord() {
    if (!selectedQueue?.patient?.id) {
      return;
    }
    try {
      const response = await axios.get(
        `/record/${selectedQueue?.patient?.id}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      console.log(response);
      setRecord(response.data[0]?.record_items || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function getPromotions() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `promotions/${clinic && clinic + "/"}${9999999}?page=${1}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      // console.log(response.data);
      setPromotions(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getCategory() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `category-items/${
          clinic && clinic + "/"
        }${9999999}?page=${1}&sortBy=${"name"}&order=${"asc"}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
      setCategory(response.data);
      setCategoryLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getCategoryPayments() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `category-payments/${clinic && clinic + "/"}${9999999}?page=${1}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
          },
        }
      );
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
      id: obj?.id,
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
      if (item.id == obj?.id) {
        let oldItem;
        if (remove == true) {
          oldItem = {
            ...item,
            qty: Number(item.qty) - 1,
            total: item.sell_price * (Number(item.qty) - 1),
            discount:
              (item.sell_price * (Number(item.qty) - 1) * item.promotion) / 100,
          };
        } else {
          oldItem = {
            ...item,
            qty: Number(item.qty) + 1,
            total: item.sell_price * (Number(item.qty) + 1),
            discount:
              (item.sell_price * (Number(item.qty) + 1) * item.promotion) / 100,
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
      promotion_id: obj?.id,

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
      promotion_id: null,
      promotion: 0,
      promotion_name: 0,
      discount: 0,
    };
    prevCart.map((item) => {
      if (item.id == obj?.id) {
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
          promotion_id: null,

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
      if (obj?.id == item.id) {
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
      promotion_id: null,
      promotion: 0,
      promotion_name: 0,
      discount: 0,
    };
    prevCart.map((item) => {
      if (item.id == obj?.id) {
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

  function countSubtotal() {
    let currentSubtotal = 0;
    serviceCart.array?.map(
      (obj) => (currentSubtotal = currentSubtotal + obj.price)
    );
    cart.array?.map((obj) => (currentSubtotal = currentSubtotal + obj.total));
    setSubtotal(currentSubtotal);
  }

  function countTotalDiscount() {
    let currentTotalDiscount = 0;
    serviceCart.array?.map(
      (obj) => (currentTotalDiscount = currentTotalDiscount + obj.discount)
    );
    cart.array?.map(
      (obj) => (currentTotalDiscount = currentTotalDiscount + obj.discount)
    );
    setTotalDiscount(currentTotalDiscount);
  }

  function suggestCash() {
    const newSuggest = [];

    let cash = total;
    const fraction = [50000, 100000];
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
    if (
      newSuggest.length < 3 &&
      cash % 10000 != 0 &&
      (cash - (cash % 10000) + 10000) % 50000 != 0
    ) {
      newSuggest.unshift(cash - (cash % 10000) + 10000);
    }
    setSuggest(newSuggest);
    // console.log(newSuggest);
  }

  const print = useReactToPrint({
    content: () => structRef.current,
  });

  const [transactionSuccess, setTransactionSuccess] = useState(false);
  async function createTransaction() {
    // console.log(transaction);
    try {
      const response = await axios.post(`transaction`, transaction, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      // reset
      setCode(response.data?.code);
      setTransactionSuccess(true);
      transactionRef.current.click();
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    if (transactionSuccess) {
      setIsPrint(true);
      printRef.current.click();
      setIsPrint(false);

      setSelectedQueue(dummyQueue);
      getQueues();
      setPaymentAmount(0);
      setTransaction(dummyTransaction);

      setTransactionSuccess(false);
    }
  }, [transactionSuccess]);

  // get required data
  useEffect(() => {
    getSettings();
    getQueues();
    getPromotions();
    getItems();
    getCategory();
    getCategoryPayments();

    setTransaction({ clinic_id: clinic });
  }, [clinic]);
  // change queue target
  useEffect(() => {
    clearCart();
    addServiceCart();
  }, [selectedQueue]);
  // count totals
  useEffect(() => {
    countTotal();
    countSubtotal();
    countTotalDiscount();
  }, [selectedQueue, cart.array, serviceCart.array]);
  // preset transaction
  useEffect(() => {
    setTransaction((prev) => {
      return {
        ...prev,
        patient_id: selectedQueue?.patient_id,
        payment: paymentAmount,
        items: cart.array,
        services: serviceCart.array,
        clinic_id: clinic,
      };
    });
  }, [selectedQueue, cart.array, serviceCart.array, paymentAmount]);
  //
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
  //
  useEffect(() => {
    setTime(moment().format("h:mm:ss A"));
  }, [transaction]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getItems();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setRecord([]);
    getRecord();
    setSearch("");
  }, [selectedQueue]);

  // useEffect(() => {
  //   if (record.length > 0) {
  //     record.map((item) => {
  //       addToCart(item.item);
  //     });
  //   }
  // }, [record]);

  console.log(category.data);

  return (
    <>
      <DashboardLayout
        title="Transaction"
        clinic={clinic}
        setClinic={setClinic}
      >
        <div className="mt-6">
          <div
            className={`relative max-w-7xl min-w-0 md:min-w-[720px] rounded-md`}
          >
            <div
              ref={listRef}
              className="flex flex-col-reverse md:flex-row gap-4"
              style={{ display: "block" }}
            >
              <div className="h-[87.6vh] min-h-fit md:w-1/2 bg-gray-900 px-6 pt-6 rounded-md">
                <div
                  ref={servicesRef}
                  {...servicesEvents}
                  className="h-full rounded-md overflow-y-scroll overflow-x-hidden"
                >
                  <div className={`overflow-hidden rounded-md shadow-md mb-0`}>
                    <div className="px-0 flex flex-col">
                      <div className="">
                        <label className="label px-0 pt-0">
                          <span className="label-text text-white pl-1">
                            Patients
                          </span>
                          <span className="label-text ml-auto flex items-center text-white">
                            {queues?.length > 0 ? (
                              <div className="opacity-80">
                                <div className="badge badge-error font-semibold animate-pulse">
                                  {queues?.length} in queue
                                </div>
                              </div>
                            ) : (
                              <div className="opacity-20 mr-1">Empty</div>
                            )}
                            <i
                              className={`fas fa-refresh mx-1 ${
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
                                (obj) => e.target.value == obj?.id
                              )[0]
                            );
                          }}
                          className={`input border-none py-4 rounded-sm mt-1 h-full text-white ${
                            selectedQueue?.id
                              ? "bg-indigo-800 bg-opacity-90"
                              : "bg-slate-800"
                          } w-full`}
                        >
                          <option value={dummyQueue.id}>Select patient</option>
                          {queues?.map((obj) => {
                            return (
                              <option key={obj?.id} value={obj?.id}>
                                {obj.queue_number} - {obj.patient.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      !selectedQueue?.id && "opacity-30"
                    } bg-opacity-50 rounded-md shadow-md mb-0 mt-2`}
                  >
                    <div className="">
                      <label className="label px-0">
                        <span className="label-text text-white pl-1 mt-3">
                          Promotions
                        </span>
                        <span className="label-text opacity-50 ml-auto text-white">
                          {/* {items?.length} Items */}
                        </span>
                      </label>
                    </div>
                    <div className="px-0 flex flex-col">
                      <div className="bg-slate-800 rounded-md">
                        <div
                          tabIndex={0}
                          className="collapse p-0 m-0 rounded-md bg-slate-800 text-white focus:bg-rose-500 focus:bg-opacity-10 border-rose-400 group"
                        >
                          <div className="collapse-title font-semibold capitalize text-sm group-focus:text-rose-400 text-zinc-300 flex items-center gap-4">
                            <i className="fas fa-caret-down group-focus:-rotate-180 duration-500"></i>
                            <p>Promotions</p>
                          </div>
                          <div className="collapse-content font-normal capitalize">
                            {promotions?.data?.map((obj) => {
                              return (
                                <div
                                  className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                                  key={obj?.id}
                                  onClick={() => setAllCartPromotion(obj)}
                                >
                                  <span>{obj.name}</span>
                                  <span>{obj.discount}%</span>
                                </div>
                              );
                            })}
                            {promotions?.data?.length <= 0 && (
                              <div className="btn btn-disabled bg-rose-100 bg-opacity-5 text-zinc-400 normal-case flex justify-between cursor-pointer transition-none">
                                No Promotion
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <label className="label px-0">
                          <span className="label-text text-white pl-1 mt-4">
                            Items
                          </span>
                          <span className="label-text opacity-50 ml-auto text-white">
                            {/* {items?.length} Items */}
                          </span>
                        </label>
                      </div>
                      <div className="bg-slate-800 rounded-md mb-4">
                        <div className="text-white bg-amber-500 bg-opacity-10 border-amber-400 rounded-md">
                          <div className="relative">
                            <input
                              type="text"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder="Search item ..."
                              className={`input py-4 h-full text-white ${
                                search
                                  ? "border-none border-opacity-75 bg-amber-500 bg-opacity-10 text-amber-400 font-semibold"
                                  : "border-slate-800 bg-slate-800"
                              }
                            w-full`}
                            ></input>
                            <i
                              onClick={() => setSearch("")}
                              className={`fas ${
                                search ? "fa-x text-rose-400" : "fa-search"
                              } absolute top-1 right-1 p-4`}
                            ></i>
                          </div>
                          {search &&
                            items?.length > 0 &&
                            items?.map((item) => {
                              return item.item_variants.map((variant) => {
                                return (
                                  <div
                                    className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                                    key={variant.id}
                                    onClick={() => addToCart({...item,name: `${item.name + " - " + variant.variant + " " + variant.unit}`, sell_price: variant.sell_price, id: variant.id})}
                                  >
                                    <div className="">
                                      <span>{item.name} - </span>
                                      <span>{variant.variant} </span>
                                      <span>{variant.unit}</span>
                                    </div>
                                    <span>
                                      {numeral(variant.sell_price).format(
                                        "0,0"
                                      )}
                                    </span>
                                  </div>
                                );
                              });
                            })}
                          {search && items?.length <= 0 && (
                            <div className="btn btn-disabled text-zinc-500 normal-case flex justify-between cursor-pointer transition-none">
                              No Item Found
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`${
                          record.length <= 0 && "hidden"
                        } bg-slate-800 rounded-md mb-4`}
                      >
                        <div
                          tabIndex={0}
                          className="collapse collapse-open p-0 m-0 rounded-md  text-white bg-amber-500 bg-opacity-10 border-amber-400 group"
                        >
                          <div className="collapse-title font-semibold capitalize text-sm text-amber-400  flex items-center gap-4">
                            <i className="fas fa-caret-down group-focus:-rotate-180 duration-500"></i>
                            <p>Recomendation</p>
                          </div>
                          <div className="collapse-content font-normal capitalize">
                            {record?.map((obj) => {
                              console.log(obj);
                              return (
                                <div
                                  className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                                  key={obj.item?.id}
                                  onClick={() => addToCart(obj.item)}
                                >
                                  <span>{obj.item?.name}</span>
                                  <span>
                                    {numeral(obj.item?.sell_price).format(
                                      "0,0"
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                            {record?.length <= 0 && (
                              <div className="btn btn-disabled bg-amber-100 bg-opacity-5 text-zinc-400 normal-case flex justify-between cursor-pointer transition-none">
                                No recomendation
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-800 rounded-md min-h-[32vh]">
                        {category.length <= 0 && (
                          <div className="btn btn-disabled mx-4 mt-4 bg-amber-100 bg-opacity-5 text-zinc-400 normal-case flex justify-between cursor-pointer transition-none">
                            No Item
                          </div>
                        )}
                        {category?.data?.map((obj, index) => {
                          return (
                            <div
                              key={obj?.id}
                              tabIndex={index}
                              className="collapse p-0 m-0 rounded-md bg-slate-800 text-white focus:bg-amber-500 focus:bg-opacity-10 border-amber-400 group"
                            >
                              <div className="collapse-title font-semibold capitalize text-sm group-focus:text-amber-400 text-zinc-300 flex items-center gap-4">
                                <i className="fas fa-caret-down group-focus:rotate-180 duration-500"></i>
                                <span>{obj.name}</span>
                              </div>
                              <div className="collapse-content font-normal capitalize">
                                {obj.items?.map((item) => {
                                  return item.item_variants.map((variant) => {
                                    return (
                                      <div
                                        className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                                        key={variant.id}
                                        onClick={() => addToCart({...item,name: `${item.name + " - " + variant.variant + " " + variant.unit}`, sell_price: variant.sell_price, id: variant.id})}
                                      >
                                        <div className="">
                                          <span>{item.name} - </span>
                                          <span>{variant.variant} </span>
                                          <span>{variant.unit}</span>
                                        </div>
                                        <span>
                                          {numeral(variant.sell_price).format(
                                            "0,0"
                                          )}
                                        </span>
                                      </div>
                                    );
                                  });
                                })}
                                {obj.items?.length <= 0 && (
                                  <div className="btn btn-disabled text-zinc-500 normal-case flex justify-between cursor-pointer transition-none">
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
                    <div className="flex items-center">
                      {/* <div className="avatar mr-6">
                        <div className="w-16 mask mask-hexagon shadow-md bg-primary flex items-center justify-center">
                          <h1 className="text-xl font-semibold text-white mb-1">
                            {selectedQueue?.queue_number}
                          </h1>
                        </div>

                        {selectedQueue?.patient?.gender == "male" ? (
                          <i className="fas fa-mars z-10 absolute -right-2 text-sm group-focus:text-primary w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm font-bold text-blue-400 p-1 rounded-full"></i>
                        ) : (
                          <i className="fas fa-venus z-10 absolute -right-2 text-sm group-focus:text-primary w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm text-rose-400 p-1 rounded-full"></i>
                        )}
                      </div> */}
                      <div className="w-full">
                        <h2 className="card-title text-base lg:text-2xl text-zinc-900 truncate">
                          {selectedQueue?.patient?.name}
                        </h2>
                        <small className="text-zinc-400">
                          NIK: {selectedQueue?.patient?.nik} | Gender:{" "}
                          {selectedQueue?.patient?.gender}
                          {/* {selectedQueue?.status_id == 1 && "Active"}
                          {selectedQueue?.status_id == 2 && "Done"}
                          {selectedQueue?.status_id == 3 && "Canceled"} */}
                        </small>
                        <div className="border-t border-dashed mt-4"></div>
                      </div>
                    </div>
                    <div className="px-0" ref={infoRef}>
                      <div className="relative">
                        <div className="w-full">
                          <div
                            ref={queuesRef}
                            {...queuesEvents}
                            className="overflow-y-scroll h-[48vh]"
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
                                          <React.Fragment key={obj?.id}>
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
                                          <React.Fragment key={obj?.id}>
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
                                                <span className="ml-2 opacity-50">
                                                  #{" "}
                                                  {numeral(
                                                    obj.sell_price
                                                  ).format("0,0")}
                                                </span>
                                              </td>
                                              <td
                                                className={`text-center w-16 overflow-hidden`}
                                              >
                                                <div
                                                  className={`grid grid-flow-col items-center group-[${obj?.id}]:`}
                                                >
                                                  <button
                                                    onClick={() =>
                                                      addToCart(obj, true)
                                                    }
                                                    className="btn btn-sm btn-ghost opacity-20 group-hover:opacity-100 pr-1 text-zinc-400 active:bg-zinc-100 hover:bg-zinc-100"
                                                  >
                                                    <i className="fas fa-caret-left"></i>
                                                  </button>
                                                  <input
                                                    type="number"
                                                    className="input input-xs w-12 text-center text-xs px-0 font-bold border-none bg-gray-50"
                                                    onChange={(e) => {
                                                      let newCart = [];
                                                      if (
                                                        e.target.value != null
                                                      ) {
                                                        cart?.array?.map(
                                                          (item) => {
                                                            if (
                                                              item.id == obj.id
                                                            ) {
                                                              newCart.push({
                                                                ...obj,
                                                                qty: e.target
                                                                  .value,
                                                                total:
                                                                  obj.sell_price *
                                                                  Number(
                                                                    e.target
                                                                      .value
                                                                  ),
                                                                discount:
                                                                  (obj.sell_price *
                                                                    Number(
                                                                      e.target
                                                                        .value
                                                                    ) *
                                                                    obj.promotion) /
                                                                  100,
                                                              });
                                                            } else {
                                                              newCart.push(
                                                                item
                                                              );
                                                            }
                                                          }
                                                        );
                                                        console.log(newCart);
                                                        setCart({
                                                          array: newCart,
                                                        });
                                                      }
                                                    }}
                                                    value={obj.qty}
                                                  ></input>
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

                  <div className="flex justify-between w-full text-sm border-dashed border-t pt-2">
                    <p className="font-semibold ml-1">Subtotal</p>
                    <p className="font-semibold ml-1 text-right">
                      {numeral(subtotal).format("0,0")}
                    </p>
                  </div>
                  <div className="flex justify-between w-full text-sm">
                    <p className="font-semibold ml-1">Total Discount</p>
                    <p className="font-semibold ml-1 text-right">
                      {numeral(totalDiscount).format("0,0")}
                    </p>
                  </div>
                  <div className="flex justify-between border-t-zinc-300 border-dashed border-t pt-2 w-full text-xl mb-4">
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
                  <div className="alert py-4 btn-primary rounded-md">
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
                      <span>Select patient</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedQueue && (
          <div className={`${isPrint ? "block" : "hidden"} my-8`}>
            <div className="ml-auto">
              <div
                ref={structRef}
                className="px-6 h-full max-w-sm bg-[#fff] w-full font-mono overflow-hidden"
              >
                <div className="flex justify-center items-center flex-col">
                  {settings?.logo ? (
                    <img
                      src={process.env.NEXT_PUBLIC_SERVER_URL + settings?.logo}
                      className="max-h-28 max-w-sm grayscale mb-1"
                    />
                  ) : (
                    <img
                      src={"/apdocLogo.png"}
                      className="max-h-28 max-w-sm grayscale mb-1"
                    />
                  )}
                  {settings?.name && (
                    <React.Fragment>
                      <div className="font-bold text-xl">{settings.name}</div>
                      <div className="text-xs text-center mt-2">
                        {settings.address}, {settings.city}, {settings.country},{" "}
                        {settings.postal_code}
                      </div>
                      <div className="text-xs mt-1">
                        <i className="fa-brands fa-whatsapp mr-1"></i>
                        {settings.phone}
                      </div>
                    </React.Fragment>
                  )}
                  <div className="border-t w-full border-dashed my-3 border-t-slate-800"></div>
                  <div className="flex w-full justify-between items-center">
                    <small>{moment().format("MMMM Do YYYY")}</small>
                    <small>{time}</small>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <small>Receipt Number</small>
                    <small>{code}</small>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <small>Customer</small>
                    <small>{selectedQueue.patient?.name}</small>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <small>Served by</small>
                    <small>John Doe</small>
                  </div>
                  <div className="border-t w-full border-dashed my-3 border-t-slate-800"></div>
                  {serviceCart?.array?.map((obj) => {
                    return (
                      <React.Fragment key={obj.id}>
                        <div className="flex w-full justify-between items-center font-semibold">
                          <small>{obj.name}</small>
                          <small>{numeral(obj.price).format("0,0")}</small>
                        </div>
                        {obj.discount > 0 && (
                          <div className="flex w-full justify-between items-center">
                            <small>
                              ⤷ Disc {obj.promotion_name} ({obj.promotion}%)
                            </small>
                            <small>
                              ({numeral(obj.discount).format("0,0")})
                            </small>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {cart.array?.length > 0 && serviceCart.array?.length > 0 && (
                    <br />
                  )}
                  {cart?.array?.map((obj) => {
                    return (
                      <React.Fragment key={obj.id}>
                        <div className="flex w-full justify-between items-center font-semibold">
                          <small>
                            {obj.name}{" "}
                            <span className="text-gray-800 font-normal">
                              #{obj.sell_price} x{obj.qty}
                            </span>
                          </small>
                          <small>{numeral(obj.total).format("0,0")}</small>
                        </div>
                        {obj.discount > 0 && (
                          <div className="flex w-full justify-between items-center">
                            <small>
                              ⤷ Disc {obj.promotion_name} ({obj.promotion}%)
                            </small>
                            <small>
                              ({numeral(obj.discount).format("0,0")})
                            </small>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <div className="border-t w-full border-dashed my-3 border-t-slate-500"></div>
                  <div className="flex w-full justify-between items-center">
                    <small>Subtotal</small>
                    <small>{numeral(subtotal).format("0,0")}</small>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <small>Total discount</small>
                    <small>({numeral(totalDiscount).format("0,0")})</small>
                  </div>
                  <div className="border-t w-full border-dashed my-3 border-t-slate-500"></div>
                  <div className="flex w-full justify-between items-center font-bold text-lg">
                    <small>Total</small>
                    <small>{numeral(total).format("0,0")}</small>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <small>{"Payment"}</small>
                    <small>{numeral(transaction.payment).format("0,0")}</small>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <small>Change</small>
                    <small>
                      {numeral(transaction.payment - total).format("0,0")}
                    </small>
                  </div>
                  <div className="border-t w-full border-dashed my-3 border-t-slate-500"></div>
                  <h1 className="font-bold">Terima Kasih</h1>
                  <div className="border-t w-full border-dashed mt-3 border-t-slate-500"></div>
                </div>
              </div>
              <button
                onClick={print}
                className="btn bg-rose-600 w-full max-w-sm"
                ref={printRef}
              >
                Test print <i className="fas fa-print ml-2"></i>
              </button>
            </div>
          </div>
        )}
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
                {promotions?.data?.map((obj) => {
                  return (
                    <div
                      className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                      key={obj?.id}
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
                {promotions?.data?.map((obj) => {
                  return (
                    <div
                      className="btn btn-ghost normal-case flex justify-between cursor-pointer"
                      key={obj?.id}
                      onClick={() =>
                        addServiceCartPromotion(obj, selectedServiceCart)
                      }
                    >
                      <span>{obj.name}</span>
                      <span>{obj.discount}%</span>
                    </div>
                  );
                })}
                {promotions?.data?.length <= 0 && (
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
        <h3 className="font-bold text-lg mb-8">Select Payment Method</h3>
        {/* <form onSubmit={() => {}} autoComplete="off"> */}
        <div className="card">
          <div className="card-body py-2">
            <p className="font-semibold">Cash</p>
            <div
              className={`${transaction.payment_id != null && "opacity-50"}`}
            >
              {/* <input
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
                className={`input input-bordered w-full  ${
                  transaction.payment_id != null && "border-zinc-400"
                } ${
                  transaction.payment >= total && transaction.payment_id == null
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-rose-400 bg-zinc-50"
                }`}
              /> */}

              <CurrencyInput
                name="price"
                defaultValue={0}
                value={paymentAmount}
                decimalsLimit={2}
                onValueChange={(value) => {
                  setPaymentAmount(value);
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
                className={`input input-bordered w-full  ${
                  transaction.payment_id != null && "border-zinc-400"
                } ${
                  transaction.payment >= total && transaction.payment_id == null
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
              <div className="flex justify-between text-sm mt-1 mb-2">
                <p>Total {numeral(total).format()}</p>
                <p
                  className={`text-right ${
                    transaction.payment >= total ? "block" : "hidden"
                  }`}
                >
                  Change {numeral(transaction.payment - total).format()}
                </p>
              </div>
              <small className="text-zinc-400">Suggestion</small>
              <div className="grid grid-flow-col gap-2 col-span-3 mt-1 mb-2">
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
            <div className="border-t border-dashed my-2"></div>
          </div>
        </div>

        {categoryPayments?.data?.map((obj) => {
          return (
            <div className={`card`} key={obj?.id}>
              <div className="card-body py-2">
                <p className="font-semibold">{obj.name}</p>
                <div className="grid grid-cols-2 gap-2">
                  {obj.payments.map((obj) => {
                    return (
                      <div
                        key={obj?.id}
                        className={`btn text-left  ${
                          transaction.payment_id != obj?.id && "opacity-50"
                        } ${
                          obj?.id == transaction.payment_id
                            ? "btn-success text-zinc-800"
                            : "btn-ghost bg-slate-100"
                        }  rounded-md cursor-pointer`}
                        onClick={() => {
                          setTransaction((prev) => {
                            return {
                              ...prev,
                              payment_id: obj?.id,
                              payment: total,
                            };
                          });
                          // setPaymentAmount(total)
                        }}
                      >
                        <div className="card-body px-4 py-2 flex flex-row justify-between items-center">
                          <p>{obj.name}</p>
                          {transaction.payment_id == obj?.id && (
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
            className={`btn ${
              transaction.payment >= total ? "btn-primary" : "btn-disabled"
            } rounded-md`}
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
