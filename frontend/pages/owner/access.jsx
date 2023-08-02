import React, { useEffect, useState, useRef, useReducer } from "react";
import { getCookies } from "cookies-next";
import moment from "moment/moment";

import axios from "../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModalBox from "../../components/Modals/ModalBox";
import ModalDelete from "../../components/Modals/ModalDelete";
import { GetCookieChunk } from "../../services/CookieChunk";
import SelectedClinicBadge from "../../components/SelectedClinicBadge";

export default function Access() {
  const token = GetCookieChunk("token_");

  const addModalRef = useRef();
  const addModalScrollRef = useRef();
  const putModalRef = useRef();
  const putModalScrollRef = useRef();
  const detailModalRef = useRef();

  const [clinic, setClinic] = useState();

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [access, setAccess] = useState([]);
  const [accessLoading, setAccessLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(true);

  // const initialAccessForm = {
  //   clinic_id: "",
  //   role_id: "",
  //   role: "",
  //   accesses: [
  //     {
  //       name: "admin",
  //       route: "/dashboard/admin",
  //       access: false,
  //       submenu: [
  //         {
  //           name: "position",
  //           route: "/dashboard/admin/position",
  //           access: false,
  //         },
  //         {
  //           name: "employee",
  //           route: "/dashboard/admin/employee",
  //           access: false,
  //         },
  //         {
  //           name: "category-payment",
  //           route: "/dashboard/admin/category-payment",
  //           access: false,
  //         },
  //         { name: "payment", route: "/dashboard/admin/payment", access: false },
  //         {
  //           name: "category-outcome",
  //           route: "/dashboard/admin/category-outcome",
  //           access: false,
  //         },
  //         { name: "outcome", route: "/dashboard/admin/outcome", access: false },
  //         {
  //           name: "promotion",
  //           route: "/dashboard/admin/promotion",
  //           access: false,
  //         },
  //       ],
  //     },
  //     {
  //       name: "receptionist",
  //       route: "/dashboard/receptionist",
  //       access: false,
  //       submenu: [
  //         {
  //           name: "patient",
  //           route: "/dashboard/receptionist/patient",
  //           access: false,
  //         },
  //         {
  //           name: "appointment",
  //           route: "/dashboard/receptionist/appointment",
  //           access: false,
  //         },
  //         {
  //           name: "queue",
  //           route: "/dashboard/receptionist/queue",
  //           access: false,
  //         },
  //       ],
  //     },
  //     {
  //       name: "doctor",
  //       route: "/dashboard/doctor",
  //       access: false,
  //       submenu: [
  //         {
  //           name: "diagnose",
  //           route: "/dashboard/doctor/diagnose",
  //           access: false,
  //         },
  //         {
  //           name: "category-service",
  //           route: "/dashboard/doctor/category-service",
  //           access: false,
  //         },
  //         {
  //           name: "service",
  //           route: "/dashboard/doctor/service",
  //           access: false,
  //         },
  //         {
  //           name: "patient",
  //           route: "/dashboard/doctor/patient",
  //           access: false,
  //         },
  //         { name: "queue", route: "/dashboard/doctor/queue", access: false },
  //       ],
  //     },
  //     {
  //       name: "pharmacy",
  //       route: "/dashboard/pharmacy",
  //       access: false,
  //       submenu: [
  //         {
  //           name: "category-item",
  //           route: "/dashboard/pharmacy/category-item",
  //           access: false,
  //         },
  //         { name: "item", route: "/dashboard/pharmacy/item", access: false },
  //         {
  //           name: "item-supply",
  //           route: "/dashboard/pharmacy/supply",
  //           access: false,
  //         },
  //         {
  //           name: "supplier",
  //           route: "/dashboard/pharmacy/supplier",
  //           access: false,
  //         },
  //         {
  //           name: "purchase-order",
  //           route: "/dashboard/pharmacy/purchase-order",
  //           access: false,
  //         },
  //         {
  //           name: "stock-adjustment",
  //           route: "/dashboard/pharmacy/stock-adjustment",
  //           access: false,
  //         },
  //       ],
  //     },
  //     {
  //       name: "cashier",
  //       route: "/dashboard/cashier",
  //       access: false,
  //       submenu: [
  //         {
  //           name: "transaction",
  //           route: "/dashboard/cashier/transaction",
  //           access: false,
  //         },
  //         {
  //           name: "transaction apoteker",
  //           route: "/dashboard/cashier/apoteker",
  //           access: false,
  //         },
  //         {
  //           name: "history",
  //           route: "/dashboard/cashier/history",
  //           access: false,
  //         },
  //       ],
  //     },
  //     {
  //       name: "report",
  //       route: "/dashboard/report",
  //       access: false,
  //       submenu: [
  //         { name: "sales", route: "/dashboard/report/sales", access: false },
  //       ],
  //     },
  //   ],
  // };

  const initialAccessForm = {
    clinic_id: "",
    role_id: "",
    role: "",
    accesses: [
      {
        name: "admin",
        route: "/dashboard/admin",
        access: false,
        description:
          "Kontrol penuh pusat. Manajemen pengguna, konfigurasi sistem, dan manajemen layanan.",
        submenu: [
          {
            name: "jabatan",
            route: "/dashboard/admin/position",
            access: false,
            description: "Buat posisi kustom untuk karyawan.",
          },
          {
            name: "karyawan",
            route: "/dashboard/admin/employee",
            access: false,
            description: "Mengelola rekrutmen dan karyawan Anda.",
          },
          {
            name: "kategori-pembayaran",
            route: "/dashboard/admin/category-payment",
            access: false,
            description: "Mengelola kategori untuk metode pembayaran.",
          },
          {
            name: "pembayaran",
            route: "/dashboard/admin/payment",
            access: false,
            description: "Sesuaikan pilihan pembayaran untuk transaksi.",
          },
          {
            name: "kategori-pengeluaran",
            route: "/dashboard/admin/category-outcome",
            access: false,
            description: "Mengelola kategori untuk pengeluaran.",
          },
          {
            name: "pengeluaran",
            route: "/dashboard/admin/outcome",
            access: false,
            description: "Atur pengeluaran Anda dan buat keputusan berdasarkan informasi.",
          },
          {
            name: "promosi",
            route: "/dashboard/admin/promotion",
            access: false,
            description:
              "Desain dan konfigurasi diskon menarik, serta penawaran khusus untuk menarik dan melibatkan pelanggan.",
          },
        ],
      },
      {
        name: "resepsionis",
        route: "/dashboard/receptionist",
        access: false,
        description:
          "Penerimaan dan penjadwalan. Mengelola data dan janji temu pasien.",
        submenu: [
          {
            name: "pasien",
            route: "/dashboard/receptionist/patient",
            access: false,
            description: "Mengelola data dan informasi pasien.",
          },
          {
            name: "janji-temu",
            route: "/dashboard/receptionist/appointment",
            access: false,
            description: "Jadwalkan dan kelola janji temu pasien.",
          },
          {
            name: "antrian",
            route: "/dashboard/receptionist/queue",
            access: false,
            description: "Mengelola antrian pasien dan daftar tunggu.",
          },
        ],
      },
      {
        name: "dokter",
        route: "/dashboard/doctor",
        access: false,
        description:
          "Dokter. Lihat data diagnosa, layanan medis, dan catatan pasien.",
        submenu: [
          {
            name: "diagnosa",
            route: "/dashboard/doctor/diagnose",
            access: false,
            description: "Lihat data diagnosa dan pemeriksaan medis.",
          },
          {
            name: "kategori-layanan",
            route: "/dashboard/doctor/category-service",
            access: false,
            description: "Mengelola kategori untuk layanan medis.",
          },
          {
            name: "layanan",
            route: "/dashboard/doctor/service",
            access: false,
            description: "Mengelola layanan medis dan pengobatan.",
          },
          {
            name: "pasien",
            route: "/dashboard/doctor/patient",
            access: false,
            description: "Mengelola catatan pasien dan riwayat medis.",
          },
          {
            name: "antrian",
            route: "/dashboard/doctor/queue",
            access: false,
            description: "Memantau dan mengelola antrian pasien dan daftar tunggu.",
          },
        ],
      },
      {
        name: "apotek",
        route: "/dashboard/pharmacy",
        access: false,
        description:
          "Apotek. Mengelola persediaan obat, pemasok, dan pesanan pembelian.",
        submenu: [
          {
            name: "kategori-item",
            route: "/dashboard/pharmacy/category-item",
            access: false,
            description: "Mengelola kategori untuk barang farmasi.",
          },
          {
            name: "item",
            route: "/dashboard/pharmacy/item",
            access: false,
            description: "Mengelola barang farmasi dan obat-obatan.",
          },
          {
            name: "pasokan-item",
            route: "/dashboard/pharmacy/supply",
            access: false,
            description: "Mengelola persediaan dan pengisian ulang barang farmasi.",
          },
          {
            name: "pemasok",
            route: "/dashboard/pharmacy/supplier",
            access: false,
            description: "Mengelola pemasok dan vendor farmasi.",
          },
          {
            name: "pesanan-pembelian",
            route: "/dashboard/pharmacy/purchase-order",
            access: false,
            description: "Mengelola pesanan pembelian untuk barang farmasi.",
          },
          {
            name: "penyesuaian-stok",
            route: "/dashboard/pharmacy/stock-adjustment",
            access: false,
            description: "Mengelola penyesuaian stok dan pengendalian inventaris.",
          },
        ],
      },
      {
        name: "kasir",
        route: "/dashboard/cashier",
        access: false,
        description:
          "Kasir. Mengelola transaksi, termasuk obat dan pembayaran.",
        submenu: [
          {
            name: "transaksi",
            route: "/dashboard/cashier/transaction",
            access: false,
            description:
              "Mengotomatisasi dan mengelola pertukaran, memastikan akurasi, keamanan, dan pemrosesan pembayaran yang lancar dalam transaksi.",
          },
          {
            name: "transaksi-apoteker",
            route: "/dashboard/cashier/apoteker",
            access: false,
            description:
              "Mencatat, mengeluarkan, dan melacak transaksi obat untuk memastikan dosis yang akurat dan kepatuhan farmasi.",
          },
          {
            name: "riwayat",
            route: "/dashboard/cashier/history",
            access: false,
            description:
              "Catatan kronologis dari semua transaksi sebelumnya, menyediakan riwayat keuangan, pembelian, dan pembayaran yang telah dibuat.",
          },
        ],
      },
      {
        name: "laporan",
        route: "/dashboard/report",
        access: false,
        description:
          "Akses analisis mendalam tentang data penjualan, pendapatan, dan tren. Dapatkan wawasan berharga untuk mengoptimalkan strategi dan pertumbuhan maksimal.",
        submenu: [
          {
            name: "penjualan",
            route: "/dashboard/report/sales",
            access: false,
            description:
              "Akses analisis mendalam tentang data penjualan, pendapatan, dan tren. Dapatkan wawasan berharga untuk mengoptimalkan strategi dan pertumbuhan maksimal.",
          },
        ],
      },
    ],
  };
  
  

  const [addForm, setAddForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialAccessForm
  );
  const [addFormError, setAddFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialAccessForm
  );
  const [putForm, setPutForm] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialAccessForm
  );
  const [putFormError, setPutFormError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialAccessForm
  );

  const handleAddInput = (event) => {
    const { name, value } = event.target;
    setAddForm({ [name]: value });
  };
  const handlePutInput = (event) => {
    const { name, value } = event.target;
    setPutForm({ [name]: value });
  };

  async function getUser() {
    if (!clinic) {
      return;
    }
    try {
      const response = await axios.get(`accesses/${clinic}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setUsers(response.data);
      setUsersLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSelection(toggle) {
    // console.log(toggle.submenu == null)
    const prevAccess = addForm.accesses;
    let newAccess = [];
    let submenu = [];
    // let trueCount = false;
    if (toggle.submenu != null) {
      submenu = [];
      prevAccess.map((menu) => {
        if (menu == toggle) {
          menu.submenu.map((obj) => {
            submenu.push({ ...obj, access: !menu.access });
          });
          // submenu = menu.submenu
          newAccess.push({ ...menu, access: !menu.access, submenu: submenu });
        } else {
          newAccess.push(menu);
        }
      });
    } else {
      prevAccess.map((menu) => {
        submenu = [];
        // trueCount = false;
        menu.submenu.map((obj) => {
          if (obj == toggle) {
            submenu.push({ ...obj, access: !obj.access });
          } else {
            submenu.push(obj);
          }
        });
        newAccess.push({ ...menu, submenu });
      });
    }
    // console.log(newAccess);
    setAddForm({ accesses: newAccess });
  }

  function handlePutSelection(toggle) {
    // console.log(toggle.submenu == null)
    const prevAccess = putForm.accesses;
    let newAccess = [];
    let submenu = [];
    // let trueCount = false;
    if (toggle.submenu != null) {
      submenu = [];
      prevAccess.map((menu) => {
        if (menu == toggle) {
          menu.submenu.map((obj) => {
            submenu.push({ ...obj, access: !menu.access });
          });
          // submenu = menu.submenu
          newAccess.push({ ...menu, access: !menu.access, submenu: submenu });
        } else {
          newAccess.push(menu);
        }
      });
    } else {
      prevAccess.map((menu) => {
        submenu = [];
        // trueCount = false;
        menu.submenu.map((obj) => {
          if (obj == toggle) {
            submenu.push({ ...obj, access: !obj.access });
          } else {
            submenu.push(obj);
          }
        });
        newAccess.push({ ...menu, submenu });
      });
    }
    // console.log(newAccess);
    setPutForm({ accesses: newAccess });
  }

  async function addRole(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/access`,
        { ...addForm, accesses: JSON.stringify(addForm.accesses) },
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setAddForm(initialAccessForm);
      setAddForm({ clinic_id: clinic });
      setAddFormError(initialAccessForm);
      addModalRef.current.click();
      getUser();
    } catch (err) {
      setAddFormError(err.response?.data);
      console.error(err);
    }
  }

  async function putRole(e) {
    console.log(putForm);
    e.preventDefault();
    try {
      const response = await axios.put(
        `/access/${putForm.role_id}`,
        { ...putForm, accesses: JSON.stringify(putForm.accesses) },
        {
          headers: {
            Authorization: "Bearer" + token,
          },
        }
      );
      // console.log(response);
      setPutForm(initialAccessForm);
      setPutFormError(initialAccessForm);
      putModalRef.current.click();
      getUser();
    } catch (err) {
      setPutFormError(err.response?.data);
      console.error(err);
    }
  }

  async function deleteRole(id) {
    // console.log(putForm);
    try {
      const response = await axios.delete(`/access/${id}`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      console.log(response);
      setPutForm(initialAccessForm);
      setPutFormError(initialAccessForm);
      // putModalRef.current.click();
      getUser();
    } catch (err) {
      setPutFormError(err.response?.data);
      console.error(err);
    }
  }

  useEffect(() => {
    getUser();
    setAccessLoading(true);
    setAddForm({ clinic_id: clinic });
  }, [clinic]);

  useEffect(() => {
    getUser();
  }, []);

  // console.log(users);

  return (
    <>
      <DashboardLayout title="Akses User" clinic={clinic} setClinic={setClinic}>
        <div className="flex gap-4">
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full mt-6 min-h-fit shadow-lg rounded-md text-blueGray-700 bg-white"
            }
          >
            <div className="rounded-t mb-0 px-4 py-4 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className={"font-semibold text-lg "}>
                    <i className="fas fa-filter mr-3"></i> Akses User
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <label
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    htmlFor="modal-add"
                    onClick={() => {
                      addModalScrollRef.current.scroll({
                        top: 0,
                        // behavior: "smooth",
                      });
                    }}
                  >
                    tambah <i className="fas fa-add"></i>
                  </label>
                </div>
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
                      Role
                    </th>
                    {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Email
                    </th> */}
                    {/* <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Created At
                    </th>
                    <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Updated At
                    </th> */}
                    <th className="px-6 align-middle py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-100 text-blueGray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading && (
                    <tr>
                      <td colSpan={99}>
                        <div className="flex w-full justify-center my-4">
                          <img src="/loading.svg" alt="now loading" />
                        </div>
                      </td>
                    </tr>
                  )}
                  {!usersLoading && users?.length <= 0 && (
                    <tr>
                      <td colSpan={99}>
                        <div className="flex w-full justify-center mt-48">
                          <div className="text-center">
                            <h1 className="text-xl">No data found</h1>
                            <small>
                              Data is empty or try adjusting your filter
                            </small>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {users?.map((obj, index) => {
                    return (
                      <tr key={obj.id} className="hover:bg-zinc-50">
                        <th className="border-t-0 pl-6 border-l-0 border-r-0 text-xs whitespace-nowrap text-left py-4 flex items-center">
                          <span className={"ml-3 font-bold"}>{index + 1}</span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <span className={"font-bold"}>
                            {obj.role?.name || "-"}
                          </span>
                        </td>
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          <span className={""}>{obj.email}</span>
                        </td> */}
                        {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          {moment(obj.created_at).format("DD MMM YYYY")}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          {moment(obj.updated_at).fromNow()}
                        </td> */}
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                          {/* <div className="tooltip tooltip-left" data-tip="Detail">
                          <label
                            className="bg-violet-500 text-white active:bg-violet-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            htmlFor="modal-details"
                            onClick={() => {
                              setPutForm(obj);
                              setPutFormError(initialAccessForm);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </label>
                        </div> */}
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Settings"
                          >
                            <label
                              className="bg-blue-400 text-white active:bg-emerald-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              htmlFor="modal-put"
                              onClick={() => {
                                setPutForm({
                                  role_id: obj.id,
                                  role: obj.role?.name,
                                  accesses: JSON.parse(obj.accesses),
                                });
                                putModalScrollRef.current.scroll({
                                  top: 0,
                                  // behavior: "smooth",
                                });
                              }}
                            >
                              <i className="fas fa-cog"></i>
                            </label>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Delete"
                          >
                            <label
                              className="bg-rose-400 text-white active:bg-rose-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              htmlFor={obj.id}
                            >
                              <i className="fas fa-trash"></i>
                            </label>
                          </div>
                          <ModalDelete
                            id={obj.id}
                            callback={() => deleteRole(obj.id)}
                            title={`Hapus role?`}
                          ></ModalDelete>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* <div className="bg-white w-1/2 min-h-[80vh] mt-6 rounded-md">
            <div className="rounded-t mb-0 px-4 py-4 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className={"font-semibold text-lg "}>
                    <i className="fas fa-cog mr-3"></i>Access Settings
                  </h3>
                </div>
              </div>
            </div>
            <div className="h-[80vh] overflow-y-scroll">
              <div className="block w-full h-min px-8 pb-8">
                {accessDummy.map((menu) => {
                  return (
                    <div className="">
                      <label
                        htmlFor={menu.route}
                        className="capitalize select-none cursor-pointer"
                      >
                        <div className="flex items-center justify-between px-4">
                          <h1 className="font-semibold py-4">{menu.name}</h1>
                          <input
                            type="checkbox"
                            id={menu.route}
                            className="focus:ring-0 focus:ring-offset-0"
                          />
                        </div>
                        {menu.submenu.map((obj) => {
                          return (
                            <label
                              htmlFor={obj.route}
                              className="flex items-center justify-between border-t border-b px-4 hover:bg-emerald-100 duration-300 transition-all"
                            >
                              <h2 className="pl-8 py-2">{obj.name}</h2>
                              <input
                                type="checkbox"
                                id={obj.route}
                                className="focus:ring-0 focus:ring-offset-0"
                              />
                            </label>
                          );
                        })}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div> */}
        </div>
      </DashboardLayout>

      <ModalBox id="modal-put">
        <form onSubmit={putRole} autoComplete="off">
          <div className="overflow-y-scroll h-[75vh]" ref={putModalScrollRef}>
            <h3 className="font-bold text-lg mb-4">Edit role user</h3>
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nama</span>
              </label>
              <input
                type="text"
                name="role"
                value={putForm.role}
                onChange={(e) => handlePutInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {putFormError.role && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {putFormError.role}
                  </span>
                </label>
              )}
            </div>
            <h1 className="mt-4 mb-2">Akses</h1>
            {putForm.accesses?.map((menu) => {
              return (
                <div className="mb-4" key={menu.route}>
                  <label
                    htmlFor={menu.name}
                    className="capitalize select-none cursor-pointer"
                  >
                    <div className="flex items-center justify-between px-4">
                      <h1 className="font-semibold py-4">{menu.name}</h1>
                      <small className="text-right ml-auto mr-2 text-xs lowercase opacity-50">
                        {/* {menu.route} */}
                      </small>
                      <input
                        type="checkbox"
                        checked={menu.access}
                        onChange={() => {
                          handlePutSelection(menu);
                        }}
                        id={menu.name}
                        className="focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                    </div>
                    {menu.submenu.map((obj) => {
                      return (
                        <label
                          key={obj.route}
                          htmlFor={obj.route}
                          className={`${
                            menu.access == false || obj.access == false
                              ? "opacity-25 cursor-pointer"
                              : "cursor-pointer"
                          } flex items-center justify-between border-t border-b px-4 hover:bg-zinc-100 duration-300 transition-all`}
                        >
                          <div className="pl-4 py-2">
                            <h2 className="">{obj.name}</h2>
                            <small className="text-right ml-auto mr-2 text-xs lowercase opacity-50">
                              {obj.description}
                            </small>
                          </div>
                          <input
                            type="checkbox"
                            checked={obj.access}
                            onChange={() => {
                              handlePutSelection(obj);
                            }}
                            disabled={menu.access == false}
                            id={obj.route}
                            className="focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                        </label>
                      );
                    })}
                  </label>
                </div>
              );
            })}
          </div>
          <div className="modal-action rounded-sm">
            <label
              htmlFor="modal-put"
              ref={putModalRef}
              className="btn btn-ghost rounded-md"
            >
              Batalkan
            </label>
            <button className="btn btn-success text-black rounded-md">
              Simpan
            </button>
          </div>
        </form>
      </ModalBox>

      <ModalBox id="modal-add">
        <form onSubmit={addRole} autoComplete="off">
          <div className="overflow-y-scroll h-[75vh]" ref={addModalScrollRef}>
            <h3 className="font-bold text-lg mb-4 flex justify-between">
              Tambah role user
              <SelectedClinicBadge></SelectedClinicBadge>
            </h3>
            <input type="hidden" autoComplete="off" />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nama</span>
              </label>
              <input
                type="text"
                name="role"
                value={addForm.role}
                onChange={(e) => handleAddInput(e)}
                placeholder=""
                className="input input-bordered input-primary border-slate-300 w-full"
              />
              {addFormError.role && (
                <label className="label">
                  <span className="label-text-alt text-rose-300">
                    {addFormError.role}
                  </span>
                </label>
              )}
            </div>
            <h1 className="mt-4 mb-2">Akses</h1>
            {addForm?.accesses?.map((menu) => {
              return (
                <div className="mb-4" key={menu.route}>
                  <label
                    htmlFor={menu.route}
                    className="capitalize select-none cursor-pointer"
                  >
                    <div className="flex items-center justify-between px-4">
                      <h1 className="font-semibold py-4">{menu.name}</h1>
                      <small className="text-right ml-auto mr-2 text-xs lowercase opacity-50">
                        {/* {menu.route} */}
                      </small>
                      <input
                        type="checkbox"
                        checked={menu.access}
                        onChange={() => {
                          handleSelection(menu);
                        }}
                        id={menu.route}
                        className="focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                    </div>
                    {menu.submenu.map((obj) => {
                      return (
                        <label
                          key={obj.route}
                          htmlFor={obj.route + "add"}
                          className={`${
                            menu.access == false || obj.access == false
                              ? "opacity-40 cursor-pointer"
                              : "cursor-pointer"
                          } flex items-center justify-between border-t border-b px-4 hover:bg-zinc-100 duration-300 transition-all`}
                        >
                          <div className="pl-4 py-2">
                            <h2 className="">{obj.name}</h2>
                            <small className="normal-case text-right ml-auto mr-2 text-xs opacity-50">
                              {obj.description}
                            </small>
                          </div>
                          <input
                            type="checkbox"
                            checked={obj.access}
                            onChange={() => {
                              handleSelection(obj);
                            }}
                            disabled={menu.access == false}
                            id={obj.route + "add"}
                            className="focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                        </label>
                      );
                    })}
                  </label>
                </div>
              );
            })}
          </div>
          <div className="modal-action rounded-sm">
            <label
              htmlFor="modal-add"
              ref={addModalRef}
              className="btn btn-ghost rounded-md"
            >
              Batalkan
            </label>
            <button className="btn btn-primary rounded-md">Tambah</button>
          </div>
        </form>
      </ModalBox>
    </>
  );
}
