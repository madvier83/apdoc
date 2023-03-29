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

export default function Dashboard() {
  const token = getCookies("token");
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
  const [cookieCheck, setCookieCheck] = useState(false);

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
    try {
      let response = await axios.get(
        `/report-sales/summary/${moment(selectionRange.startDate).format(
          "YYYY-MM-DD"
        )}/${moment(selectionRange.endDate).format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
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
    try {
      const response = await axios.get(
        `/report-sales/item/${moment(selectionRange.startDate).format(
          "YYYY-MM-DD"
        )}/${moment(selectionRange.endDate).format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: "Bearer" + token.token,
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
  useEffect(() => {
    if (cookieCheck) {
      getSummary();
      getItem();
    }
  }, [selectionRange]);

  console.log(item);

  return (
    <>
      <DashboardLayout title="Dashboard">
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
                    Overview
                  </h3>
                  <div className="flex">
                    <div className="dropdown">
                      <label tabIndex={0}>
                        <div className="mb-4 rounded-md text-sm mt-2 text-gray-400">
                          Showing data from{" "}
                          <span className=" text-violet-500 opacity-95 font-semibold">
                            {moment(selectionRange.startDate).format(
                              "MMMM Do YYYY"
                            )}
                          </span>{" "}
                          to{" "}
                          <span className=" text-violet-500 opacity-95 font-semibold">
                            {moment(selectionRange.endDate).format(
                              "MMMM Do YYYY"
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
                  <span className="text-sm text-gray-400">Gross Sales</span>
                  <span className="text-2xl font-bold pt-0">
                    RP. {numeral(summary.GrossSales).format("0,0")}
                  </span>
                </div>
                <div className="w-full flex flex-col py-2 border-2 border-white border-b-indigo-400">
                  <span className="text-sm text-gray-400">Net Sales</span>
                  <span className="text-2xl font-bold pt-0">
                    RP. {numeral(summary.NetSales).format("0,0")}
                  </span>
                </div>
                <div className="w-full flex flex-col py-2 border-2 border-white border-b-slate-400">
                  <span className="text-sm text-gray-400">Discounts</span>
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
        <div className="py-8"></div>
      </DashboardLayout>
    </>
  );
}
