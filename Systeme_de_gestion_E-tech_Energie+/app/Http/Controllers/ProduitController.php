<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produits = Produit::all();
        return response()->json($produits);
    }

    public function getProduitsEnRupture(){
        $produits = Produit::whereColumn('stock', '<=', 'seuilAlerte')->get();
        return response()->json($produits);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
            'image' => 'nullable|string'
        ]);

        if(request()->hasFile('image')){
            $imagePath = request()->file('image')->store('produits', 'public');
            $validate['image'] = $imagePath;
        }

        $produit = Produit::create($validate);
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
            $produit->diminuerStock($request->quantite);
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
        $produit->update($request->all());
        if (request()->hasFile('image')){
            if($produit->image) Storage::disk(('public'))->delete($produit->image);
            $imagePath = request()->file('image')->store('produits', 'public');
            $produit->update(['image' => $imagePath]);
        }

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
