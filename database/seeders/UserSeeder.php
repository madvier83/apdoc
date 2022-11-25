<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create User Seed
        User::create([
            'name' => 'Cursor',
            'roles' => 'super_admin',
            'username' => 'admin',
            'password' => bcrypt('admin123')
        ]);
    }
}
