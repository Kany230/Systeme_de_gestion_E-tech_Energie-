<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\LigneCommandeController;
use App\Http\Controllers\ProduitController;
use App\Models\Client;
use App\Models\LigneCommande;
use GuzzleHttp\Handler\Proxy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('/inscription', [AuthController::class, 'inscription']);
Route::post('/connexion', [AuthController::class, 'connexion']);
Route::post('/oublierpwd', [AuthController::class, 'passwordOublier']);
Route::post('/reinitialise/{token}', [AuthController::class, 'reinitialierPassword']);
// Cette route ne fait rien techniquement, elle sert juste de "nom" pour l'email
Route::get('/reinitialise/{token}', function ($token) {
    return response()->json(['token' => $token]);
})->name('password.reset');

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    //Configuration
    Route::get('/configuration', [ConfigurationController::class, 'show']);
    Route::post('/configuration', [ConfigurationController::class, 'update']);
    //documents
    Route::put('/documents/{document}', [DocumentController::class, 'update']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
    //Clients
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/deconnexion', [AuthController::class, 'deconnexion']);
   
    //Produits
    Route::get('/produits', [ProduitController::class, 'index']);
    Route::post('/produits', [ProduitController::class, 'store']);
    Route::get('/produits/{produit}', [ProduitController::class, 'show']);
    Route::put('/produits/{produit}', [ProduitController::class, 'update']);
    Route::delete('produits/{produit}', [ProduitController::class, 'destroy']);
    Route::get('rupture', [ProduitController::class, 'getProduitsEnRupture']);
    //Clients
    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::put('/clients/{client}', [ClientController::class, 'update']);
    Route::get('/clients/{client}', [ClientController::class, 'show']);
    Route::get('/clients/{client}/documents', [ClientController::class, 'getDocuments']);
    Route::get('/clients/{client}/solde', [ClientController::class, 'calculerSolde']);
    //Documents
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::post('/documents/{document}/valider', [DocumentController::class, 'valider']);
    Route::post('/documents/{devis}/convertir-en-facture', [DocumentController::class, 'convertirEnFacture']);
    Route::post('/documents/{facture}/convertir-en-bl', [DocumentController::class, 'convertirEnBL']);
    Route::get('/documents/{document}/pdf', [DocumentController::class, 'genererPDF']);
    //Ligne Commande
    Route::put('/ligne-commandes/{ligneCommande}', [LigneCommandeController::class, 'update']);
    Route::delete('/ligne-commandes/{ligneCommande}', [LigneCommandeController::class, 'destroy']);
});
