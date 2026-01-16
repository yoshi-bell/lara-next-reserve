<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\Genre;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shop>
 */
class ShopFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'area_id' => Area::factory(),
            'genre_id' => Genre::factory(),
            'description' => fake()->realText(),
            'image_url' => fake()->imageUrl(),
            'start_time' => '17:00:00',
            'end_time' => '23:00:00',
            'default_capacity' => 20,
            'default_stay_time' => 120,
        ];
    }
}
