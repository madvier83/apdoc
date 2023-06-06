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

        // Klinik ke-1 Ngafee

        $clinic = Clinic::create([
            'name'        => 'Ngafee',
            'address'     => 'Jl. Dalem Kaum no. 112',
            'province'    => 'Jawa Barat',
            'city'        => 'Kota Bandung',
            'district'    => 'Lengkong',
            'postal_code' => '40261',
            'phone'       => '628995754988',
            'apdoc_id'    => time() . 'AP2',
            'status'      => 'active'
        ]);

        Setting::create([
			'logo'        => null,
            'name'        => 'Cursor ID',
            'phone'       => '628995754988',
            'address'     => 'Jl. Dalem Kaum',
            'city'        => 'Bandung',
            'country'     => 'Jawa Barat',
            'postal_code' => '40228',
            'clinic_id'   => $clinic->id
		]);

        // free slot
        for($i=0; $i<10; $i++) {
            UserSlot::create([
                'clinic_id' => $clinic->id
            ]);
        }

        // Klinik ke-2 Umanis

        $clinic = Clinic::create([
            'name'        => 'Umanis Klinik',
            'address'     => 'Jl. Kopo Sayati',
            'province'    => 'Jawa Barat',
            'city'        => 'Bandung',
            'district'    => 'Margahayu',
            'postal_code' => '40228',
            'phone'       => '6282376932441',
            'apdoc_id'    => $clinic->apdoc_id,
            'status'      => 'active'
        ]);

        Setting::create([
			'logo'        => null,
            'name'        => 'Umanis Klinik',
            'phone'       => '6282376932441',
            'address'     => 'Jl. Kopo Sayati',
            'city'        => 'Bandung',
            'country'     => 'Jawa Barat',
            'postal_code' => '40228',
            'clinic_id'   => $clinic->id
		]);

        // free slot
        for($i=0; $i<10; $i++) {
            UserSlot::create([
                'clinic_id' => $clinic->id
            ]);
        }

        $employee = Employee::create([
            'nik'         => '21110533',
            'name'        => 'M Advie Rifaldy',
            'birth_place' => 'Bandung',
            'birth_date'  => '2002-07-09',
            'gender'      => 'male',
            'address'     => 'Jl. Kopo Sayati',
            'phone'       => '+6282376932445',
            'position_id' => 1,
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
            'accesses' => '[{"name":"admin","route":"/dashboard/admin","access":true,"submenu":[{"name":"position","route":"/dashboard/admin/position","access":true},{"name":"employee","route":"/dashboard/admin/employee","access":true},{"name":"service","route":"/dashboard/admin/service","access":true},{"name":"diagnose","route":"/dashboard/admin/diagnose","access":true},{"name":"category-payment","route":"/dashboard/admin/category-payment","access":true},{"name":"payment","route":"/dashboard/admin/payment","access":true},{"name":"category-outcome","route":"/dashboard/admin/category-outcome","access":true},{"name":"outcome","route":"/dashboard/admin/outcome","access":true},{"name":"promotion","route":"/dashboard/admin/promotion","access":true}]},{"name":"receptionist","route":"/dashboard/receptionist","access":true,"submenu":[{"name":"patient","route":"/dashboard/receptionist/patient","access":true},{"name":"appointment","route":"/dashboard/receptionist/appointment","access":true},{"name":"queue","route":"/dashboard/receptionist/queue","access":true}]},{"name":"doctor","route":"/dashboard/doctor","access":true,"submenu":[{"name":"patient","route":"/dashboard/doctor/patient","access":true},{"name":"queue","route":"/dashboard/doctor/queue","access":true}]},{"name":"pharmacy","route":"/dashboard/pharmacy","access":true,"submenu":[{"name":"category-item","route":"/dashboard/pharmacy/category-item","access":true},{"name":"item","route":"/dashboard/pharmacy/item","access":true},{"name":"item-supply","route":"/dashboard/pharmacy/supply","access":true},{"name":"stock-adjustment","route":"/dashboard/pharmacy/stock-adjustment","access":true}]},{"name":"cashier","route":"/dashboard/cashier","access":true,"submenu":[{"name":"transaction","route":"/dashboard/cashier/transaction","access":true},{"name":"history","route":"/dashboard/cashier/history","access":true}]},{"name":"report","route":"/dashboard/report","access":true,"submenu":[{"name":"sales","route":"/dashboard/report/sales","access":true}]}]',
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
