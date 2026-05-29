<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categorie::withCount('produits')->get();
        return response()->json($categories);
    }

    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string'
        ]);

        $categorie = Categorie::create($validated);
        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'categorie' => $categorie],
        201);
    }

   
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->delete();
        return response()->json(['message' => 'Catégorie supprimée avec succès']);
    }
}
