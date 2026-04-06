<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Client::all());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'addresse' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20'
        ]);

        $client = Client::create($validate);
        return response()->json($client, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return response()->json($client);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $client->update($request->all());

        return response()->json($client);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        if ($client->documents()->count() > 0){
            return response()->json([
                'message' => 'Ce client ne peut pas etre supprime'
            ], 403);
        }

        $client->delete();
        return response()->json([
            'message' => 'Client supprime'
        ]);
    }

    public function getDocuments(Client $client){
        $documents = $client->documents()->orderBy('dateDoc', 'desc')->get();
        return response()->json($documents);
    }

    public function calculerSolde(Client $client){
        $solde = $client->documents()
        ->where('type', 'facture')
        ->where('statut', 'payer')
        ->sum('prixTotal');
        
        return response()->json([
            'client' => $client->nom. ' '. $client->prenom,
            'solde' => $solde
        ]);
    }
}
