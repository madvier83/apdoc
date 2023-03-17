import React, { useEffect, useRef, useState } from "react";

import moment from "moment/moment";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";

import { deleteCookie, getCookie, setCookie } from "cookies-next";

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

export default function Dashboard() {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
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
      setCookie("rangeDate", JSON.stringify(selectionRange))
      setCookieCheck(true)
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

  const data = [
    {
      name: "January XX 2023",
      uv: 278000,
      pv: 390800,
      amt: 200000,
    },
    {
      name: "January XX 2023",
      uv: 6890000,
      pv: 4800000,
      amt: 218100,
    },
    {
      name: "January XX 2023",
      uv: 2390000,
      pv: 380000,
      amt: 250000,
    },
    {
      name: "January XX 2023",
      uv: 24900000,
      pv: 4300000,
      amt: 2100000,
    },
    {
      name: "January XX 2023",
      uv: 189000,
      pv: 480000,
      amt: 218100,
    },
    {
      name: "January XX 2023",
      uv: 239000,
      pv: 3800000,
      amt: 250000,
    },
    {
      name: "January XX 2023",
      uv: 349000,
      pv: 430000,
      amt: 0,
    },
    {
      name: "January XX 2023",
      uv: 6890000,
      pv: 4800000,
      amt: 218100,
    },
    {
      name: "January XX 2023",
      uv: 6890000,
      pv: 4800000,
      amt: 218100,
    },
    {
      name: "January XX 2023",
      uv: 6890000,
      pv: 4800000,
      amt: 218100,
    },
    {
      name: "January XX 2023",
      uv: 6890000,
      pv: 4800000,
      amt: 218100,
    },
  ];

  return (
    <>
      <DashboardLayout title="Dashboard">
        <div className="mt-6 relative bg-white text-gray-900 rounded-md px-4 py-8 mx-0">
          <div className="dropdown ml-4">
            <label tabIndex={0}>
              <h1 className="text-2xl font-bold">Overview</h1>
              <div className="mb-8 rounded-md text-md mt-2 text-gray-400">
                Showing data from{" "}
                <span className=" text-violet-500 opacity-95 font-semibold">
                  {moment(selectionRange.startDate).format("MMMM Do YYYY")}
                </span>{" "}
                to{" "}
                <span className=" text-violet-500 opacity-95 font-semibold">
                  {moment(selectionRange.endDate).format("MMMM Do YYYY")}
                </span>
                <i className="fas fa-calendar ml-2 opacity-50"></i>
              </div>
            </label>
            <div tabIndex={0} className="dropdown-content top-24 text-zinc-700">
              <DateRangePicker
                className="rounded-md overflow-hidden p-0 m-0"
                ranges={[selectionRange]}
                onChange={handleSelect}
                direction="vertical"
                rangeColors={["#9333ea"]}
              />
            </div>
          </div>

          <div className="relative w-full h-[29vmax] py-4 px-4">
            <ResponsiveContainer className="text-xs text-white">
              <AreaChart
                className="text-xs text-black"
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="0 0" className="opacity-20" />
                <XAxis
                  dataKey="name"
                  stroke="#fff"
                  style={{
                    fontSize: "9px",
                    marginTop: "4px",
                    opacity: 0.4,
                  }}
                />
                <YAxis
                  stroke="#fff"
                  style={{
                    fontSize: "12px",
                    opacity: 0.4,
                  }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stackId="1"
                  stroke="#9333ea"
                  fill="#9333ea"
                  strokeWidth={4}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="pv"
                  stackId="1"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  strokeWidth={4}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="py-8"></div>
      </DashboardLayout>
    </>
  );
}
