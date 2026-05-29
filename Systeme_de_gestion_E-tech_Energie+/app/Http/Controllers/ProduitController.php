<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\MouvementStock;

class ProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produits = Produit::with('categorie')->get();
        return response()->json($produits);
    }

    public function getProduitsEnRupture(){
        $produits = Produit::whereColumn('stock', '<=', 'seuilAlerte')->get();
        return response()->json($produits);
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric',
            'stock' => 'required|integer',
            'seuilAlerte' => 'required|integer',
            'categorie_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if(request()->hasFile('image')){
            $imagePath = request()->file('image')->store('produits', 'public');
            $validate['image'] = $imagePath;
        }

        $produit = Produit::create($validate);

        if ($produit->stock > 0) {
            MouvementStock::create([
                'produit_id' => $produit->id,
                'user_id'    => auth()->id(),
                'type'       => 'entree',
                'quantite'   => $produit->stock,
                'motif'      => 'Stock initial à la création du produit'
         ]);

        }

        return response()->json($produit, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Produit $produit)
    {
        return response()->json($produit);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function modifierStock(Request $request, Produit $produit)
    {
        $request->validate(['quantite' => 'required|integer']);
        try {
            $quantite = $request->quantite;
            if ($quantite < 0){
                $produit->diminuerStock($quantite);
                $typeMouvement = 'sortie';
                $quantiteMouvement = $quantite;
                $motif = 'Ajustement de stock - diminution';
            }else{
                $produit->stock += $quantite;
                $produit->save();
                $typeMouvement = 'entrée';
                $quantiteMouvement = $quantite;
                $motif = 'Ajustement de stock - augmentation';
            }

            MouvementStock::create([
                'id_produit' => $produit->id,
                'quantite' => $quantiteMouvement,
                'type' => $typeMouvement,
                'id_user' => auth()->id(),
                'motif' => $motif
            ]);

            return response()->json([
                'message' => 'Stock mis à jour',
                'new stock' => $produit->stock,
                'alerte' => $produit->verifierSeuil()
            ]);

        }catch(\Exception $e){
            return response()->json($e->getMessage(), 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'prix' => 'sometimes|required|numeric',
            'stock' => 'sometimes|required|integer',
            'seuilAlerte' => 'sometimes|required|integer',
            'categorie_id' => 'sometimes|required|exists:categories,id',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);
        if (request()->hasFile('image')){
            if($produit->image) Storage::disk(('public'))->delete($produit->image);
            $imagePath = request()->file('image')->store('produits', 'public');
            $produit->update(['image' => $imagePath]);
        }

        $produit->update($validated);

        return response()->json($produit);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produit $produit)
    {
        if($produit->image) Storage::disk('public')->delete($produit->image);
        $produit->delete();
        return response()->json([
            'message' => 'Produit supprime'
        ]);
    }
}
