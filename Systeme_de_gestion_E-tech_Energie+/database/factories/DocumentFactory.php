<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    public function definition(): array
    {
        // 1. On récupère un type valide parmi ceux de la migration
        $type = $this->faker->randomElement(['facture', 'devis', 'BL']);
        
        // 2. Attribution d'un préfixe dynamique et cohérent pour chaque type
        $prefix = match($type) {
            'facture' => 'FACT-',
            'devis'   => 'DEV-',
            'BL'      => 'BL-',
        };
        
        return [
            'id_client' => Client::factory(),
            'id_user' => User::factory(),
            'numeroDoc' => $prefix . $this->faker->unique()->numberBetween(2026001, 2026999),
            'dateDoc' => $this->faker->date(),
            'prixTotal' => $this->faker->numberBetween(50, 5000) * 1000,
            'taxe' => $this->faker->randomElement([0, 18]), 
            
            // 3. Statut aligné sur l'ENUM de ta migration
            'statut' => $this->faker->randomElement(['brouillon', 'valide', 'payer']),
            
            // 4. Format aligné sur l'ENUM de ta migration ('A3', 'A5', 'A4') au lieu de 'pdf'
            'format' => $this->faker->randomElement(['A4', 'A5']),
            
            'type' => $type,
            'stock_impacte' => $this->faker->randomElement([0, 1]),
        ];
    }
}