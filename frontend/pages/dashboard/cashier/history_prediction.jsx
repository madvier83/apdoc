import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";
import "moment/locale/id";
moment.locale("id");

import axios from "../../api/axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ModalBox from "../../../components/Modals/ModalBox";
import numeral from "numeral";
import ModalDelete from "../../../components/Modals/ModalDelete";
import Loading from "../../../components/loading";
import { GetCookieChunk } from "../../../services/CookieChunk";
import PrediksiWaktuTunggu from "../../../components/PrediksiWaktuTunggu";

export default function History() {
  const token = GetCookieChunk("token_");

  const tableRef = useRef();

  const [clinic, setClinic] = useState();

  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState(false);

  const [item, setItem] = useState([]);
  const [itemLoading, setItemLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState({});

  async function getItem() {
    if (!clinic) {
      return;
    }
    setItemLoading(true)
    try {
      const response = await axios.get(
        `queues-prediction/${clinic && clinic}`,
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
      setItem({})
      setItemLoading(false);
    }
  }

  async function cancelTransaction(id) {
    try {
      const response = await axios.put(
        `transaction/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      getItem();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const getData = setTimeout(() => {
      getItem();
    }, 300);

    if (page > item?.last_page) {
      setPage(item.last_page);
    }

    return () => clearTimeout(getData);
  }, [page, perpage, search, clinic, sortBy, order]);

  useEffect(() => {
    tableRef.current.scroll({
      top: 0,
    });
  }, [item]);

  useEffect(() => {
    setSearch("");
    setPage(1);
  }, [clinic]);

  useEffect(() => {
    getItem();
  }, []);

  // console.log(item)

  return (
    <>
      <DashboardLayout title="Riwayat Antrean" clinic={clinic} setClinic={setClinic}>
        <div className="flex gap-4">
          <div className="mt-6 min-h-fit w-[60vw] bg-blue">
            <PrediksiWaktuTunggu
              listAntrean={item}
            />
          </div>
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
            }
          >
            <div className="rounded-t mb-0 px-4 py-4 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className={"font-semibold text-lg "}>
                    <i className="fas fa-filter mr-3"></i> Riwayat Antrean
                  </h3>
                </div>

                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                </div>
              </div>
            </div>
            <div
              ref={tableRef}
              className="h-[75vh] w-full overflow-x-auto flex flex-col justify-between"
            >
              <table className="items-center w-full bg-transparent border-collapse overflow-auto">
          
                <tbody>
                  <Loading
                    data={item}
                    dataLoading={itemLoading}
                    reload={getItem}
                  ></Loading>
                  {!itemLoading &&
                    (() => {
                      // Variabel pembantu untuk melacak tanggal baris sebelumnya
                      let lastDate = null;

                      return item?.map((obj, index) => {
                        // Ambil tanggal dalam format tertentu untuk perbandingan (misal: "20 Juni 2026")
                        const currentDate = moment(obj.created_at).format("DD MMMM YYYY");

                        // Cek apakah tanggal saat ini berbeda dengan tanggal sebelumnya
                        const showDivider = currentDate !== lastDate;

                        // Perbarui tanggal terakhir dengan tanggal saat ini
                        lastDate = currentDate;

                        return (
                          <React.Fragment key={obj.id}>
                            {showDivider && (
                              <tr className="bg-zinc-100">
                                <td colSpan="8" className="px-6 py-2 text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-t border-zinc-200">
                                  <i className="far fa-calendar-alt mr-2"></i>
                                  {new Date(currentDate).toLocaleDateString('id-ID', { weekday: 'long' })}, {currentDate}
                                </td>
                              </tr>
                            )}

                            {/* Baris Data Antrean */}
                            <tr className="hover:bg-zinc-50">
                              {/* Nomor Urut */}
                              <th className="border-t-0 pl-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4 text-left">
                                <span className="ml-3 font-bold">
                                  {index + (item.from || 1)}
                                </span>
                              </th>

                              {/* Nomor Tiket Antrean */}
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 font-bold text-violet-600 text-center">
                                {obj.queue_number || "-"}
                              </td>

                              {/* Nama Pasien & Jenis Kelamin */}
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                <i
                                  className={`text-md mr-2 ${!obj.patient && "hidden"} ${obj.patient?.gender === "male"
                                      ? "text-blue-400 fas fa-mars"
                                      : "text-pink-400 fas fa-venus"
                                    }`}
                                ></i>{" "}
                                <span className="font-bold">
                                  {obj.patient?.name || "Apoteker"}
                                </span>
                              </td>

                              {/* Status Antrean */}
                              {/* <td className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 text-left">
                                <span className="ml-3">
                                  <i
                                    className={`fas fa-circle mr-2 ${obj.status_id === 3 ? "text-emerald-400" : "text-orange-500"
                                      }`}
                                  ></i>{" "}
                                  {obj.status_id === 3 ? "Completed" : "Waiting/Process"}
                                </span>
                              </td> */}

                              {/* Tanggal Masuk & Jam Selesai Antrean */}
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                <div>
                                  <span className="font-medium text-zinc-500">Masuk:</span>{" "}
                                  {moment(obj.created_at).format("HH:mm")} WIB
                                </div>
                                <div className="mt-1">
                                  <span className="font-medium text-zinc-500">Selesai:</span>{" "}
                                  {obj.status_id === 3 ? (
                                    <span className="text-emerald-600 font-semibold">
                                      {moment(obj.updated_at).format("HH:mm")} WIB
                                    </span>
                                  ) : (
                                    <span className="text-zinc-400 italic">Belum selesai</span>
                                  )}
                                </div>
                              </td>

                              {/* Durasi Pelayanan / Waktu Tunggu Riil */}
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 font-semibold text-emerald-600">
                                {(() => {
                                  const masuk = moment(obj.created_at);
                                  const updateStatus = moment(obj.updated_at);
                                  const durasiMenit = updateStatus.diff(masuk, "minutes");

                                  if (obj.status_id !== 3 || durasiMenit < 0) {
                                    return <span className="text-zinc-400 italic">Sedang mengantre...</span>;
                                  }

                                  if (durasiMenit < 1) {
                                    return "Kurang dari 1 menit";
                                  } else if (durasiMenit >= 60) {
                                    const jam = Math.floor(durasiMenit / 60);
                                    const sisaMenit = durasiMenit % 60;
                                    return `${jam} jam ${sisaMenit} menit`;
                                  } else {
                                    return `${durasiMenit} menit`;
                                  }
                                })()}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      });
                    })()
                  }
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
