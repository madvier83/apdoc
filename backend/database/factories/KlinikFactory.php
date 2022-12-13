<?php

namespace Database\Factories;

use App\Models\Klinik;
use Illuminate\Database\Eloquent\Factories\Factory;

class KlinikFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Klinik::class;

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
            'appdoc_id'   => $this->faker->unique()->postcode,
        ];
    }
}
