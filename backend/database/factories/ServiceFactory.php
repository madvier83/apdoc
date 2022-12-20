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
        return [
            'name'       => $this->faker->name,
            'price'      => $this->faker->randomElement([5000, 10000, 15000, 20000, 25000]),
            'commission' => $this->faker->randomElement([5000, 10000, 15000, 20000, 25000]),
        ];
    }
}
