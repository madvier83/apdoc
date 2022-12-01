<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class InitialSeeder extends Seeder
{
    public function run()
    {
      
		Role::create([
			'name' => 'superadmin'
		]);
		Role::create([
			'name' => 'useradmin'
		]);
		Role::create([
			'name' => 'admin'
		]);
    }
}
