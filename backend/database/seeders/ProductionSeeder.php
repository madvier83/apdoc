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
            'address'     => null,
            'province'    => null,
            'city'        => null,
            'district'    => null,
            'postal_code' => null,
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
            'address'     => null,
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

        Access::create([
            'role_id'  => 2,
            'accesses' => '[{"name":"admin","route":"/dashboard/admin","access":true,"submenu":[{"name":"position","route":"/dashboard/admin/position","access":true},{"name":"employee","route":"/dashboard/admin/employee","access":true},{"name":"category-payment","route":"/dashboard/admin/category-payment","access":true},{"name":"payment","route":"/dashboard/admin/payment","access":true},{"name":"category-outcome","route":"/dashboard/admin/category-outcome","access":true},{"name":"outcome","route":"/dashboard/admin/outcome","access":true},{"name":"promotion","route":"/dashboard/admin/promotion","access":true}]},{"name":"receptionist","route":"/dashboard/receptionist","access":true,"submenu":[{"name":"patient","route":"/dashboard/receptionist/patient","access":true},{"name":"appointment","route":"/dashboard/receptionist/appointment","access":true},{"name":"queue","route":"/dashboard/receptionist/queue","access":true}]},{"name":"doctor","route":"/dashboard/doctor","access":true,"submenu":[{"name":"diagnose","route":"/dashboard/doctor/diagnose","access":true},{"name":"category-service","route":"/dashboard/doctor/category-service","access":true},{"name":"service","route":"/dashboard/doctor/service","access":true},{"name":"patient","route":"/dashboard/doctor/patient","access":true},{"name":"queue","route":"/dashboard/doctor/queue","access":true}]},{"name":"pharmacy","route":"/dashboard/pharmacy","access":true,"submenu":[{"name":"category-item","route":"/dashboard/pharmacy/category-item","access":true},{"name":"item","route":"/dashboard/pharmacy/item","access":true},{"name":"item-supply","route":"/dashboard/pharmacy/supply","access":true},{"name":"supplier","route":"/dashboard/pharmacy/supplier","access":true},{"name":"purchase-order","route":"/dashboard/pharmacy/purchase-order","access":true},{"name":"stock-adjustment","route":"/dashboard/pharmacy/stock-adjustment","access":true}]},{"name":"cashier","route":"/dashboard/cashier","access":true,"submenu":[{"name":"transaction","route":"/dashboard/cashier/transaction","access":true},{"name":"history","route":"/dashboard/cashier/history","access":true}]},{"name":"report","route":"/dashboard/report","access":true,"submenu":[{"name":"sales","route":"/dashboard/report/sales","access":true}]}]',
            'clinic_id'   => $clinic->id
        ]);
    }
}
