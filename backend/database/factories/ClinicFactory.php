<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClinicFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Clinic::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name'        => $this->faker->name,
            'address'     => $this->faker->streetAddress,
            'province'    => $this->faker->citySuffix,
            'city'        => $this->faker->city,
            'district'    => $this->faker->streetName,
            'postal_code' => $this->faker->postcode,
            'phone'       => $this->faker->phoneNumber,
            'apdoc_id'   => $this->faker->unique()->postcode,
        ];
    }
}
