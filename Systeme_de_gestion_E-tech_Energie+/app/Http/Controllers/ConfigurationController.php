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
        $configuration = Configuration::first();

        $configuration->update($request->all());

        if($request->hasFile('logo')){
            $configuration->updateLogo($request->file('logo'));
        }

        return response()->json($configuration);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Configuration $configuration)
    {
        //
    }
}
