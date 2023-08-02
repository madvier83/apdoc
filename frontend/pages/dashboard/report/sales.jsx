import React, { useEffect, useState, useRef, useReducer } from "react";
import { deleteCookie, getCookie, getCookies, setCookie } from "cookies-next";
import moment from "moment/moment";
import numeral from "numeral";
import axios from "../../api/axios";

import { Chart } from "react-google-charts";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import ModalDelete from "../../../components/Modals/ModalDelete";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { GetCookieChunk } from "../../../services/CookieChunk";

export default function Sales() {
  const token = GetCookieChunk("token_");

  const [clinic, setClinic] = useState();

  const [chartData, setChartData] = useState([
    ["Date", "Gross Sales", "Net Sales"],
    ["", 0, 0],
  ]);
  const [menu, setMenu] = useState(0);
  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [payment, setPayment] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [service, setService] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [promotion, setPromotion] = useState([]);
  const [promotionLoading, setPromotionLoading] = useState(true);
  const [collected, setCollected] = useState([]);
  const [collectedLoading, setCollectedLoading] = useState(true);

  // Datepicker
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [cookieCheck, setCookieCheck] = useState(false);
  useEffect(() => {
    try {
      let range = JSON.parse(getCookie("rangeDate"));
      // console.log(range);
      setSelectionRange({
        ...range,
        startDate: new Date(range.startDate),
        endDate: new Date(range.endDate),
      });
      setCookie(
        "rangeDate",
        JSON.stringify({
          ...range,
          startDate: new Date(range.startDate),
          endDate: new Date(range.endDate),
        })
      );
      setCookieCheck(true);
    } catch (e) {
      deleteCookie("rangeDate");
      setCookie("rangeDate", JSON.stringify(selectionRange));
      setCookieCheck(true);
    }
  }, []);
  useEffect(() => {
    if (cookieCheck) {
      setCookie(false);
      setCookie("rangeDate", JSON.stringify(selectionRange));
      setCookieCheck(true);
    }
  }, [selectionRange]);

  function handleSelect(ranges) {
    setSelectionRange(ranges.selection);
  }

  async function getSummary() {
    if (!clinic) {
      return;
    }
    try {
      let response = await axios.get(
        `/report-sales/summary/${clinic && clinic + "/"}${moment(
          selectionRange.startDate
        ).format("YYYY-MM-DD")}/${moment(selectionRange.endDate).format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response)
      let newChart = [["Patient", "Gross Sales", "Net Sales"]];
      response.data.Chart.map((obj) => newChart.push(obj));
      setChartData(newChart);
      setSummary(response.data);
      setSummaryLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getPayment() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `/report-sales/payment/${clinic && clinic + "/"}${moment(
          selectionRange.startDate
        ).format("YYYY-MM-DD")}/${moment(selectionRange.endDate).format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setPayment(response.data);
      setPaymentLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function getService() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `/report-sales/service/${clinic && clinic + "/"}${moment(
          selectionRange.startDate
        ).format("YYYY-MM-DD")}/${moment(selectionRange.endDate).format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setService(response.data);
      setServiceLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function getItem() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `/report-sales/item/${clinic && clinic + "/"}${moment(
          selectionRange.startDate
        ).format("YYYY-MM-DD")}/${moment(selectionRange.endDate).format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setItem(response.data);
      setItemLoading(false);
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
        `/report-sales/category/${clinic && clinic + "/"}${moment(
          selectionRange.startDate
        ).format("YYYY-MM-DD")}/${moment(selectionRange.endDate).format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setCategory(response.data);
      setCategoryLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function getPromotion() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `/report-sales/promotion/${clinic && clinic + "/"}${moment(
          selectionRange.startDate
        ).format("YYYY-MM-DD")}/${moment(selectionRange.endDate).format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setPromotion(response.data);
      setPromotionLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function getCollected() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(
        `/report-sales/collected/${clinic && clinic + "/"}${moment(
          selectionRange.startDate
        ).format("YYYY-MM-DD")}/${moment(selectionRange.endDate).format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setCollected(response.data);
      setCollectedLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (cookieCheck) {
      getSummary();
      getPayment();
      getService();
      getItem();
      // getCategory();
      getPromotion();
      getCollected();
    }
  }, [selectionRange, clinic]);

  return (
    <>
      <DashboardLayout title="Penjualan" clinic={clinic} setClinic={setClinic}>
        <div className="flex gap-4 mt-6">
          <div className="bg-white min-h-[42vh] rounded-md w-full mb-">
            <div className="ml-8 items-center justify-between gap-2">
              <h3 className={"font-bold text-xl pt-6"}>Laporan penjualan</h3>
              <div className="flex">
                <div className="dropdown">
                  <label tabIndex={0}>
                    <div className="mb-4 rounded-md text-sm mt-2 text-gray-400">
                      Menampilkan data dari{" "}
                      <span className=" text-violet-500 opacity-95 font-semibold">
                        {moment(selectionRange.startDate).format(
                          "DD MMMM YYYY"
                        )}
                      </span>{" "}
                      sampai{" "}
                      <span className=" text-violet-500 opacity-95 font-semibold">
                        {moment(selectionRange.endDate).format("DD MMMM YYYY")}
                        <i className="fa-solid fa-calendar-week ml-2"></i>
                      </span>
                    </div>
                  </label>
                  <div
                    tabIndex={0}
                    className="dropdown-content shadow-md top-10 text-zinc-700"
                  >
                    <DateRangePicker
                      className="rounded-md overflow-hidden p-0 m-0"
                      ranges={[selectionRange]}
                      onChange={handleSelect}
                      direction="vertical"
                      rangeColors={["#9333ea"]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mr-8 mt-4 ml-8">
              <select
                onChange={(e) => setMenu(e.target.value)}
                className="p-0 pl-4 focus:ring-0 focus:ring-offset-0 ring-transparent select-bordered border-slate-500 rounded-md font-semibold select-sm w-48"
              >
                <option value={0}>Metode Pembayaran</option>
                <option value={1}>Layanan</option>
                <option value={2}>Penjualan Item</option>
                {/* <option value={3}>Category Sales</option> */}
                <option value={4}>Promosi</option>
                <option value={5}>Dikumpulkan Oleh</option>
              </select>
            </div>

            <div className="rounded-md px-8 overflow-hidden pb-8">
              {menu == 0 && (
                <table className="items-center w-full bg-transparent border-collapse overflow-auto mt-4 px-4">
                  <thead>
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Nama
                      </th>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Kategori
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-100 text-blueGray-600">
                        Transaksi
                      </th>
                      <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentLoading && (
                      <tr>
                        <td colSpan={99}>
                          <div className="flex w-full justify-center my-4">
                            <img src="/loading.svg" alt="now loading" />
                          </div>
                        </td>
                      </tr>
                    )}
                    {payment.data?.map((obj, index) => {
                      return (
                        <tr key={index} className="hover:bg-zinc-50">
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>{obj.name}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>
                              {obj.category}
                            </span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-center">
                            <span className={"ml-3 font-bold"}>{obj.qty}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.total).format("0,0")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600"></th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600 text-center">
                        {payment.qty}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(payment.total).format("0,0")}
                      </th>
                    </tr>
                  </tbody>
                </table>
              )}
              {menu == 1 && (
                <table className="items-center w-full bg-transparent border-collapse overflow-auto mt-4 px-4">
                  <thead>
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Nama
                      </th>
                      <th className="pl-4 align-left py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Transaksi
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 pl-4 bg-blueGray-100 text-blueGray-600">
                        Laba kotor
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 pl-4 bg-blueGray-100 text-blueGray-600">
                        Diskon
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 pl-4 bg-blueGray-100 text-blueGray-600">
                        Laba bersih
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceLoading && (
                      <tr>
                        <td colSpan={99}>
                          <div className="flex w-full justify-center my-4">
                            <img src="/loading.svg" alt="now loading" />
                          </div>
                        </td>
                      </tr>
                    )}
                    {service.data?.map((obj, index) => {
                      return (
                        <tr key={index} className="hover:bg-zinc-50">
                          <td className="border-t-0 pl-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
                            <span className={"ml-3 font-bold"}>{obj.name}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>{obj.qty}</span>
                          </td>
                          <td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right pr-8">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.grossSales).format("0,0")}
                            </span>
                          </td>
                          <td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right pr-8">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.discount).format("0,0")}
                            </span>
                          </td>
                          <td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right pr-8">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.netSales).format("0,0")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                      <th className="align-middle py-3 pl-5 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600 text-left">
                        {service.qty}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-8 pl-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(service.GrossSales).format("0,0")}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-8 pl-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(service.Discount).format("0,0")}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-8 pl-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(service.NetSales).format("0,0")}
                      </th>
                    </tr>
                  </tbody>
                </table>
              )}
              {menu == 2 && (
                <table className="items-center w-full bg-transparent border-collapse overflow-auto mt-4 px-4">
                  <thead>
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Nama
                      </th>
                      <th className="pl-4 align-left py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Kategori
                      </th>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Item terjual
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Laba kotor
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Diskon
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Laba bersih
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemLoading && (
                      <tr>
                        <td colSpan={99}>
                          <div className="flex w-full justify-center my-4">
                            <img src="/loading.svg" alt="now loading" />
                          </div>
                        </td>
                      </tr>
                    )}
                    {item.data?.map((obj, index) => {
                      return (
                        <tr key={index} className="hover:bg-zinc-50">
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>{obj.name}</span>
                          </td>
                          <td className="border-t-0 pr-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>
                              {obj.category}
                            </span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-center">
                            <span className={"ml-3 font-bold"}>{obj.qty}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.grossSales).format("0,0")}
                            </span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.netSales).format("0,0")}
                            </span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.discount).format("0,0")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600 text-center"></th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600 text-center">
                        {item.qty}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(item.GrossSales).format("0,0")}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(item.Discount).format("0,0")}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(item.NetSales).format("0,0")}
                      </th>
                    </tr>
                  </tbody>
                </table>
              )}
              {menu == 3 && (
                <table className="items-center w-full bg-transparent border-collapse overflow-auto mt-4 px-4">
                  <thead>
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Name
                      </th>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Item terjual
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Laba kotor
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Diskon
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Laba bersih
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryLoading && (
                      <tr>
                        <td colSpan={99}>
                          <div className="flex w-full justify-center my-4">
                            <img src="/loading.svg" alt="now loading" />
                          </div>
                        </td>
                      </tr>
                    )}
                    {category.data?.map((obj, index) => {
                      return (
                        <tr key={index} className="hover:bg-zinc-50">
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>{obj.name}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-center">
                            <span className={"ml-3 font-bold"}>{obj.qty}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.grossSales).format("0,0")}
                            </span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.discount).format("0,0")}
                            </span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.netSales).format("0,0")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600 text-center">
                        {category.qty}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(category.GrossSales).format("0,0")}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(category.Discount).format("0,0")}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(category.NetSales).format("0,0")}
                      </th>
                    </tr>
                  </tbody>
                </table>
              )}
              {menu == 4 && (
                <table className="items-center w-full bg-transparent border-collapse overflow-auto mt-4 px-4">
                  <thead>
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Name
                      </th>
                      <th className="pl-4 align-left py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Diskon
                      </th>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Qty
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotionLoading && (
                      <tr>
                        <td colSpan={99}>
                          <div className="flex w-full justify-center my-4">
                            <img src="/loading.svg" alt="now loading" />
                          </div>
                        </td>
                      </tr>
                    )}
                    {promotion.data?.map((obj, index) => {
                      return (
                        <tr key={index} className="hover:bg-zinc-50">
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>{obj.name}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>
                              {obj.discount}%
                            </span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>{obj.qty}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.total).format("0,0")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600 text-center"></th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600 text-left pl-5">
                        {promotion.qty}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(promotion.total).format("0,0")}
                      </th>
                    </tr>
                  </tbody>
                </table>
              )}
              {menu == 5 && (
                <table className="items-center w-full bg-transparent border-collapse overflow-auto mt-4 px-4">
                  <thead>
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Name
                      </th>
                      <th className="pl-4 align-left py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Transaksi
                      </th>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectedLoading && (
                      <tr>
                        <td colSpan={99}>
                          <div className="flex w-full justify-center my-4">
                            <img src="/loading.svg" alt="now loading" />
                          </div>
                        </td>
                      </tr>
                    )}
                    {collected.data?.map((obj, index) => {
                      return (
                        <tr key={index} className="hover:bg-zinc-50">
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>{obj.name}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                            <span className={"ml-3 font-bold"}>{obj.qty}</span>
                          </td>
                          <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-right">
                            <span className={"ml-3 font-bold"}>
                              {numeral(obj.total).format("0,0")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th className="pl-4 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        Total
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600 text-left pl-5">
                        {collected.qty}
                      </th>
                      <th className="align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right pr-6 bg-blueGray-100 text-blueGray-600">
                        {numeral(collected.total).format("0,0")}
                      </th>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pb-32">
          <div
            className={
              "relative flex flex-col min-w-0 break-words overflow-visible w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
            }
          >
            <div className="rounded-t mb-0 px-4 pt-4 border-0 overflow-visible">
              <div className="flex flex-wrap items-center overflow-visible">
                <div className="relative w-full px-4 overflow-visible">
                  <h3 className={"font-bold text-xl mt-4"}>
                    {/* <i className="fas fa-filter mr-3"></i>  */}
                    Ringkasan
                  </h3>
                  <div className="flex">
                    <div className="dropdown">
                      <label tabIndex={0}>
                        <div className="mb-4 rounded-md text-sm mt-2 text-gray-400">
                          Menampilkan data dari{" "}
                          <span className=" text-violet-500 opacity-95 font-semibold">
                            {moment(selectionRange.startDate).format(
                              "DD MMMM YYYY"
                            )}
                          </span>{" "}
                          sampai{" "}
                          <span className=" text-violet-500 opacity-95 font-semibold">
                            {moment(selectionRange.endDate).format(
                              "DD MMMM YYYY"
                            )}
                            <i className="fa-solid fa-calendar-week ml-2"></i>
                          </span>
                        </div>
                      </label>
                      <div
                        tabIndex={0}
                        className="dropdown-content shadow-md top-10 text-zinc-700"
                      >
                        <DateRangePicker
                          className="rounded-md overflow-hidden p-0 m-0"
                          ranges={[selectionRange]}
                          onChange={handleSelect}
                          direction="vertical"
                          rangeColors={["#9333ea"]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-4 pt-4 block w-full">
              <div className="flex gap-4 px-8">
                <div className="w-full flex flex-col py-2 border-2 border-white border-b-rose-400">
                  <span className="text-sm text-gray-400">Laba kotor</span>
                  <span className="text-2xl font-bold pt-0">
                    RP. {numeral(summary.GrossSales).format("0,0")}
                  </span>
                </div>
                <div className="w-full flex flex-col py-2 border-2 border-white border-b-indigo-400">
                  <span className="text-sm text-gray-400">Laba bersih</span>
                  <span className="text-2xl font-bold pt-0">
                    RP. {numeral(summary.NetSales).format("0,0")}
                  </span>
                </div>
                <div className="w-full flex flex-col py-2 border-2 border-white border-b-slate-400">
                  <span className="text-sm text-gray-400">Diskon</span>
                  <span className="text-2xl font-bold pt-0">
                    RP. {numeral(summary.Discounts).format("0,0")}
                  </span>
                </div>
              </div>

              <div className="mt-0 pb-8 flex justify-center items-center">
                <Chart
                  className="w-full px-8"
                  chartType="AreaChart"
                  data={chartData}
                  options={{
                    legend: { position: "none", alignment: "center" },
                    chartArea: { width: "100%", height: "80%" },
                    // bar: { groupWidth: "60%" },
                    annotations: {
                      textStyle: {
                        fontSize: 0,
                        color: "black",
                      },
                    },
                    vAxis: {
                      gridlines: {
                        color: "transparent",
                      },
                    },
                    lineWidth: 2,
                    // backgroundColor: { fill: "transparent" },
                    pointSize: 8,
                    pointShape: "diamond",
                    // lineDashStyle: [14, 2, 7, 2],
                    smoothline: true,
                    colors: ["#f43f5e", "#6366f1"],
                  }}
                  width={"100%"}
                  height={"320px"}
                />
              </div>
            </div>
            {/* <h1 className="ml-8 font-bold">Other</h1> */}
            {/* <div className="flex gap-4 px-8 pb-8 opacity-80">
              <div className="border-slate-300 border-b py-2 px-4 w-full">
                <h1 className="text-xs">Refunds</h1>
                <h1 className="font-bold">RP. {numeral("0").format("0,0")}</h1>
              </div>
              <div className="border-slate-300 border-b py-2 px-4 w-full">
                <h1 className="text-xs">Gratuify</h1>
                <h1 className="font-bold">RP. {numeral("0").format("0,0")}</h1>
              </div>
              <div className="border-slate-300 border-b py-2 px-4 w-full">
                <h1 className="text-xs">Rounding</h1>
                <h1 className="font-bold">RP. {numeral("0").format("0,0")}</h1>
              </div>
              <div className="border-slate-300 border-b py-2 px-4 w-full">
                <h1 className="text-xs">Tax</h1>
                <h1 className="font-bold">RP. {numeral("0").format("0,0")}</h1>
              </div>
            </div> */}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
