<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    public function definition(): array
    {
        // Génération d'un numéro de téléphone au format sénégalais
        $prefix = $this->faker->randomElement(['77', '78', '76', '70']);
        $num = $this->faker->numberBetween(1000000, 9999999);

        return [
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'addresse' => $this->faker->address(),
            'telephone' => (int) ($prefix . $num),
        ];
    }
}