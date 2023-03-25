<?php

namespace Database\Seeders;

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

        $employee = Employee::create([
            'nik'         => null,
            'name'        => 'Administrator',
            'birth_place' => null,
            'birth_date'  => null,
            'gender'      => null,
            'address'     => null,
            'phone'       => null,
            'position_id' => null,
        ]);

        User::create([
            'email'             => 'cursor.id',
            'password'          => app('hash')->make('Cursor123'),
            'role_id'           => 2,
            'phone'             => '+628995754988',
            'otp_verification'  => '750587',
            'created_at_otp'    => Carbon::now(),
            'expired_otp'       => Carbon::now(),
            'phone_verified_at' => Carbon::now(),
            'is_verified'       => 1,
            'employee_id'       => $employee->id
        ]);

        // User::factory(10)->create();
        // Clinic::factory(10)->create();
        // Employee::factory(10)->create();
        Position::factory(10)->create();
        Diagnose::factory(10)->create();
        Service::factory(10)->create();
        Patient::factory(10)->create();
        CategoryItem::factory(10)->create();
        Item::factory(10)->create();
    }
}
