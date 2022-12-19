<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Employee::class;

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
            'gender'      => $this->faker->randomElement(['laki-laki', 'perempuan']),
            'address'     => $this->faker->address(),
            'phone'       => $this->faker->unique()->phoneNumber,
            'position_id' => mt_rand(1, 4),
        ];
    }
}
