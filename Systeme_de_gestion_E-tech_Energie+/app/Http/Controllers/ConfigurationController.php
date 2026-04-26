<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{

    /**
     * Display the specified resource.
     */
    public function show()
    {
        return Configuration::first();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
{
    // 1. On récupère ou on crée la première ligne de config
    $configuration = Configuration::firstOrCreate([], [
        'nom_entreprise' => 'Ma Société',
    ]);

    // 2. Validation des données
    $request->validate([
        'nom_entreprise' => 'sometimes|string|max:255',
        'email' => 'sometimes|email',
        'telephone' => 'sometimes|string',
        'ninea' => 'sometimes|string',
        'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    // 3. Mise à jour des textes
    $configuration->update($request->except('logo'));

    // 4. Gestion du logo (en supposant que ta méthode updateLogo() gère la suppression de l'ancien)
    if($request->hasFile('logo')){
        $configuration->updateLogo($request->file('logo'));
    }

    return response()->json($configuration->fresh());
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Configuration $configuration)
    {
        //
    }
}
