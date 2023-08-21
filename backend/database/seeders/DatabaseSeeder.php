<?php

namespace Database\Seeders;

use App\Models\Access;
use App\Models\CategoryItem;
use App\Models\CategoryService;
use App\Models\Clinic;
use App\Models\Diagnose;
use App\Models\Employee;
use App\Models\Item;
use App\Models\Patient;
use App\Models\Position;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserSlot;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
// Laravolt Package Location Services
use Laravolt\Indonesia\Seeds\CitiesSeeder;
use Laravolt\Indonesia\Seeds\VillagesSeeder;
use Laravolt\Indonesia\Seeds\DistrictsSeeder;
use Laravolt\Indonesia\Seeds\ProvincesSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            DummySeeder::class,
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
            'birth_place' => null,
            'birth_date'  => null,
            'gender'      => null,
            'phone'       => null,
            'position_id' => null,
            'clinic_id'   => $clinic->id
        ]);

        User::create([
            'email'             => 'cursor.id',
            'password'          => app('hash')->make('Cursor123'),
            'role_id'           => 1,
            'phone'             => '+6289518223591',
            'otp_verification'  => '750587',
            'created_at_otp'    => Carbon::now(),
            'expired_otp'       => Carbon::now(),
            'email_verified_at' => Carbon::now(),
            'phone_verified_at' => Carbon::now(),
            'is_verified'       => 1,
            'apdoc_id'          => $clinic->apdoc_id,
            'employee_id'       => $employee->id
        ]);

        // Klinik ke-1 Ngafee

        $clinic = Clinic::create([
            'name'        => 'Ngafee',
            'phone'       => '628995754988',
            'province_id' => 12,
            'city_id'     => 181,
            'district_id' => 2557,
            'village_id'  => 31432,
            'address'     => "Jl. Dalem Kaum No. 112",
            'rt'          => "03",
            'rw'          => "03",
            'postal_code' => "40261",
            'apdoc_id'    => time() . 'AP2',
            'status'      => 'active'
        ]);

        Setting::create([
            'logo'        => null,
            'name'        => 'Cursor ID',
            'phone'       => '6282376932441',
            'province_id' => 12,
            'city_id'     => 181,
            'district_id' => 2557,
            'village_id'  => 31432,
            'address'     => "Jl. Dalem Kaum No. 112",
            'rt'          => "03",
            'rw'          => "03",
            'postal_code' => "40261",
            'clinic_id'   => $clinic->id
        ]);

        // free slot
        for ($i = 0; $i < 10; $i++) {
            UserSlot::create([
                'clinic_id' => $clinic->id
            ]);
        }

        // Klinik ke-2 Umanis

        $clinic = Clinic::create([
            'name'        => 'ZStore',
            'phone'       => '628995754988',
            'province_id' => 12,
            'city_id'     => 164,
            'district_id' => 2116,
            'village_id'  => 27017,
            'address'     => "Jl. Kopo Sayati Gg. Narsani",
            'rt'          => "03",
            'rw'          => "03",
            'postal_code' => "40228",
            'apdoc_id'    => $clinic->apdoc_id,
            'status'      => 'active'
        ]);

        Setting::create([
            'logo'        => null,
            'name'        => 'Umanis Klinik',
            'phone'       => '6282376932441',
            'province_id' => 12,
            'city_id'     => 164,
            'district_id' => 2116,
            'village_id'  => 27017,
            'address'     => "Jl. Kopo Sayati Gg. Narsani",
            'rt'          => "03",
            'rw'          => "03",
            'postal_code' => "40228",
            'clinic_id'   => $clinic->id
        ]);

        // free slot
        for ($i = 0; $i < 10; $i++) {
            UserSlot::create([
                'clinic_id' => $clinic->id
            ]);
        }

        $employee = Employee::create([
            'nik'         => '21110533',
            'name'        => 'M Advie Rifaldy',
            'position_id' => 1,
            'birth_place' => 'Bandung',
            'birth_date'  => '2002-07-09',
            'gender'      => 'male',
            'phone'       => '+6282376932445',
            'province_id' => 12,
            'city_id'     => 164,
            'district_id' => 2116,
            'village_id'  => 27017,
            'address'     => "Jl. Kopo Sayati Gg. Narsani",
            'rt'          => "03",
            'rw'          => "03",
            'postal_code' => "40228",
            'clinic_id'   => 2
        ]);

        User::create([
            'email'             => 'madvier83@gmail.com',
            'password'          => app('hash')->make('adminadmin'),
            'role_id'           => 2,
            'phone'             => '+6282376932445',
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
                      name: "jabatan",
                      route: "/dashboard/admin/position",
                      access: true,
                      description: "Buat jabatan kustom untuk karyawan.",
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
                      name: "antrean",
                      route: "/dashboard/receptionist/queue",
                      access: true,
                      description: "Mengelola antrean pasien dan daftar tunggu.",
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
                      name: "antrean",
                      route: "/dashboard/doctor/queue",
                      access: true,
                      description:
                        "Memantau dan mengelola antrean pasien dan daftar tunggu.",
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

        // User::factory(10)->create();
        // Clinic::factory(10)->create();
        Employee::factory(100)->create();
        Position::factory(100)->create();
        Diagnose::factory(100)->create();
        CategoryService::factory(50)->create();
        Service::factory(100)->create();
        Patient::factory(100)->create();
        CategoryItem::factory(50)->create();
        Item::factory(100)->create();
    }
}
