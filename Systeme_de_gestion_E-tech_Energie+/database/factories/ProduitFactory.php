<?php

namespace Database\Factories;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProduitFactory extends Factory
{
    public function definition(): array
    {
        $stock = $this->faker->numberBetween(2, 80);
        $seuilAlerte = $this->faker->randomElement([5, 10, 15]);

        return [
            'id_categorie' => Categorie::factory(), // Génère ou lie une catégorie
            'nom' => $this->faker->unique()->randomElement([
                'Panneau Solaire Monocristallin 400W', 'Batterie Lithium-Ion 12V 200Ah',
                'Onduleur Hybride 5KW VPM', 'Régulateur de Charge MPPT 60A',
                'Câble Solaire 6mm² (100m)', 'Kit Solaire Domestique 100W',
                'Projecteur Solaire LED 200W', 'Convertisseur Pur Sinus 24V/220V',
                'Compteur Électrique Intelligent', 'Disjoncteur CC 32A',
                'Panneau Solaire Poly 250W', 'Batterie Gel 12V 150Ah',
                'Onduleur Réseau 3KW', 'Support de Fixation Toiture',
                'Coffret de Protection AC/DC', 'Fusible de Protection Solaire',
                'Lampe Solaire Autonome', 'Valise Solaire Nomade',
                'Optimiseur de Puissance', 'Pince Ampèremétrique Numérique'
            ]),
            'description' => $this->faker->paragraph(1),
            // Prix cohérents en FCFA (multiples de 1000)
            'prix' => $this->faker->numberBetween(8, 1200) * 1000,
            'stock' => $stock,
            'seuilAlerte' => $seuilAlerte,
            'image' => null,
        ];
    }
}