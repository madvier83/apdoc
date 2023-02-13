import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import numeral from "numeral";

export default function StockAdjustment() {
  const token = getCookies("token");

  const addModalRef = useRef();
  const putModalRef = useRef();

  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [itemDb, setItemDb] = useState([]);
  const [itemDbLoading, setItemDbLoading] = useState(true);
  const [supplyDb, setSupplyDb] = useState([]);
  const [supplyDbLoading, setSupplyDbLoading] = useState(true);

  const initialItemForm = {
    item_id: 0,
    item_supply_id: "",
    adjustment: "",
    note: "",
  };

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialItemForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialItemForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialItemForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialItemForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getItemDb() {
    try {
      const response = await axios.get("items", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setItemDb(response.data);
      setItemDbLoading(false);
    } catch (err) {
      console.error(err);
    }
  }
  async function getSupplyDb(id) {
    try {
      const response = await axios.get(`item-supply/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setSupplyDb(response.data);
      setSupplyDbLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function getItem() {
    try {
      const response = await axios.get("stock-adjustments", {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      setItem(response.data);
      setItemLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    try {
      const response = await axios.post("stock-adjustment", addForm, {
        headers: {
          Authorization: "Bearer" + token.token,
          "Content-Type": "application/json",
        },
      });
      addModalRef.current.click();
      getItem();
      setAddForm(initialItemForm);
      setAddFormError(initialItemForm);
    } catch (err) {
      setAddFormError(initialItemForm);
      setAddFormError(err.response?.data);
    }
  }

  async function putItem(e) {
    e.preventDefault();
    console.log(putForm);
    try {
      const response = await axios.put(
        `stock-adjustment/${putForm.id}`,
        putForm,
        {
          headers: {
            Authorization: "Bearer" + token.token,
            "Content-Type": "application/json",
          },
        }
      );
      putModalRef.current.click();
      getItem();
      setPutForm(initialItemForm);
      setPutFormError(initialItemForm);
    } catch (err) {
      setPutFormError(initialItemForm);
      setPutFormError(err.response?.data);
    }
  }

  async function deleteItem(id) {
    try {
      const response = await axios.delete(`stock-adjustment/${id}`, {
        headers: {
          Authorization: "Bearer" + token.token,
        },
      });
      getItem();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getItem();
    getItemDb();
  }, []);

  useEffect(() => {
    getSupplyDb(addForm.item_id);
  }, [addForm.item_id]);

  return (
    <>
      <DashboardLayout title="Stock Adjustment">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded text-blueGray-700 bg-white"
          }
        >
          <div className="rounded-t mb-0 px-4 py-4 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className={"font-semibold text-lg "}>
                  <i className="fas fa-filter mr-3"></i> Stock Adjustment Table
                </h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <label
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  htmlFor="modal-add"
                >
                  Add <i className="fas fa-add"></i>
                </label>
              </div>
            </div>
          </div>
          <div className="min-h-[80vh] block w-full overflow-x-auto">
            {/* Projects table */}
            <table className="items-center w-full bg-transparent border-collapse overflow-auto">
              <thead>
                <tr>
                  <th className="pr-6 pl-9 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    #
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Item
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Before
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Adjustment
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Difference
                  </th>
                  <th className="pl-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Note
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Created At
                  </th>
                  <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Updated At
                  </th>
                  {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                    Acitons
                  </th> */}
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
                {item?.map((obj, index) => {
                  return (
                    <tr key={obj.id}>
                      <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                        <span className={"ml-3 font-bold"}>{index + 1}</span>
                      </th>
                      <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                        <span className={"ml-3 font-bold"}>
                          {obj.item_supply.item.name}
                        </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {obj.before}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {obj.adjustment}
                      </td>
                      <td
                        className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 font-semibold ${
                          obj.difference > 0
                            ? "text-emerald-500"
                            : "text-rose-400"
                        }`}
                      >
                        {obj.difference > 0 && "+"}
                        {obj.difference}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {obj.note}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.created_at).format("MMM Do YYYY")}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {moment(obj.updated_at).fromNow()}
                      </td>
                      {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        -
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ModalBox id="modal-add">
          <h3 className="font-bold text-lg mb-4">Add Stock Adjustment</h3>
          <form onSubmit={addItem} autoComplete="off">
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Item</span>
              </label>
              <select
                name="item_id"
                onChange={(e) => handleAddInput(e)}
                required
                value={addForm.item_id}
                className="input input-bordered without-ring input-primary border-slate-300 w-full"
              >
                <option value="">Select</option>
                {itemDb?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  );
                })}
              </select>
              {addFormError.item_supply_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.item_supply_id}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Item Supply</span>
              </label>
              <select
                name="item_supply_id"
                onChange={(e) => handleAddInput(e)}
                required
                value={addForm.item_supply_id}
                className="input input-bordered without-ring input-primary border-slate-300 w-full"
              >
                <option value="">Select</option>
                {supplyDb?.map((obj) => {
                  return (
                    <option key={obj.id} value={obj.id}>
                      Stock: {obj.stock} | Exp:{" "}
                      {moment(obj.expired).format("MMM Do YYYY")} | Created at:{" "}
                      {moment(obj.created_at).format("MMM Do YYYY")}
                    </option>
                  );
                })}
              </select>
              {addFormError.item_supply_id && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.item_supply_id}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Adjustment</span>
              </label>
              <input
                type="number"
                name="adjustment"
                value={addForm.adjustment}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.adjustment && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.adjustment}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text">Note</span>
              </label>
              <input
                type="text"
                name="note"
                value={addForm.note}
                onChange={(e) => handleAddInput(e)}
                required
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.note && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.note}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action rounded-sm">
              <label
                htmlFor="modal-add"
                ref={addModalRef}
                className="btn btn-ghost rounded-md"
              >
                Cancel
              </label>
              <button className="btn btn-primary rounded-md">Add</button>
            </div>
          </form>
        </ModalBox>
      </DashboardLayout>
    </>
  );
}
