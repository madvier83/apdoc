<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition()
    {
        return [
            'nik' => $this->faker->randomNumber(5, true),
            'name' => $this->faker->firstName() . ' ' . $this->faker->lastName(),
            'birth_place' => $this->faker->city(),
            'birth_date' => $this->faker->date('Y-m-d', '2003-12-31'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            // 'address' => $this->faker->address(),
            'phone' => $this->faker->unique()->phoneNumber(),
            'clinic_id' => mt_rand(2, 3),
        ];
    }
}