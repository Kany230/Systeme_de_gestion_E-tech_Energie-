<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Configuration;
use App\Models\Document;
use App\Models\Produit;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use NumberFormatter;

class DocumentController extends Controller
{
    /**
     * Liste des documents avec filtres.
     */
    public function index(Request $request){
        $query = Document::with(['user', 'client']);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
    
        if ($request->filled('client_id')) {
            $query->where('id_client', $request->client_id);
        }

        if ($request->filled('statut')) {
           $query->where('statut', $request->statut);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }


    /**
     * Creation d'un document
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:facture,devis,BL', 
            'produits' =>  'required|array',
            'produits.*.id_produit' => 'required|exists:produits,id',
            'produits.*.quantite' => 'required|integer|min:1',
            'main_doeuvre' => 'nullable|numeric|min:0',
            'titre' => 'nullable|string|max:255'
        ]);

        return DB::transaction(function () use($request){
              //Client nouveau ou existant
            $client = $request->id_client;
            if (!$client){
                $client = Client::create([
                    'nom' => $request->nomClient,
                    'prenom' => $request->prenomClient,
                    'telephone' => $request->telephoneClient,
                    'addresse' => $request->addresseClient
                ]);
                $client = $client->id;
            }

            $tauxTaxe = $request->input('taxe', 18);
            //Creation du document
            $prefix = substr($request->type, 0, 3);
            $numeroDoc = $prefix . '-' . now()->format('Ymd'). '-' . strtoupper(uniqid());
            $document = Document::create([
                'numeroDoc' => $numeroDoc,
                'dateDoc' => now(),
                'type' => $request->type,
                'id_client' => $client,
                'id_user' => auth()->id(),
                'statut' => 'brouillon',
                'titre' => $request->objet,
                'main_doeuvre' => $request->input('main_doeuvre', 0),
                'format' => $request->input('format', 'A4'),
                'prixTotal' => 0,
                'taxe' => $tauxTaxe,
                'stock_impacte' => false
            ]);

            //Ajout des lignes de commmande et calcul
            $totalHT = 0;
            foreach ($request->produits as $item){
                $produit = Produit::findOrFail($item['id_produit']);
                $sousTotal = $produit->prix * $item['quantite'];

                $document->ligneDocument()->create([
                    'id_produit' => $produit->id,
                    'quantite' => $item['quantite'],
                    'prixUnitaire' => $produit->prix,
                    'sousTotal' => $sousTotal
                ]);

                $totalHT += $sousTotal;
            }

            
            $document->totalDoc();

            return response()->json($document->load('ligneDocument.produit', 'client'), 201);
        });
    }

    public function show(Document $document)
    {
        return response()->json($document->load(['ligneDocument.produit', 'client', 'user']));
    }

    public function update(Request $request, Document $document)
    {
        if ($document->statut !== 'brouillon'){
            return response()->json(['message' => 'Seul les documents en brouillon peuvent etre modifies'], 422);
        }

        $document->update($request->only([
            'dateDoc',
            'format',
            'id_client'
        ]));

        return response()->json($document->fresh(['ligneDocument', 'client']));
    }

    public function destroy(Document $document)
    {
        if ($document->statut !== 'brouillon'){
            return response()->json(['message' => 'Seul les documents en brouillon peuvent etre supprimés'], 403);
        }

        $document->delete();

        return response()->json(['message' => 'Document supprimé avec succès']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    /**
 * Valide un document et décrémente les stocks.
 */
    public function valider(Document $document){
        if ($document->statut !== 'brouillon') {
            return response()->json(['message' => 'Ce document est déjà validé ou annulé.'], 422);
        }

        try {
            return DB::transaction(function () use ($document) {
                if (in_array($document->type, ['facture', 'BL'])) {
                
                
                foreach ($document->ligneDocument as $ligne) {
                    $produit = $ligne->produit;

                    
                    if ($produit->stock < $ligne->quantite) {
                        
                        throw new \Exception("Stock insuffisant pour {$produit->nom}. Disponible: {$produit->stock}, Demandé: {$ligne->quantite}");
                    }

                    
                    $produit->decrement('stock', $ligne->quantite);
                }
                
                $document->stock_impacte = true;
            }
            


            $document->statut = 'valide';
            $document->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Document validé avec succès et stocks mis à jour.',
                'data' => $document->load('ligneDocument.produit')
            ], 200);
        });

    } catch (\Exception $e) {
        // En cas d'erreur (ex: stock insuffisant), la transaction est annulée automatiquement
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 422);
    }


    }

    /**
     * Convertir un devis en facture
     */
    public function convertirEnFacture(Document $devis)
    {
        if ($devis->type !== 'devis') return response()->json(['message' => 'Seul un devis peut etre converti en facture'], 422);
        return DB::transaction(function () use ($devis){
            $facture = $devis->replicate();
            $facture->type = 'facture';
            $facture->numeroDoc = 'FAC-' . now()->format('Ymd') . '-' . strtoupper(uniqid());
            $facture->statut = 'brouillon';
            $facture->stock_impacte = false;
            $facture->save();

            foreach ($devis->ligneDocument as $ligne) {
                $newLigne = $ligne->replicate();
                $newLigne->id_doc = $facture->id;
                $newLigne->save();
            }

            return response()->json($facture);
        });
    }

    /**
     * Convertir BL en facture
     */
    public function convertirEnBL(Document $facture)
    {
        if ($facture->type !== 'facture') return response()->json(['message' => 'Seul une facture peut etre convertie en BL'], 422);
        return DB::transaction(function () use ($facture){
            $bl = $facture->replicate();
            $bl->type = 'BL';
            $bl->numeroDoc = 'BL-' . now()->format('Ymd') . '-' . strtoupper(uniqid());
            $bl->statut = 'brouillon';
            //
            $bl->stock_impacte = $facture->stock_impacte;
            $bl->save();

            foreach ($facture->ligneDocument as $ligne) {
                $newLigne = $ligne->replicate();
                $newLigne->id_doc = $bl->id;
                $newLigne->save();
            }

            return response()->json($bl);
        });
    }


    public function genererPDF(Document $document){
        $document->load('ligneDocument.produit', 'client', 'user');

        $totalTTC = $document->prixTotal + $document->main_doeuvre;
        if($document->taxe > 0) {
            $totalTTC += ($document->prixTotal * ($document->taxe / 100));
        }

        //Convertir en lettre
        $document->total_lettres = $this->convertirNombreEnLettres($totalTTC);
        $config = Configuration::first();
        $pdf = PDF::loadView('pdf.document', compact('document', 'config'));

        //On adapte le format du papier
        return $pdf->setPaper($document->format ?? 'A4')
                   ->download($document->type . '-' . $document->numeroDoc . '.pdf');
    }

    private function convertirNombreEnLettres($nombre){
        $formatter = new NumberFormatter("fr", NumberFormatter::SPELLOUT);
        return $formatter->format($nombre);
    }
}
