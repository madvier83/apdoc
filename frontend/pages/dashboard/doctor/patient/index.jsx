import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../../../api/axios";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import { useRouter } from "next/router";

export default function Patients() {
  const token = getCookies("token");
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);

  async function getPatients() {
    try {
      const response = await axios.get("/patients", {
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

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <>
      <DashboardLayout title="Patient Records">
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
            }
          >
            <div className="rounded-t mb-0 px-4 py-4 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className={"font-semibold text-lg "}>
                    <i className="fas fa-filter mr-3"></i> Patients Table
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right"></div>
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
                      Actions
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
                      <tr
                        key={obj.id}
                        className="hover:bg-zinc-50 cursor-pointer"
                        onClick={() => {
                          router.push(`/dashboard/doctor/patient/${obj.id}`);
                        }}
                      >
                        <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                          <span className={"ml-3 font-bold "}>{index + 1}</span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <i
                            className={`text-md mr-2 ${
                              obj.gender == "male"
                                ? "text-blue-400 fas fa-mars"
                                : "text-pink-400 fas fa-venus"
                            }`}
                          ></i>{" "}
                          <span className={"font-bold"}>{obj.name}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <span className={"capitalize"}>
                            {moment(obj.birth_date).format("DD MMM YYYY")} -{" "}
                            {obj.birth_place}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
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
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          {moment(obj.created_at).format("DD MMM YYYY")}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          {moment(obj.updated_at).fromNow()}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Records"
                          >
                            <label
                              className="bg-violet-500 text-white active:bg-violet-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => {
                                router.push(
                                  `/dashboard/doctor/patient/${obj.id}`
                                );
                              }}
                            >
                              <i className="fa-solid fa-heart-pulse"></i>{" "}
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
      </DashboardLayout>
    </>
  );
}
