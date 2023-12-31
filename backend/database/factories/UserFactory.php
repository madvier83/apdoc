<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'email'    => $this->faker->unique()->safeEmail,
            'password' => app('hash')->make('12345678'),
            'role_id'  => rand(2, 3),
            'phone'  => '08'.rand(100000000, 999999999)
        ];
    }
}
