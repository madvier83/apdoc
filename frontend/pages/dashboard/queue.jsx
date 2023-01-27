import React, { useEffect, useRef, useState } from "react";
import { useDraggable } from "react-use-draggable-scroll";

import moment from "moment/moment";

import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";

export default function Queue() {
  const ref = useRef(); // We will use React useRef hook to reference the wrapping div:
  const { events } = useDraggable(ref, {
    applyRubberBandEffect: true, // activate rubber band effect
  }); // Now we pass the reference to the useDraggable hook:

  const [isAddService, setIsAddService] = useState(false)

  const [isRegular, setIsRegular] = useState(true);

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
              <div className="badge badge-primary absolute z-10 -top-2 -right-2">
                12
              </div>
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
              <div className="badge badge-primary absolute z-10 -top-2 -right-2">
                +99
              </div>
            </span>
          </div>
          <div
            className={`relative max-w-6xl min-w-[720px] bg-gray-900 p-8 rounded-b-md rounded-r-md ${
              !isRegular && "rounded-l-md"
            }`}
          >
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="h-[73vh] md:w-1/2">
                {/* <div className="absolute bottom-8 z-50 flex">
                </div> */}
                <div
                  className="h-full rounded-md overflow-y-scroll"
                  {...events}
                  ref={ref}
                >
                  <div className="card cursor-pointer bg-indigo-900 bg-opacity-70 rounded-md shadow-md mb-4">
                    <div className="card-body ">
                      <div className="flex items-center">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-hexagon shadow-md bg-primary flex items-center justify-center">
                            <h1 className="text-xl font-semibold text-white mb-1">
                              A01
                            </h1>
                          </div>
                          {/* <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-rose-400 shadow-sm text-white p-1 rounded-full"></i> */}
                          <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i>
                        </div>
                        <div className="">
                          <h2 className="card-title text-lg text-primary-content">
                            Muhammad Advie Rifaldy
                          </h2>
                          <small className="text-zinc-400">
                            NIK: 9126565503190821
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-md cursor-pointer bg-slate-800 shadow-md mb-4">
                    <div className="card-body ">
                      <div className="flex items-center">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-hexagon shadow-md bg-primary flex items-center justify-center">
                            <h1 className="text-xl font-semibold text-white mb-1">
                              A02
                            </h1>
                          </div>
                          <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm text-rose-400 p-1 rounded-full"></i>
                          {/* <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i> */}
                        </div>
                        <div className="">
                          <h2 className="card-title text-lg text-zinc-400">
                            Ny. Linda Maelina
                          </h2>
                          <small className="text-zinc-400">
                            NIK: 9126565503190821
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-md cursor-pointer bg-slate-800 shadow-md mb-4">
                    <div className="card-body ">
                      <div className="flex items-center text-zinc-400">
                        <div className="mx-auto">
                          <span className="font-semibold">Add to queue</span>
                          <i className="fas fa-plus ml-2"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card h- rounded-md md:w-1/2 bg-base-100 shadow-md">
                <div className="card-body justify-between">
                  <div className="">
                    <div className="flex items-center">
                      <div className="avatar mr-6">
                        <div className="w-16 mask mask-hexagon shadow-md bg-primary flex items-center justify-center">
                          <h1 className="text-xl font-semibold text-white mb-1">
                            A01
                          </h1>
                        </div>
                        {/* <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-rose-400 shadow-sm text-white p-1 rounded-full"></i> */}
                        <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i>
                      </div>
                      <div className="">
                        <h2 className="card-title text-lg text-zinc-600">
                          Muhammad Advie Rifaldy
                        </h2>
                        <small className="text-zinc-400">
                          NIK: 9126565503190821
                        </small>
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="mt-8">
                        <small className="text-zinc-400">Date of birth</small>{" "}
                        <br />
                        <span className="font-sm text-zinc-800">
                          Bandung, 8 October 2023
                        </span>
                      </div>
                      <div className="mt-4">
                        <small className="text-zinc-400">Address</small> <br />
                        <span className="font-sm text-zinc-800">
                          Kab. Bandung, Jawa Barat, Desa Bojong Kunci, Kec.
                          Pameungpeuk, Komp. Paledang Indah 2 blok E 1-3 no 1 RT
                          2 RW 13
                        </span>
                      </div>
                      <div className="mt-4">
                        <small className="text-zinc-400">Services</small> <br />
                      </div>
                      <div className="flex gap-1 mt-2">
                        <label
                          for="addServiceModal"
                          className="text-zinc-400 flex justify-center items-center cursor-pointer animate-pulse"
                        >
                          <span className="font-semibold">Add Services</span>
                          <i className="fas fa-add ml-2"></i>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6 items-end">
                    <button className="btn btn-success bg-emerald-400 text-white w-1/2">
                      Contact{" "}
                      <i className="fa-brands fa-whatsapp ml-2 font-bold"></i>
                    </button>
                    <button className="btn btn-primary bg-indigo-500 w-1/2">
                      Start <i className="fas fa-check ml-2"></i>
                    </button>
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
