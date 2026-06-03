<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

class LigneCommandeFactory extends Factory
{
    public function definition(): array
    {
        // On récupère ou crée un produit de manière aléatoire
        $produit = Produit::inRandomOrder()->first() ?? Produit::factory()->create();
        $quantite = $this->faker->numberBetween(1, 5);
        $prixUnitaire = $produit->prix;

        return [
            'id_doc' => Document::factory(), // Sera écrasé ou recyclé dans le Seeder
            'id_produit' => $produit->id,
            'quantite' => $quantite,
            'prixUnitaire' => $prixUnitaire,
            'sousTotal' => $quantite * $prixUnitaire,
        ];
    }
}