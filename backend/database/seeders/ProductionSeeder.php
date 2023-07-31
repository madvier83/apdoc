<?php

namespace Database\Seeders;

use App\Models\Access;
use App\Models\Clinic;
use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Laravolt\Indonesia\Seeds\CitiesSeeder;
use Laravolt\Indonesia\Seeds\VillagesSeeder;
use Laravolt\Indonesia\Seeds\DistrictsSeeder;
use Laravolt\Indonesia\Seeds\ProvincesSeeder;

class ProductionSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            StatusSeeder::class,
            ProvincesSeeder::class,
            CitiesSeeder::class,
            DistrictsSeeder::class,
            VillagesSeeder::class,
        ]);

        $clinic = Clinic::create([
            'name'        => null,
            'phone'       => null,
            'apdoc_id'    => time() . 'AP1',
            'status'      => 'active'
        ]);

        $employee = Employee::create([
            'nik'         => null,
            'name'        => 'Administrator',
            'position_id' => null,
            'birth_place' => null,
            'birth_date'  => null,
            'gender'      => null,
            'phone'       => null,
            'clinic_id'   => $clinic->id
        ]);

        User::create([
            'email'             => 'cursor.id',
            'password'          => app('hash')->make('Cursor123'),
            'role_id'           => 1,
            'phone'             => '628995754988',
            'otp_verification'  => '750587',
            'created_at_otp'    => Carbon::now(),
            'expired_otp'       => Carbon::now(),
            'email_verified_at' => Carbon::now(),
            'phone_verified_at' => Carbon::now(),
            'is_verified'       => 1,
            'apdoc_id'          => $clinic->apdoc_id,
            'employee_id'       => $employee->id
        ]);

        Access::create([
            'role_id'  => 2,
            'accesses' => '[
                {
                  name: "admin",
                  route: "/dashboard/admin",
                  access: true,
                  description:
                    "Kontrol penuh pusat. Manajemen pengguna, konfigurasi sistem, dan manajemen layanan.",
                  submenu: [
                    {
                      name: "posisi",
                      route: "/dashboard/admin/position",
                      access: true,
                      description: "Buat posisi kustom untuk karyawan.",
                    },
                    {
                      name: "karyawan",
                      route: "/dashboard/admin/employee",
                      access: true,
                      description: "Mengelola rekrutmen dan karyawan Anda.",
                    },
                    {
                      name: "kategori-pembayaran",
                      route: "/dashboard/admin/category-payment",
                      access: true,
                      description: "Mengelola kategori untuk metode pembayaran.",
                    },
                    {
                      name: "pembayaran",
                      route: "/dashboard/admin/payment",
                      access: true,
                      description: "Sesuaikan pilihan pembayaran untuk transaksi.",
                    },
                    {
                      name: "kategori-pengeluaran",
                      route: "/dashboard/admin/category-outcome",
                      access: true,
                      description: "Mengelola kategori untuk pengeluaran.",
                    },
                    {
                      name: "pengeluaran",
                      route: "/dashboard/admin/outcome",
                      access: true,
                      description:
                        "Atur pengeluaran Anda dan buat keputusan berdasarkan informasi.",
                    },
                    {
                      name: "promosi",
                      route: "/dashboard/admin/promotion",
                      access: true,
                      description:
                        "Desain dan konfigurasi diskon menarik, serta penawaran khusus untuk menarik dan melibatkan pelanggan.",
                    },
                  ],
                },
                {
                  name: "resepsionis",
                  route: "/dashboard/receptionist",
                  access: true,
                  description:
                    "Penerimaan dan penjadwalan. Mengelola data dan janji temu pasien.",
                  submenu: [
                    {
                      name: "pasien",
                      route: "/dashboard/receptionist/patient",
                      access: true,
                      description: "Mengelola data dan informasi pasien.",
                    },
                    {
                      name: "janji-temu",
                      route: "/dashboard/receptionist/appointment",
                      access: true,
                      description: "Jadwalkan dan kelola janji temu pasien.",
                    },
                    {
                      name: "antrian",
                      route: "/dashboard/receptionist/queue",
                      access: true,
                      description: "Mengelola antrian pasien dan daftar tunggu.",
                    },
                  ],
                },
                {
                  name: "dokter",
                  route: "/dashboard/doctor",
                  access: true,
                  description:
                    "Dokter. Lihat data diagnosa, layanan medis, dan catatan pasien.",
                  submenu: [
                    {
                      name: "diagnosa",
                      route: "/dashboard/doctor/diagnose",
                      access: true,
                      description: "Lihat data diagnosa dan pemeriksaan medis.",
                    },
                    {
                      name: "kategori-layanan",
                      route: "/dashboard/doctor/category-service",
                      access: true,
                      description: "Mengelola kategori untuk layanan medis.",
                    },
                    {
                      name: "layanan",
                      route: "/dashboard/doctor/service",
                      access: true,
                      description: "Mengelola layanan medis dan pengobatan.",
                    },
                    {
                      name: "pasien",
                      route: "/dashboard/doctor/patient",
                      access: true,
                      description: "Mengelola catatan pasien dan riwayat medis.",
                    },
                    {
                      name: "antrian",
                      route: "/dashboard/doctor/queue",
                      access: true,
                      description:
                        "Memantau dan mengelola antrian pasien dan daftar tunggu.",
                    },
                  ],
                },
                {
                  name: "apotek",
                  route: "/dashboard/pharmacy",
                  access: true,
                  description:
                    "Apotek. Mengelola persediaan obat, pemasok, dan pesanan pembelian.",
                  submenu: [
                    {
                      name: "kategori-item",
                      route: "/dashboard/pharmacy/category-item",
                      access: true,
                      description: "Mengelola kategori untuk barang farmasi.",
                    },
                    {
                      name: "item",
                      route: "/dashboard/pharmacy/item",
                      access: true,
                      description: "Mengelola barang farmasi dan obat-obatan.",
                    },
                    {
                      name: "pasokan-item",
                      route: "/dashboard/pharmacy/supply",
                      access: true,
                      description:
                        "Mengelola persediaan dan pengisian ulang barang farmasi.",
                    },
                    {
                      name: "pemasok",
                      route: "/dashboard/pharmacy/supplier",
                      access: true,
                      description: "Mengelola pemasok dan vendor farmasi.",
                    },
                    {
                      name: "pesanan-pembelian",
                      route: "/dashboard/pharmacy/purchase-order",
                      access: true,
                      description: "Mengelola pesanan pembelian untuk barang farmasi.",
                    },
                    {
                      name: "penyesuaian-stok",
                      route: "/dashboard/pharmacy/stock-adjustment",
                      access: true,
                      description:
                        "Mengelola penyesuaian stok dan pengendalian inventaris.",
                    },
                  ],
                },
                {
                  name: "kasir",
                  route: "/dashboard/cashier",
                  access: true,
                  description: "Kasir. Mengelola transaksi, termasuk obat dan pembayaran.",
                  submenu: [
                    {
                      name: "transaksi",
                      route: "/dashboard/cashier/transaction",
                      access: true,
                      description:
                        "Mengotomatisasi dan mengelola pertukaran, memastikan akurasi, keamanan, dan pemrosesan pembayaran yang lancar dalam transaksi.",
                    },
                    {
                      name: "transaksi-apoteker",
                      route: "/dashboard/cashier/apoteker",
                      access: true,
                      description:
                        "Mencatat, mengeluarkan, dan melacak transaksi obat untuk memastikan dosis yang akurat dan kepatuhan farmasi.",
                    },
                    {
                      name: "riwayat",
                      route: "/dashboard/cashier/history",
                      access: true,
                      description:
                        "Catatan kronologis dari semua transaksi sebelumnya, menyediakan riwayat keuangan, pembelian, dan pembayaran yang telah dibuat.",
                    },
                  ],
                },
                {
                  name: "laporan",
                  route: "/dashboard/report",
                  access: true,
                  description:
                    "Akses analisis mendalam tentang data penjualan, pendapatan, dan tren. Dapatkan wawasan berharga untuk mengoptimalkan strategi dan pertumbuhan maksimal.",
                  submenu: [
                    {
                      name: "penjualan",
                      route: "/dashboard/report/sales",
                      access: true,
                      description:
                        "Akses analisis mendalam tentang data penjualan, pendapatan, dan tren. Dapatkan wawasan berharga untuk mengoptimalkan strategi dan pertumbuhan maksimal.",
                    },
                  ],
                },
              ]',
            'clinic_id'   => $clinic->id
        ]);
    }
}
