<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genres = ['寿司', '焼肉', 'イタリアン', '居酒屋', 'ラーメン'];
        foreach ($genres as $genre) {
            \App\Models\Genre::create(['name' => $genre]);
        }
    }
}
