<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Item::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'category_item_id'  => mt_rand(1, 5),
            'code'              => 'I' . mt_rand(1, 40000),
            'name'              => $this->faker->name,
            // 'unit'              => $this->faker->randomElement(['5gr', '10gr', '15gr', '20gr', '25gr']),
            // 'sell_price'        => $this->faker->randomElement([5000, 10000, 15000, 20000, 25000]),
            // 'buy_price'         => $this->faker->randomElement([5000, 10000, 15000, 20000, 25000]),
            'factory'           => 'PT. Oasis Mitra Trinunggal',
            'distributor'       => 'Cursor ID',
            'clinic_id'         => mt_rand(2, 3)
        ];
    }
}
