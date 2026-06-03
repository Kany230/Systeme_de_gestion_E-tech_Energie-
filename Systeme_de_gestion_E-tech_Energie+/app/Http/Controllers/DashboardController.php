<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Document;
use App\Models\Produit;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function statistics(){
        $commandesJour = Document::whereDate('created_at', today())->count();
        $produitsStock = Produit::count();
        $clientActifs = Client::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();
        $chiffreAffaires = Document::where('type', 'facture')->whereIn('statut', ['paye', 'valide'])->sum('prixTotal');

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

    //Rapport financiers et flux d'activite
    public function rapportEvents(){
        $chiffreAffaires = Document::where('type', 'facture')->whereIn('statut', ['paye', 'valide'])->sum('prixTotal');
        $commandesJour = Document::whereDate('created_at', today())->count();
        
        $repartitionTypes = Document::select('type', DB::raw('count(*) as total_docs'), DB::raw('sum(prixTotal) as montant_cumule'))
        ->groupBy('type')
        ->get();


        $fluxRecents = Document::with('client')->orderBy('created_at', 'desc')->limit(5)->get()->map(fn($doc) => [
            'id' => $doc->id,
            'numero' => $doc->numeroDoc,
            'client' => $doc->client ? $doc->client->nom . ' ' . $doc->client->prenom : 'Client Anonyme',
            'total' => $doc->prixTotal,
            'statut' => $doc->statut,
            'type' => $doc->type,
            'date' => $doc->dateDoc,
        ]);

        return response()->json([
            'chiffre_affaires' => $chiffreAffaires,
            'ventes_jour' => $commandesJour,
            'repartition' => $repartitionTypes,
            'flux_recents' => $fluxRecents
        ]);
    }

    //Alertes et valeurs des stocks
    public function rapportAction(){
        $produitsCritiques = Produit::with('categorie')->whereColumn('stock', '<=', 'seuilAlerte')->orderBy('stock', 'asc')->get();

        $totalCatalogue = Produit::count();
        $valeurTotalStock = Produit::select(DB::raw('SUM(stock * prix) as valeur_totale'))->first()->valeur_totale ?? 0;

        return response()->json([
            'total_catalogue' => $totalCatalogue,
            'valeur_economique_stock' => $valeurTotalStock,
            'alerte_rupture' => $produitsCritiques
        ]);

    }

    //Client anlyse et portefeuille
    public function rapportClients(){
        //Classement des clients par volume d'achat
        $bestClient = Client::select('clients.id', 'clients.nom', 'clients.prenom', 'clients.telephone')
        ->join('documents', 'clients.id', '=', 'documents.id_client')
        ->where('documents.type', 'facture')
        ->whereIn('documents.statut', ['paye', 'valide'])
        ->selectRaw('SUM(documents.prixTotal) as total_achats')
        ->selectRaw('COUNT(documents.id) as nombre_factures')
        ->groupBy('clients.id', 'clients.nom', 'clients.prenom', 'clients.telephone')
        ->orderBy('total_achats', 'desc')
        ->get();

        return response()->json([
            'total_clients' => Client::count(),
            'classement_clients' => $bestClient
        ]);
    }

}


