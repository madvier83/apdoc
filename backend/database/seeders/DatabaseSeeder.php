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
            'accesses' => '[{"name":"admin","route":"/dashboard/admin","access":true,"submenu":[{"name":"jabatan","route":"/dashboard/admin/position","access":true},{"name":"karyawan","route":"/dashboard/admin/employee","access":true},{"name":"kategori-pembayaran","route":"/dashboard/admin/category-payment","access":true},{"name":"pembayaran","route":"/dashboard/admin/payment","access":true},{"name":"kategori-pengeluaran","route":"/dashboard/admin/category-outcome","access":true},{"name":"pengeluaran","route":"/dashboard/admin/outcome","access":true},{"name":"promosi","route":"/dashboard/admin/promotion","access":true}]},{"name":"resepsionis","route":"/dashboard/receptionist","access":true,"submenu":[{"name":"pasien","route":"/dashboard/receptionist/patient","access":true},{"name":"janji-temu","route":"/dashboard/receptionist/appointment","access":true},{"name":"antrean","route":"/dashboard/receptionist/queue","access":true}]},{"name":"dokter","route":"/dashboard/doctor","access":true,"submenu":[{"name":"diagnosa","route":"/dashboard/doctor/diagnose","access":true},{"name":"kategori-layanan","route":"/dashboard/doctor/category-service","access":true},{"name":"layanan","route":"/dashboard/doctor/service","access":true},{"name":"pasien","route":"/dashboard/doctor/patient","access":true},{"name":"antrean","route":"/dashboard/doctor/queue","access":true}]},{"name":"apotek","route":"/dashboard/pharmacy","access":true,"submenu":[{"name":"kategori-item","route":"/dashboard/pharmacy/category-item","access":true},{"name":"item","route":"/dashboard/pharmacy/item","access":true},{"name":"pasokan-item","route":"/dashboard/pharmacy/supply","access":true},{"name":"pemasok","route":"/dashboard/pharmacy/supplier","access":true},{"name":"pesanan-pembelian","route":"/dashboard/pharmacy/purchase-order","access":true},{"name":"penyesuaian-stok","route":"/dashboard/pharmacy/stock-adjustment","access":true}]},{"name":"kasir","route":"/dashboard/cashier","access":true,"submenu":[{"name":"transaksi","route":"/dashboard/cashier/transaction","access":true},{"name":"transaksi-apoteker","route":"/dashboard/cashier/apoteker","access":true},{"name":"riwayat","route":"/dashboard/cashier/history","access":true}]},{"name":"laporan","route":"/dashboard/report","access":true,"submenu":[{"name":"penjualan","route":"/dashboard/report/sales","access":true}]}]',
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
