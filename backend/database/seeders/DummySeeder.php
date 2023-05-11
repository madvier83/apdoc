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
			'name' => 'Salary',
            'clinic_id' => 2
		]);
		CategoryOutcome::create([
			'name' => 'Other',
            'clinic_id' => 2
		]);

        Outcome::create([
			'category_outcome_id' 	=> 1,
            'nominal'      			=> '4000000',
			'note'					=> 'lorem ipsum dolor sit amet.',
            'clinic_id' => 2
		]);
		Outcome::create([
			'category_outcome_id' 	=> 1,
            'nominal'      			=> '4000000',
			'note'					=> 'lorem ipsum dolor sit amet.',
            'clinic_id' => 2
		]);
		Outcome::create([
			'category_outcome_id' 	=> 2,
            'nominal'      			=> '20000',
			'note'					=> 'lorem ipsum dolor sit amet.',
            'clinic_id' => 2
		]);

		CategoryPayment::create([
			'name' => 'EDC',
            'clinic_id' => 2
		]);
		CategoryPayment::create([
			'name' => 'Other',
            'clinic_id' => 2
		]);

        Payment::create([
			'category_payment_id' => 1,
            'name'        => 'BCA',
            'clinic_id' => 2
		]);
		Payment::create([
			'category_payment_id' => 1,
            'name'        => 'Permata',
            'clinic_id' => 2
		]);
		Payment::create([
			'category_payment_id' => 2,
            'name'        => 'QRIS',
            'clinic_id' => 2
		]);

        Promotion::create([
            'name'     => 'Hari Kemerdekaan',
			'discount' => 17,
            'clinic_id' => 2
		]);
		Promotion::create([
            'name'     => 'Pembelian Pertama',
			'discount' => 50,
            'clinic_id' => 2
		]);
		Promotion::create([
            'name'     => 'Sebelas Sebelas',
			'discount' => 11.11,
            'clinic_id' => 2
		]);

		ItemSupply::create([
			'item_id' 		=> 1,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);
		ItemSupply::create([
			'item_id' 		=> 2,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);
		ItemSupply::create([
			'item_id' 		=> 3,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);
		ItemSupply::create([
			'item_id' 		=> 4,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);
		ItemSupply::create([
			'item_id' 		=> 5,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);ItemSupply::create([
			'item_id' 		=> 6,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);
		ItemSupply::create([
			'item_id' 		=> 7,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);
		ItemSupply::create([
			'item_id' 		=> 8,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);
		ItemSupply::create([
			'item_id' 		=> 9,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);
		ItemSupply::create([
			'item_id' 		=> 10,
			'total' 		=> 500,
			'before' 		=> 0,
			'after' 		=> 500,
			'manufacturing' => '2023-02-05',
			'expired' 		=> '2024-02-05',
			'stock' 		=> 500,
			'clinic_id'		=> 2
		]);

		// Setting::create([
		// 	'logo'        => null,
        //     'name'        => 'Cursor ID',
        //     'phone'       => '628995754988',
        //     'address'     => 'Jl. Dalem Kaum',
        //     'city'        => 'Bandung',
        //     'country'     => 'Jawa Barat',
        //     'postal_code' => '40228',
        //     'clinic_id' => 2
		// ]);
	}
}
