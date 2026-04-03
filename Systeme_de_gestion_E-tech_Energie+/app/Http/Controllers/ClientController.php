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
            'name' => 'required|string|max:255',
            'telephone' => 'required|string|max:20'
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
        $documents = $client->documents()->orderBy('date', 'desc')->get();
        return response()->json($documents);
    }

    public function calculerSolde(Client $client){
        $solde = $client->documents()
        ->where('type', 'facture')
        ->where('etat', 'impayee')
        ->sum('montant');
        
        return response()->json([
            'client' => $client->name,
            'solde' => $solde
        ]);
    }
}
