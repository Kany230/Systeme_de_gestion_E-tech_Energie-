<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use App\Models\LigneCommande;
use Illuminate\Http\Request;

class LigneCommandeController extends Controller
{
    /**Ce contrôleur sert à modifier une quantité ou supprimer 
    *un article d'un devis en cours de préparation sans recharger tout le document.
    */

    /**
     * Modifier la quantite d'un produit dans un document
     */
    public function update(Request $request, LigneCommande $ligneCommande)
    {
        if ($ligneCommande->document->statut !== 'brouillon'){
            return response()->json(['message' => 'Impossible de modifier un document validé ou payé'], 422);
        }

        $request->validate([
            'quantite' => 'required|integer|min:1'
        ]);

        //Mis à jour de la quantite et du sous total
        $ligneCommande->quantite = $request->quantite;
        $ligneCommande->sousTotal = $request->quantite * $ligneCommande->prixUnitaire;
        $ligneCommande->save();

        //Recalculer le total du document
        $document = $ligneCommande->document;
        $newPrix = $document->totalDoc();

        
        return response()->json([
            'message' => 'Quantité mis à jour',
            'ligneCommande' => $ligneCommande,
            'totalTTC' => $newPrix
        ]);
    }

    /**
     * Supprimer un produit d'un document
     */
    public function destroy(LigneCommande $ligneCommande)
    {
        if ($ligneCommande->document->statut !== 'brouillon'){
            return response()->json(['message' => 'Impossible de supprimer une ligne d\'un document validé ou payé'], 422);
        }

        
        $document = $ligneCommande->document;
        $ligneCommande->delete();

        //Recalculer le total du document
        $newPrix = $document->totalDoc();

        return response()->json([
            'message' => 'Ligne supprimée',
            'prix' => $newPrix
        ]);
    }
}
