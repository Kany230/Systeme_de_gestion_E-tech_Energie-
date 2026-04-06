<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Configuration;
use App\Models\Document;
use App\Models\Produit;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocumentController extends Controller
{
    /**
     * Liste des documents avec filtres.
     */
    public function index(Request $request)
    {
        $query = Document::with(['user', 'client']);

        if ($request->has('type')){
            $query->where('type', $request->type);
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
            'produits.*.quantite' => 'required|integer|min:1'
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
    public function valider(Document $document)
    {
        if ($document->statut !== 'brouillon'){
            return response()->json(['message' => 'Document déjà validé'], 422);
        }

        return DB::transaction(function () use ($document){
            //Le stock est change seulement pour facturevet BL
            //Uniquement si le document n'a pas encore impacte le stock
            if ($document->type !== 'devis' && !$document->stock_impacte){
                foreach ($document->ligneDocument as $ligne){
                    $produit = $ligne->produit;
                    if ($produit->stock < $ligne->quantite){
                        throw new \Exception("Stock insuffisant pour le produit: {$produit->nom} Disponible: {$produit->stock}");
                    }

                    $produit->diminuerStock($ligne->quantite);
                }
                $document->stock_impacte = true;
            }
            $document->update(['statut' => 'valide']);
            return response()->json([
                'message' => 'Document validé',
                'stock mis à jour' => $document->stock_impacte
            ]);
        });
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
        $config = Configuration::first();
        $pdf = PDF::loadView('pdf.document', compact('document', 'config'));

        //On adapte le format du papier
        return $pdf->setPaper($document->format ?? 'A4')
                   ->download($document->type . '-' . $document->numeroDoc . '.pdf');
    }
}
