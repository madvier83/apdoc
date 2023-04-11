<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Patient::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'nik'         => $this->faker->randomNumber(5, true),
            'name'        => $this->faker->name,
            'birth_place' => $this->faker->city(),
            'birth_date'  => $this->faker->date(),
            'gender'      => $this->faker->randomElement(['male', 'female']),
            'address'     => $this->faker->address(),
            'phone'       => $this->faker->unique()->phoneNumber,
            'clinic_id'   => 2
        ];
    }
}
