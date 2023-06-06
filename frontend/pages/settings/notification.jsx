import { deleteCookie, getCookie } from "cookies-next";
import React, { useEffect, useReducer, useRef, useState } from "react";
import jwt_decode from "jwt-decode";

import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import axios from "../api/axios";
import moment from "moment";
import numeral, { Numeral } from "numeral";
import ReactToPrint from "react-to-print";
import ModalDelete from "../../components/Modals/ModalDelete";
import jwtDecode from "jwt-decode";

export default function Settings() {
  const token = getCookie("token");
  const settingsFormRef = useRef();
  const structRef = useRef();

  // const [clinic, setClinic] = useState();
  const [payload, setPayload] = useState({});
  //  mails
  const addMailRef = useRef();
  const [mails, setMails] = useState([]);
  const [mailsLoading, setMailsLoading] = useState({});
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [notif, setNotif] = useState({});

  async function getMails() {
    setMailsLoading(true);
    try {
      const response = await axios.get(`/recipient-mails`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setMails(response.data);
      setMailsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function addMails(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/recipient-mail`,
        { email },
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      getMails();
      addMailRef.current.click();
      setEmail("");
      setEmailError("");
    } catch (err) {
      console.error(err);
      setEmailError(err.response?.data?.message || "Invalid");
    }
  }
  async function deleteMail(id) {
    try {
      const response = await axios.delete(`/recipient-mail/${id}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      getMails();
    } catch (err) {
      console.error(err);
    }
  }
  async function putMails(obj) {
    console.log({ ...obj });
    try {
      const response = await axios.put(
        `/recipient-mail/setting`,
        { ...obj },
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      getNotif();
    } catch (err) {
      console.error(err);
    }
  }
  async function getNotif() {
    if (!payload.id) {
      return;
    }
    try {
      const response = await axios.get(`/user/${payload.id}`, {
        "Content-Type": "application/json",
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      // console.log(response.data);
      setNotif(response.data);
      // setNotifLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMails();
    getNotif();
  }, []);

  useEffect(() => {
    if (token) {
      setPayload(jwtDecode(getCookie("token")));
    }
  }, [token]);

  useEffect(() => {
    getNotif();
  }, [payload]);

  // console.log(notif.daily_sales_summary_status);
  // console.log(notif);

  return (
    <>
      <DashboardLayout title="Settings">
        <div className="w-full lg:w-8/12 mb-16 mt-8">
          <form onSubmit={(e) => updateSettings(e)}>
            <div className="relative flex flex-col min-w-0 break-words w-full min-h-[88vh] mb-6 shadow-lg rounded-md bg-gray-900 border-0">
              {/* Personal detail form */}
              <div className="rounded-t-md bg-gray-900 text-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between border-b-gray-700 border-dotted border-b-2 pb-4">
                  <h6 className="text-xl font-bold">Email Notification</h6>

                  <label
                    htmlFor="addMail"
                    className={`bg-indigo-500 active:bg-indigo-400 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 cursor-pointer`}
                  >
                    Add Email
                    <i className={`fas fa-plus ml-2`}></i>
                  </label>
                </div>
              </div>

              <div className="flex-auto px-6 py-10 pt-0">
                <div className="flex flex-col mb-4 px-2 gap-4">
                  <div className="flex justify-between items-center text-white">
                    <div className="">
                      <span className="font-semibold">Daily sales summary</span>
                      <br />
                      <span className="text-zinc-200 text-sm">
                        Receive email about your sales
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        putMails({
                          daily_sales_status: !notif.daily_sales_summary_status,
                          daily_inventory_status:
                            notif.daily_inventory_alerts_status,
                        });
                      }}
                      className={`relative rounded-full px-1 flex items-center btn-xs w-12 cursor-pointer ${
                        notif.daily_sales_summary_status == true
                          ? "bg-emerald-600 justify-end"
                          : "btn-error bg-opacity-30 justify-start"
                      }`}
                    >
                      <div className={`bg-zinc-800 rounded-full w-4 h-4`}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-white">
                    <div className="">
                      <span className="font-semibold">Inventory alerts</span>
                      <br />
                      <span className="text-zinc-200 text-sm">
                        Receive daily email of items that are low or out of
                        stock
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        putMails({
                          daily_sales_status: notif.daily_sales_summary_status,
                          daily_inventory_status:
                            !notif.daily_inventory_alerts_status,
                        });
                      }}
                      className={`relative rounded-full px-1 flex items-center btn-xs w-12 cursor-pointer ${
                        notif.daily_inventory_alerts_status == true
                          ? "bg-emerald-600 justify-end"
                          : "btn-error bg-opacity-30 justify-start"
                      }`}
                    >
                      <div className={`bg-zinc-800 rounded-full w-4 h-4`}></div>
                    </div>
                  </div>
                </div>

                {/* <div className="">
                      <span className="font-semibold">Inventory alerts</span><br />
                      <span className="text-zinc-200 text-sm">Receive daily email about itemthats are low or out of stock</span>
                    </div> */}
                <div className="py-2"></div>
                <div className="flex gap-2 flex-col">
                  {mails?.map((obj) => {
                    return (
                      <div
                        key={obj.id}
                        className="card flex flex-row justify-between items-center bg-gray-800 text-white rounded-sm p-4"
                      >
                        <p>{obj.email || ""}</p>
                        <label
                          htmlFor={`mail_${obj.id}`}
                          className="cursor-pointer"
                        >
                          <i className="fas fa-trash text-rose-500"></i>
                          <ModalDelete
                            id={`mail_${obj.id}`}
                            callback={() => deleteMail(obj.id)}
                            title={`Remove ${obj.email}?`}
                          ></ModalDelete>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="py-8"></div>

        <ModalBox id="addMail">
          <h3 className="font-bold text-lg mb-4">Add Mail</h3>
          <form onSubmit={addMails} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              <label className="label">
                <span className="label-text-alt text-rose-300">
                  {emailError}
                </span>
              </label>
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="addMail"
                ref={addMailRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-success bg-indigo-400 rounded-md">
                Add
              </button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
