<?php

namespace Database\Factories;

use App\Models\CategoryService;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CategoryService::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->unique()->word(),
            'clinic_id' => mt_rand(2, 3)
        ];
    }
}
