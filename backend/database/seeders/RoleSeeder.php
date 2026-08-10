<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
	public function run()
	{

		Role::create([
			'name' => 'admin'
		]);
		Role::create([
			'name' => 'owner'
		]);
		Role::create([
			'name' => 'doctor'
		]);
		Role::create([
			'name' => 'staff'
		]);
	}
}
