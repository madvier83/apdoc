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
            'accesses' => '[{"name":"admin","route":"/dashboard/admin","access":true,"submenu":[{"name":"jabatan","route":"/dashboard/admin/position","access":true},{"name":"karyawan","route":"/dashboard/admin/employee","access":true},{"name":"kategori-pembayaran","route":"/dashboard/admin/category-payment","access":true},{"name":"pembayaran","route":"/dashboard/admin/payment","access":true},{"name":"kategori-pengeluaran","route":"/dashboard/admin/category-outcome","access":true},{"name":"pengeluaran","route":"/dashboard/admin/outcome","access":true},{"name":"promosi","route":"/dashboard/admin/promotion","access":true}]},{"name":"resepsionis","route":"/dashboard/receptionist","access":true,"submenu":[{"name":"pasien","route":"/dashboard/receptionist/patient","access":true},{"name":"janji-temu","route":"/dashboard/receptionist/appointment","access":true},{"name":"antrean","route":"/dashboard/receptionist/queue","access":true}]},{"name":"dokter","route":"/dashboard/doctor","access":true,"submenu":[{"name":"diagnosa","route":"/dashboard/doctor/diagnose","access":true},{"name":"kategori-layanan","route":"/dashboard/doctor/category-service","access":true},{"name":"layanan","route":"/dashboard/doctor/service","access":true},{"name":"pasien","route":"/dashboard/doctor/patient","access":true},{"name":"antrean","route":"/dashboard/doctor/queue","access":true}]},{"name":"apotek","route":"/dashboard/pharmacy","access":true,"submenu":[{"name":"kategori-item","route":"/dashboard/pharmacy/category-item","access":true},{"name":"item","route":"/dashboard/pharmacy/item","access":true},{"name":"pasokan-item","route":"/dashboard/pharmacy/supply","access":true},{"name":"pemasok","route":"/dashboard/pharmacy/supplier","access":true},{"name":"pesanan-pembelian","route":"/dashboard/pharmacy/purchase-order","access":true},{"name":"penyesuaian-stok","route":"/dashboard/pharmacy/stock-adjustment","access":true}]},{"name":"kasir","route":"/dashboard/cashier","access":true,"submenu":[{"name":"transaksi","route":"/dashboard/cashier/transaction","access":true},{"name":"transaksi-apoteker","route":"/dashboard/cashier/apoteker","access":true},{"name":"riwayat","route":"/dashboard/cashier/history","access":true}]},{"name":"laporan","route":"/dashboard/report","access":true,"submenu":[{"name":"penjualan","route":"/dashboard/report/sales","access":true}]}]',
            'clinic_id'   => $clinic->id
        ]);
    }
}
