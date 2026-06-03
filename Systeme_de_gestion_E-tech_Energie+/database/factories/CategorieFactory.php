<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategorieFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['Énergie Solaire', 'Batteries & Stockage', 'Onduleurs', 'Régulateurs', 'Accessoires & Câblage', 'Éclairage LED'];

        return [
            'nom' => $this->faker->unique()->randomElement($categories),
            'description' => $this->faker->sentence(8),
        ];
    }
}