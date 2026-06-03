<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Client;
use App\Models\Document;
use App\Models\LigneCommande;
use App\Models\MouvementStock;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Initialisation des configurations de la société (E-Tech Energie+)
        $this->call([
            ConfigurationSeeder::class,
        ]);

        // 2. Utilisateurs
        // 2. Utilisateurs
        $admin = User::factory()->create([
            'name' => 'Kany Cisse',
            'email' => 'kanycisse967@gmail.com',
            'role' => 'admin',
            'password' => bcrypt('password'),
            'is_validated' => true,      // S'assurer qu'il est validé
            'statut' => 'active',        // S'assurer qu'il est actif
        ]);

        $secretaire = User::factory()->create([
            'name' => 'Gestionnaire E-Tech',
            'email' => 'secretaire@etech.sn',
            'role' => 'secretaire',
            'password' => bcrypt('password'),
            'is_validated' => true,      // S'assurer qu'elle est validée
            'statut' => 'active',        // S'assurer qu'elle est active
        ]);

        // 3. Catégories & Produits
        $categories = Categorie::factory()->count(5)->create();
        $produits = Produit::factory()->count(20)->recycle($categories)->create();

        // 4. Clients et chaînage Commercial / Stock
        Client::factory()
            ->count(10)
            ->create()
            ->each(function ($client) use ($secretaire, $produits) {
                
                // Pour chaque client, on génère 1 ou 2 documents
                Document::factory()
                    ->count(rand(1, 2))
                    ->create([
                        'id_client' => $client->id,
                        'id_user' => $secretaire->id,
                    ])
                    ->each(function ($document) use ($secretaire, $produits) {
                        
                        // Pour chaque document, on ajoute entre 2 et 4 lignes de commandes
                        $lignes = LigneCommande::factory()
                            ->count(rand(2, 4))
                            ->create([
                                'id_doc' => $document->id,
                                // On pioche un produit parmi les 20 créés plus haut
                                'id_produit' => $produits->random()->id 
                            ]);

                        // On recalcule le montant total TTC du document par rapport aux lignes
                        $document->totalDoc();

                        // Si c'est une facture validée, on simule la sortie de stock correspondante
                        if ($document->isFacture() && $document->statut === 'valide') {
                            foreach ($lignes as $ligne) {
                                MouvementStock::factory()->create([
                                    'produit_id' => $ligne->id_produit,
                                    'user_id' => $secretaire->id,
                                    'type' => 'sortie',
                                    'quantite' => $ligne->quantite,
                                    'motif' => "Vente - Doc N° " . $document->numeroDoc
                                ]);
                            }
                        }
                    });
            });

        // 5. Quelques mouvements d'entrée de stock indépendants (pour l'historique)
        MouvementStock::factory()
            ->count(8)
            ->create([
                'produit_id' => $produits->random()->id,
                'user_id' => $admin->id,
                'type' => 'entree',
                'motif' => 'Approvisionnement général'
            ]);
    }
}