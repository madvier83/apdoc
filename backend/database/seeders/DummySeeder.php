<?php

namespace Database\Seeders;

use App\Models\CategoryPayment;
use App\Models\Payment;
use App\Models\Promotion;
use Illuminate\Database\Seeder;

class DummySeeder extends Seeder
{
	public function run()
	{
		CategoryPayment::create([
			'name' => 'EDC'
		]);
		CategoryPayment::create([
			'name' => 'Other'
		]);

        Payment::create([
			'category_id' => 1,
            'name'        => 'BCA'
		]);
		Payment::create([
			'category_id' => 1,
            'name'        => 'Permata'
		]);
		Payment::create([
			'category_id' => 2,
            'name'        => 'QRIS'
		]);

        Promotion::create([
            'name'     => 'Hari Kemerdekaan',
			'discount' => 17,
		]);
		Promotion::create([
            'name'     => 'Pembelian Pertama',
			'discount' => 50,
		]);
		Promotion::create([
            'name'     => 'Sebelas Sebelas',
			'discount' => 11.11,
		]);
	}
}
