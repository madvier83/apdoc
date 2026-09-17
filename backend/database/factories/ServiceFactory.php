<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Service::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $services = [
            // --- Layanan Umum ---
            ['name' => 'Konsultasi Dokter Umum', 'price' => 50000, 'commission' => 10000],
            ['name' => 'Suntik Vitamin C Booster', 'price' => 100000, 'commission' => 15000],
            ['name' => 'Pemeriksaan Darah Lengkap', 'price' => 120000, 'commission' => 15000],
            ['name' => 'Tes Gula Darah & Kolesterol', 'price' => 75000, 'commission' => 10000],
            ['name' => 'Pemasangan & Pelepasan Infus', 'price' => 85000, 'commission' => 15000],
            ['name' => 'Perawatan Luka Ringan', 'price' => 60000, 'commission' => 10000],

            // --- Layanan Gigi ---
            ['name' => 'Pembersihan Karang Gigi (Scaling)', 'price' => 250000, 'commission' => 40000],
            ['name' => 'Cabut Gigi Sederhana', 'price' => 175000, 'commission' => 30000],
            ['name' => 'Penambalan Gigi Komposit', 'price' => 200000, 'commission' => 35000],
            ['name' => 'Bleaching / Pemutihan Gigi', 'price' => 1500000, 'commission' => 200000],
            ['name' => 'Pemasangan Behel (Uang Muka)', 'price' => 3000000, 'commission' => 350000],

            // --- Layanan Kecantikan ---
            ['name' => 'Facial Treatment Basic', 'price' => 150000, 'commission' => 25000],
            ['name' => 'Acne Facial Treatment', 'price' => 220000, 'commission' => 35000],
            ['name' => 'Chemical Peeling Glow', 'price' => 350000, 'commission' => 50000],
            ['name' => 'Microdermabrasi', 'price' => 300000, 'commission' => 45000],
            ['name' => 'Laser Black Doll Face', 'price' => 600000, 'commission' => 80000],
        ];

        $service = $this->faker->randomElement($services);

        return [
            'category_service_id' => mt_rand(1, 5),
            'code' => 'SRV-' . str_pad(mt_rand(1, 999), 3, '0', STR_PAD_LEFT),
            'name' => $service['name'],
            'price' => $service['price'],
            'commission' => $service['commission'],
            'clinic_id' => mt_rand(2, 3),
        ];
    }
}
