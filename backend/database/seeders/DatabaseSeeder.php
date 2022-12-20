<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Diagnose;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Service;
use App\Models\User;
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
            RoleSeeder::class,
        ]);

        User::factory(5)->create();
        Clinic::factory(5)->create();
        Position::factory(5)->create();
        Employee::factory(5)->create();
        Diagnose::factory(5)->create();
        Service::factory(5)->create();
    }
}
