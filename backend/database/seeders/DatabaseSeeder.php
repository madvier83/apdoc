<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Klinik;
use App\Models\Position;
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

        User::factory(4)->create();
        Klinik::factory(5)->create();
        Position::factory(5)->create();
        Employee::factory(5)->create();
    }
}
