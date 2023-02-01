import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Expo, gsap } from "gsap";
import { useDraggable } from "react-use-draggable-scroll";

import DashboardLayout from "../../layouts/DashboardLayout";

export default function Queue() {

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
  const [isAddQueue, setIsAddQueue] = useState(false);

  // open service form ref
  let infoRef = useRef();
  let serviceRef = useRef();
  const addServiceTL = useRef();
  useLayoutEffect(() => {
    addServiceTL.current = gsap.timeline({ paused: true });
    addServiceTL.current.to(infoRef.current, {
      duration: 0.5,
      opacity: 0,
      x: -50,
      display: "none",
      ease: Expo.easeInOut,
    });
    addServiceTL.current.to(serviceRef.current, {
      display: "block",
      duration: 0.5,
      opacity: 1,
      ease: Expo.easeInOut,
    });
  }, []);

  useEffect(() => {
    isAddService ? addServiceTL.current.play() : addServiceTL.current.reverse();
  }, [isAddService]);

  // add queue ref
  let listRef = useRef();
  let addRef = useRef();
  // const addQueueTL = useRef();
  // useLayoutEffect(() => {
  //   addQueueTL.current = gsap.timeline({ paused: true });
  //   addQueueTL.current.to(addRef.current, {
  //     duration: .2,
  //     opacity: 1,
  //     display: "block"
  //   });
  //   addQueueTL.current.to(listRef.current, {
  //     duration: .2,
  //     // opacity: 0,
  //     display: "none"
  //   });
  // }, []);
  
  // useEffect(() => {
  //   gsap.to(addRef.current, {
  //     duration: 0,
  //     // opacity: 0,
  //     width: 0,
  //     // display: "none"
  //   });
  // }, []);
  // useEffect(() => {
  //   isAddQueue ? addQueueTL.current.play() : addQueueTL.current.reverse();
  //   console.log(isAddQueue);
  // }, [isAddQueue]);
  

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
            className={`relative max-w-6xl min-w-0 md:min-w-[720px] bg-gray-900 p-8 rounded-b-md rounded-r-md ${
              !isRegular && "rounded-l-md"
            }`}
          >
            <div
              ref={listRef}
              className="flex flex-col-reverse md:flex-row-reverse gap-4"
              style={{ display: "block" }}
            >
              <div className="h-[74vh] min-h-fit md:w-1/2">
                {/* <div className="absolute bottom-8 z-50 flex">
                </div> */}
                <div
                  ref={servicesRef}
                  {...servicesEvents}
                  className="h-full rounded-md overflow-y-scroll overflow-x-hidden"
                >
                  <div className="card cursor-pointer overflow-hidden bg-indigo-900 bg-opacity-70 rounded-md shadow-md mb-4">
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
                  <div
                    onClick={() => setIsAddQueue((prev) => !prev)}
                    className="card select-none cursor-pointer rounded-md bg-slate-800 shadow-md mb-4"
                  >
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
              <div className="card min-h-[74vh] rounded-md md:w-1/2 bg-base-100 shadow-md">
                <div className="card-body justify-between">
                  <div className="">
                    <div className="flex items-center mb-4">
                      <div className="avatar mr-6">
                        <div className="w-16 mask mask-hexagon shadow-md bg-primary flex items-center justify-center">
                          <h1 className="text-xl font-semibold text-white mb-1">
                            A01
                          </h1>
                        </div>
                        {/* <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-rose-400 shadow-sm text-white p-1 rounded-full"></i> */}
                        <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i>
                      </div>
                      <div className="w-full">
                        <h2 className="card-title text-lg text-zinc-600 truncate">
                          Muhammad Advie Rifaldy
                        </h2>
                        <small className="text-zinc-400">
                          NIK: 9126565503190821
                        </small>
                      </div>
                    </div>
                    <div className="px-0" ref={infoRef}>
                      <div className="relative">
                        <div className="absolute w-full">
                          <div className="mt-4">
                            <small className="text-zinc-400">
                              Date of birth
                            </small>{" "}
                            <br />
                            <span className="font-sm text-zinc-800">
                              Bandung, 8 October 2023
                            </span>
                          </div>
                          <div className="mt-4">
                            <small className="text-zinc-400">Address</small>{" "}
                            <br />
                            <span className="font-sm text-zinc-800">
                              Kab. Bandung, Jawa Barat, Desa Bojong Kunci, Kec.
                              Pameungpeuk, Komp. Paledang Indah 2 blok E 1-3 no
                              1 RT 2 RW 13
                            </span>
                          </div>
                          <div className="mt-4">
                            <small className="text-zinc-400">Services</small>{" "}
                            <br />
                          </div>
                          <div
                            ref={queuesRef}
                            {...queuesEvents}
                            className="flex flex-col gap-1 rounded-md overflow-y-scroll h-[21vh]"
                          >
                            <div className="flex justify-between overflow-hidden items-center px-1">
                              <div className="text-sm breadcrumbs font-semibold text-zinc-800">
                                <ul>
                                  <li className="max-w-36 overflow-hidden">
                                    <i className="fa-solid fa-kit-medical mr-2"></i>
                                    <span className="truncate">Masker</span>
                                  </li>
                                  <li className="max-w-36 overflow-hidden text-zinc-400">
                                    <i className="fas fa-user-doctor mr-2"></i>
                                    <span className="text-sm normal-case truncate">
                                      Dr. Reid Adams V
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <div className="flex">
                                <div className="btn btn-ghost btn-sm px-2">
                                  <i className="fas fa-edit"></i>
                                </div>
                                <div className="btn btn-ghost btn-sm px-2">
                                  <i className="fas fa-trash"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between overflow-hidden items-center px-1">
                              <div className="text-sm breadcrumbs font-semibold text-zinc-800">
                                <ul>
                                  <li className="max-w-36 overflow-hidden">
                                    <i className="fa-solid fa-kit-medical mr-2"></i>
                                    <span className="truncate">Botox</span>
                                  </li>
                                  <li className="max-w-36 overflow-hidden text-zinc-400">
                                    <i className="fas fa-user-doctor mr-2"></i>
                                    <span className="text-sm normal-case truncate">
                                      Dr. Reid Adams V
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <div className="flex">
                                <div className="btn btn-ghost btn-sm px-2">
                                  <i className="fas fa-edit"></i>
                                </div>
                                <div className="btn btn-ghost btn-sm px-2">
                                  <i className="fas fa-trash"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between overflow-hidden items-center px-1">
                              <div className="text-sm breadcrumbs font-semibold text-zinc-800">
                                <ul>
                                  <li className="max-w-36 overflow-hidden">
                                    <i className="fa-solid fa-kit-medical mr-2"></i>
                                    <span className="truncate">
                                      Laser resurfacing
                                    </span>
                                  </li>
                                  <li className="max-w-36 overflow-hidden text-zinc-400">
                                    <i className="fas fa-user-doctor mr-2"></i>
                                    <span className="text-sm normal-case truncate">
                                      Dr. Reid Adams V
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <div className="flex">
                                <div className="btn btn-ghost btn-sm px-2">
                                  <i className="fas fa-edit"></i>
                                </div>
                                <div className="btn btn-ghost btn-sm px-2">
                                  <i className="fas fa-trash"></i>
                                </div>
                              </div>
                            </div>
                            <div
                              className="py-2 mt-2 text-sm flex items-center justify-center bg-gray-700 text-white rounded-md font-semibold cursor-pointer select-none"
                              onClick={() => setIsAddService(true)}
                            >
                              <span>Add service</span>
                              <i className="fas fa-add ml-2 font-thin"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      ref={serviceRef}
                      className="text-zinc-600"
                      style={{ display: "none" }}
                    >
                      <div className="w-auto">
                        <label className="label ml-0 pl-0">
                          <small className="label-text text-zinc-400 text-xs mt-4">
                            Service
                          </small>
                        </label>
                        <select
                          name="position_id"
                          className="input input-bordered without-ring input-primary border-slate-300 w-full"
                        >
                          <option value="">Unasigned</option>
                        </select>
                      </div>
                      <div className="w-auto">
                        <label className="label ml-0 pl-0">
                          <small className="label-text text-gray-400 text-xs mt-2">
                            Doctor
                          </small>
                        </label>
                        <select
                          name="position_id"
                          className="input input-bordered without-ring input-primary border-slate-300 w-full"
                        >
                          <option value="">Unasigned</option>
                        </select>
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
                        onClick={() => setIsAddService(false)}
                        className="btn btn-primary w-1/2"
                      >
                        Add <i className="fas fa-plus ml-2"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <div ref={addRef} className="h-[74vh] bg-white rounded-md shadow absolute bottom-8" style={{ width: 100 }}>
              <div className=""></div>
            </div> */}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
