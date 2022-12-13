<?php

namespace Database\Seeders;

use App\Models\Klinik;
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
        // $this->call('InitialSeeder');
        $this->call([
            InitialSeeder::class,
        ]);

        User::factory(4)->create();
        Klinik::factory(5)->create();
    }
}
