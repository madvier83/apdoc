<?php

namespace Database\Seeders;

use App\Models\Access;
use App\Models\CategoryItem;
use App\Models\Clinic;
use App\Models\Diagnose;
use App\Models\Employee;
use App\Models\Item;
use App\Models\Patient;
use App\Models\Position;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

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
            'role_id'           => 2,
            'phone'             => '+6289518223591',
            'otp_verification'  => '750587',
            'created_at_otp'    => Carbon::now(),
            'expired_otp'       => Carbon::now(),
            'phone_verified_at' => Carbon::now(),
            'is_verified'       => 1,
            'apdoc_id'          => $clinic->apdoc_id,
            'employee_id'       => $employee->id
        ]);

        Access::create([
            'role_id'  => 2,
            'accesses' => '[{"name":"admin","submenu":[{"name":"service","status":1},{"name":"outcome","status":1}]},{"name":"receptionist","submenu":[{"name":"patient","status":1},{"name":"queue","status":1}]}',
            'clinic_id'   => $clinic->id
        ]);

        // User::factory(10)->create();
        // Clinic::factory(10)->create();
        // Employee::factory(10)->create();
        // Position::factory(10)->create();
        // Diagnose::factory(10)->create();
        // Service::factory(10)->create();
        // Patient::factory(10)->create();
        // CategoryItem::factory(10)->create();
        Item::factory(10)->create();
    }
}
