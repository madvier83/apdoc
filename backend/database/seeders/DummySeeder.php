<?php

namespace Database\Seeders;

use App\Models\CategoryOutcome;
use App\Models\CategoryPayment;
use App\Models\ItemSupply;
use App\Models\Outcome;
use App\Models\Payment;
use App\Models\Promotion;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class DummySeeder extends Seeder
{
	public function run()
	{
		CategoryOutcome::create([
			'name' => 'Salary'
		]);
		CategoryOutcome::create([
			'name' => 'Other'
		]);

        Outcome::create([
			'category_outcome_id' 	=> 1,
            'nominal'      			=> '4000000',
			'note'					=> 'lorem ipsum dolor sit amet.'
		]);
		Outcome::create([
			'category_outcome_id' 	=> 1,
            'nominal'      			=> '4000000',
			'note'					=> 'lorem ipsum dolor sit amet.'
		]);
		Outcome::create([
			'category_outcome_id' 	=> 2,
            'nominal'      			=> '20000',
			'note'					=> 'lorem ipsum dolor sit amet.'
		]);

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
		]);ItemSupply::create([
			'item_id' 		=> 6,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
		ItemSupply::create([
			'item_id' 		=> 7,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
		ItemSupply::create([
			'item_id' 		=> 8,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
		ItemSupply::create([
			'item_id' 		=> 9,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);
		ItemSupply::create([
			'item_id' 		=> 10,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> null
		]);

		Setting::create([
			'logo'        => null,
            'name'        => 'Cursor ID',
            'phone'       => '628995754988',
            'address'     => 'Jl. Dalem Kaum',
            'city'        => 'Bandung',
            'country'     => 'Jawa Barat',
            'postal_code' => '40228',
		]);
	}
}
