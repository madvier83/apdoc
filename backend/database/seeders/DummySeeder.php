<?php

namespace Database\Seeders;

use App\Models\CategoryPayment;
use App\Models\ItemSupply;
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
			'category_payment_id' => 1,
            'name'        => 'BCA'
		]);
		Payment::create([
			'category_payment_id' => 1,
            'name'        => 'Permata'
		]);
		Payment::create([
			'category_payment_id' => 2,
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

		ItemSupply::create([
			'item_id' 		=> 1,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
		ItemSupply::create([
			'item_id' 		=> 2,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
		ItemSupply::create([
			'item_id' 		=> 3,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
		ItemSupply::create([
			'item_id' 		=> 4,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
		ItemSupply::create([
			'item_id' 		=> 5,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
	}
}
