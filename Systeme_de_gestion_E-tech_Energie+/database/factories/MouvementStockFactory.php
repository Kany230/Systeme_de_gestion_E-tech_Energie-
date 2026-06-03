<?php

namespace Database\Factories;

use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MouvementStockFactory extends Factory
{
    public function definition(): array
    {
        $type = $this->faker->randomElement(['entree', 'sortie']);
        
        $motifsEntree = ['Approvisionnement fournisseur', 'Retour client', 'Correction inventaire'];
        $motifsSortie = ['Vente directe', 'Produit défectueux / cassé', 'Usage interne'];

        return [
            'produit_id' => Produit::factory(),
            'user_id' => User::factory(),
            'type' => $type,
            'quantite' => $this->faker->numberBetween(1, 20),
            'motif' => $type === 'entree' 
                ? $this->faker->randomElement($motifsEntree) 
                : $this->faker->randomElement($motifsSortie),
        ];
    }
}