import React, { useEffect, useRef, useState } from "react";

import moment from "moment/moment";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";

import { deleteCookie, getCookie, getCookies, setCookie } from "cookies-next";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../api/axios";
import Chart from "react-google-charts";
import numeral from "numeral";
import Loading from "../../components/loading";
import Highlighter from "react-highlight-words";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetCookieChunk } from "../../services/CookieChunk";

export default function Dashboard() {
  const token = GetCookieChunk("token_");
  const router = useRouter();

  const [clinic, setClinic] = useState();
  const tableRef = useRef();
  const detailModalRef = useRef();

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [chartData, setChartData] = useState([
    ["Date", "Gross Sales", "Net Sales"],
    ["", 0, 0],
  ]);

  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [stock, setStock] = useState([]);
  const [stockLoading, setStockLoading] = useState(true);
  const [cookieCheck, setCookieCheck] = useState(false);

  const [selectedItem, setSelectedItem] = useState({});

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState(true);

  const [lowPoint, setLowPoint] = useState(100);

  useEffect(() => {
    try {
      let range = JSON.parse(getCookie("rangeDate"));
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
      setCookie("rangeDate", JSON.stringify(selectionRange));
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

  async function getStock() {
    if (!clinic) {
      return;
    }
    setStockLoading(true);
    try {
      const response = await axios.get(
        `items/${clinic && clinic + "/"}${perpage}${
          search &&
          "/" +
            search
              .split(" ")
              .join("%")
              .replace(/[a-zA-Z0-9]/, "")
              .replace(".", "")
        }?page=${page}&sortBy=${sortBy}&order=${order ? "asc" : "desc"}`,
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      setStock(response.data);
      setStockLoading(false);
    } catch (err) {
      console.error(err);
      setStock({});
      setStockLoading(false);
    }
  }
  useEffect(() => {
    if (cookieCheck) {
      getSummary();
      getItem();
    }
  }, [selectionRange, clinic]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getStock();
    }, 300);

    if (page > item?.last_page) {
      setPage(item.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, clinic, sortBy, order]);

  return (
    <>
      <DashboardLayout title="Dasbor" clinic={clinic} setClinic={setClinic}>
        <div className="flex-col gap-4 mt-6">
          {/* <div className="flex gap-4">
            <div className="w-1/2 h-28 bg-white rounded-md p-8">
              <h1 className="font-bold text-xl">Welcome to your dashbard</h1>
            </div>
            <div className="w-1/4 h-28 bg-white rounded-md p-8">
              <div className="avatar">
                <div className="w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <i className="fas fa-barcode text-white text-xl"></i>
                </div>
              </div>
            </div>
            <div className="w-1/4 h-28 bg-white rounded-md"></div>
          </div> */}
          <div
            className={
              "relative flex flex-col min-w-0 break-words mt-4 overflow-visible w-full min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
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
            {/* <h1 className="ml-8 font-bold">Details</h1>
            <div className="flex gap-4 px-8 pb-8 opacity-80 mt-4">
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
        <div className="py-2"></div>

        {/* <div className="bg-white rounded-md">
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center my-3">
              <Link
                href={"/dashboard/pharmacy/supply"}
                className="relative w-full px-4 max-w-full flex-grow flex-1"
              >
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Item Supply Table
                </h3>
              </Link>

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
                  } absolute text-slate-400 right-0 pr-4 cursor-pointer  top-[6px] text-xs`}
                ></i>
              </div>

              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  className="btn btn-xs bg-gray-500 text-white active:bg-gray-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  href={`/dashboard/pharmacy/stock-adjustment`}
                  onClick={() => {
                    setCookie(
                      "sidebar",
                      JSON.stringify({
                        user: false,
                        admin: false,
                        receptionist: false,
                        doctor: false,
                        pharmacy: true,
                        promotion: false,
                        cashier: false,
                        report: false,
                      })
                    );
                  }}
                >
                  Stock Adjustment <i className="fas fa-cog ml-2"></i>
                </Link>
              </div>
            </div>
          </div>
          <div
            ref={tableRef}
            className="h-[72vh] w-full overflow-x-auto flex flex-col justify-between"
          >
            <table className="items-center w-full bg-transparent border-collapse overflow-auto">
              <thead className="sticky top-0">
                <tr>
                  <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    #
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "code" && setOrder((p) => !p);
                        setSortBy("code");
                      }}
                    >
                      <p>code</p>
                      <i
                        className={`fas fa-sort text-right px-2 ${
                          sortBy != "code" && "opacity-40"
                        }`}
                      ></i>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <div
                      className={`flex items-center justify-between cursor-pointer`}
                      onClick={() => {
                        sortBy == "name" && setOrder((p) => !p);
                        setSortBy("name");
                      }}
                    >
                      <p>Item</p>
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
                        sortBy == "stock" && setOrder((p) => !p);
                        setSortBy("stock");
                      }}
                    >
                      <p>Total Stock</p>
                    </div>
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                    <p>Actions</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <Loading
                  data={stock}
                  dataLoading={stockLoading}
                  reload={getStock}
                ></Loading>
                {!stockLoading &&
                  stock?.data?.map((obj, index) => {
                    if (
                      obj.item_supplys?.reduce(
                        (totalStock, item) => totalStock + item.stock,
                        0
                      ) <= 0
                    ) {
                      return;
                    }
                    return (
                      <tr key={obj.id} className="hover:bg-zinc-50">
                        <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                          <span className={"ml-3 font-bold"}>
                            {index + stock.from}
                          </span>
                        </th>
                        <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                          <span className={"font-bold"}>{obj.code}</span>
                        </th>
                        <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                          <span className={"ml-3 font-bold"}>
                            <Highlighter
                              highlightClassName="bg-emerald-200"
                              searchWords={[search]}
                              autoEscape={true}
                              textToHighlight={obj.name}
                            ></Highlighter>
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          {obj.item_supplys?.reduce(
                            (totalStock, item) => totalStock + item.stock,
                            0
                          )}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4">
                          <label
                            htmlFor={`modal-detail`}
                            onClick={() => setSelectedItem(obj)}
                            className="bg-violet-500 text-white active:bg-violet-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          >
                            <i className="fas fa-eye"></i>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="flex w-full py-2 mt-1 rounded-b-md gap-8 justify-center bottom-0 items-center align-bottom select-none bg-gray-50">
            <small className="w-44 text-right truncate">
              Results {stock.from}-{stock.to} of {stock.total}
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
                max={stock.last_page}
                onChange={(e) => setPage(e.target.value)}
              />
              <button
                className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                disabled={page >= stock.last_page ? true : false}
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
              >
                <i className="fa-solid fa-angle-right"></i>
              </button>
              <button
                className="btn btn-xs btn-ghost hover:bg-slate-50 disabled:bg-gray-50"
                disabled={page >= item.last_page ? true : false}
                onClick={() => {
                  setPage(stock.last_page);
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
        </div> */}

        <div className="pb-4 pt-4 block w-full"></div>
        <div className="py-8"></div>
      </DashboardLayout>

      <input type="checkbox" id="modal-detail" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box px-0 p-0 max-w-2xl">
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full min-h-fit rounded-md text-blueGray-700 bg-white"
            }
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg mb-4 px-8 pt-5">
                <i className="fa-solid fa-boxes-stacked mr-3"></i>{" "}
                {selectedItem.name || "Item"} Supply List
              </h3>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <label
                  className="bg-rose-400 text-white active:bg-rose-400 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  ref={detailModalRef}
                  htmlFor="modal-detail"
                >
                  <i className="fas fa-x"></i>
                </label>
              </div>
            </div>
            <form onSubmit={() => {}} autoComplete="off">
              <input type="hidden" autoComplete="off" />
              <div className="form-control w-full">
                <table className="items-center w-full bg-transparent border-collapse overflow-auto">
                  <thead className="sticky top-0">
                    <tr>
                      <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                        #
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                        <div
                          className={`flex items-center justify-between cursor-pointer`}
                        >
                          <p>Stock</p>
                        </div>
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                        <div
                          className={`flex items-center justify-between cursor-pointer`}
                        >
                          <p>Manufacturing</p>
                        </div>
                      </th>
                      <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                        <div
                          className={`flex items-center justify-between cursor-pointer`}
                        >
                          <p>Expired</p>
                        </div>
                      </th>
                      {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-100 text-blueGray-600">
                          <p>Actions</p>
                        </th> */}
                    </tr>
                  </thead>
                  <tbody className="">
                    {selectedItem.item_supplys?.map((obj, index) => {
                      return (
                        <tr key={obj.id} className="hover:bg-zinc-50">
                          <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                            <span className={"ml-3 font-bold"}>
                              {index + stock.from}
                            </span>
                          </th>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            {obj.stock}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            {moment(obj.manufacturing).format("DD MMM YYYY")}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                            {moment(obj.expired).format("DD MMM YYYY")}{" "}
                            <span
                              className={`font-semibold ${
                                moment(obj.expired).format() <
                                  moment().subtract(-7, "d").format() &&
                                "text-rose-400 animate-pulse"
                              }`}
                            >
                              {" "}
                              - Expired {moment(obj.expired).fromNow()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    <tr className="bg-gray-100">
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-3 text-left">
                        <span className={"ml-3 font-bold"}>
                          {/* {index + stock.from} */}
                        </span>
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 font-bold">
                        {selectedItem.item_supplys?.reduce(
                          (totalStock, item) => totalStock + item.stock,
                          0
                        )}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2"></td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
