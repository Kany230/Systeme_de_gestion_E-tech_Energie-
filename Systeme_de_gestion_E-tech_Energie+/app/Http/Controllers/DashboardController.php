<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Document;
use App\Models\Produit;

class DashboardController extends Controller
{
    public function statistics(){
        $commandesJour = Document::whereDate('created_at', today())->count();
        $produitsStock = Produit::count();
        $clientActifs = Client::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();
        $chiffreAffaires = Document::where('type', 'facture')->where('statut', 'paye')->sum('prixTotal');

        return response()->json([
            'commandes_jour' => $commandesJour,
            'produits_stock' => $produitsStock,
            'clients_actifs' => $clientActifs,
            'chiffre_affaires' => $chiffreAffaires,
        ]);
        
    }

    public function derniersCommandes(){
        $documents = Document::with('client')->orderBy('created_at', 'desc')->limit(5)->get()->map(fn($doc)=>[
            'id' => $doc->id,
            'numero' => $doc->numeroDoc,
            'client' => $doc->client?->nom . ' ' . $doc->client?->prenom,
            'total' => $doc->prixTotal,
            'statut' => $doc->statut,
            'type' => $doc->type,
            'date' => $doc->dateDoc,
        ]);

        return response()->json($documents);
    }

    public function stockFaible(){
        $produits = Produit::whereColumn('stock', '<=', 'seuilAlerte')->select('id', 'nom', 'stock', 'seuilAlerte')->orderBy('stock', 'asc')->get();

        return response()->json($produits);
    }
}
