import React, { useEffect, useRef, useState } from "react";
import { useDraggable } from "react-use-draggable-scroll";

import moment from "moment/moment";

import DashboardLayout from "../../layouts/DashboardLayout";

export default function Queue() {
  const ref = useRef(); // We will use React useRef hook to reference the wrapping div:
  const { events } = useDraggable(ref, {
    applyRubberBandEffect: true, // activate rubber band effect
  }); // Now we pass the reference to the useDraggable hook:

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
            className={`relative max-w-5xl min-w-[720px] bg-gray-900 p-8 rounded-b-md rounded-r-md ${
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
                  <div className="card cursor-pointer bg-primary rounded-md shadow-md mb-4">
                    <div className="card-body py-6">
                      <div className="flex items-center">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-squircle">
                            <img src="https://www.meme-arsenal.com/memes/2c281b27582bb0351d3a9fcfafe95c18.jpg" />
                          </div>
                          {/* <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-rose-400 shadow-sm text-white p-1 rounded-full"></i> */}
                          <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i>
                        </div>
                        <div className="">
                          <h2 className="card-title text-lg text-primary-content">
                            Muhammad Advie Rifaldy
                          </h2>
                          <small className="text-primary-content opacity-80">
                            NIK: 1234456788
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-md cursor-pointer bg-slate-800 shadow-md mb-4">
                    <div className="card-body py-6">
                      <div className="flex items-center">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-squircle">
                            <img src="https://www.meme-arsenal.com/memes/2c281b27582bb0351d3a9fcfafe95c18.jpg" />
                          </div>
                          <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm text-rose-400 p-1 rounded-full"></i>
                          {/* <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i> */}
                        </div>
                        <div className="">
                          <h2 className="card-title text-lg text-zinc-400">
                            Ny. Linda Maelina
                          </h2>
                          <small className="text-zinc-400">
                            NIK: 1234456788
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-md cursor-pointer bg-slate-800 shadow-md mb-4">
                    <div className="card-body py-6">
                      <div className="flex items-center">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-squircle">
                            <img src="https://www.meme-arsenal.com/memes/2c281b27582bb0351d3a9fcfafe95c18.jpg" />
                          </div>
                          {/* <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-rose-400 shadow-sm text-white p-1 rounded-full"></i> */}
                          <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i>
                        </div>
                        <div className="">
                          <h2 className="card-title text-lg text-zinc-400">
                            Noel Hodkiewicz III
                          </h2>
                          <small className="text-zinc-400">
                            NIK: 1234456788
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-md cursor-pointer bg-slate-800 shadow-md mb-4">
                    <div className="card-body py-6">
                      <div className="flex items-center">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-squircle">
                            <img src="https://www.meme-arsenal.com/memes/2c281b27582bb0351d3a9fcfafe95c18.jpg" />
                          </div>
                          <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-sm text-rose-500 p-1 rounded-full"></i>
                          {/* <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i> */}
                        </div>
                        <div className="">
                          <h2 className="card-title text-lg text-zinc-400">
                            Mrs. Noel Hodkiewicz II
                          </h2>
                          <small className="text-zinc-400">
                            NIK: 1234456788
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-md cursor-pointer bg-slate-800 shadow-md mb-4">
                    <div className="card-body py-6">
                      <div className="flex items-center">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-squircle">
                            <img src="https://www.meme-arsenal.com/memes/2c281b27582bb0351d3a9fcfafe95c18.jpg" />
                          </div>
                          {/* <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-rose-400 shadow-sm text-white p-1 rounded-full"></i> */}
                          <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i>
                        </div>
                        <div className="">
                          <h2 className="card-title text-lg text-zinc-400">
                            Junior Carter Jr.
                          </h2>
                          <small className="text-zinc-400">
                            NIK: 1234456788
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-md cursor-pointer bg-slate-800 shadow-md">
                    <div className="card-body py-6">
                      <div className="flex items-center">
                        <div className="avatar mr-6">
                          <div className="w-16 mask mask-squircle">
                            <img src="https://www.meme-arsenal.com/memes/2c281b27582bb0351d3a9fcfafe95c18.jpg" />
                          </div>
                          {/* <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-rose-400 shadow-sm text-white p-1 rounded-full"></i> */}
                          <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i>
                        </div>
                        <div className="">
                          <h2 className="card-title text-lg text-zinc-400">
                            Junior Carter Jr.
                          </h2>
                          <small className="text-zinc-400">
                            NIK: 1234456788
                          </small>
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
                        <div className="w-16 mask mask-squircle">
                          <img src="https://www.meme-arsenal.com/memes/2c281b27582bb0351d3a9fcfafe95c18.jpg" />
                        </div>
                        {/* <i className="fas fa-venus z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-rose-400 shadow-sm text-white p-1 rounded-full"></i> */}
                        <i className="fas fa-mars z-10 absolute -right-2 text-xs w-6 h-6 flex items-center justify-center bottom-0 bg-white shadow-md font-bold text-blue-400 p-1 rounded-full"></i>
                      </div>
                      <div className="">
                        <h2 className="card-title text-lg text-zinc-600">
                          Muhammad Advie Rifaldy
                        </h2>
                        <small className="text-zinc-400">NIK: 1234456788</small>
                      </div>
                    </div>
                    <div className="mt-4">
                      <small className="text-zinc-400">Age</small> <br />
                      <span className="font-sm text-zinc-800">
                        19 years old
                      </span>
                    </div>
                    <div className="mt-4">
                      <small className="text-zinc-400">Date of birth</small>{" "}
                      <br />
                      <span className="font-sm text-zinc-800">
                        8 October 2023
                      </span>
                    </div>
                    <div className="mt-4">
                      <small className="text-zinc-400">Diagnosis</small> <br />
                      <span className="font-sm text-zinc-800">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Amet, optio
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="badge rounded-sm text-xs pb-[2px]">
                        neutral
                      </div>
                      <div className="badge rounded-sm text-xs pb-[2px] badge-primary">
                        primary
                      </div>
                      <div className="badge rounded-sm text-xs pb-[2px] badge-secondary">
                        secondary
                      </div>
                      {/* <div className="badge text-xs pb-[2px] badge-accent">accent</div> */}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6 items-end">
                    <button className="btn btn-success w-1/2">
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
