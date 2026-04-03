<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\ProduitController;
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

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/deconnexion', [AuthController::class, 'deconnexion']);
    Route::get('/configuration', [ConfigurationController::class, 'show']);
    Route::post('/configuration', [ConfigurationController::class, 'update']);
    Route::get('/produits', [ProduitController::class, 'index']);
    Route::post('/produits', [ProduitController::class, 'store']);
    Route::get('/produits/{produit}', [ProduitController::class, 'show']);
    Route::put('/produits/{produit}', [ProduitController::class, 'update']);
    Route::delete('produits/{produit}', [ProduitController::class, 'destroy']);
    Route::get('rupture', [ProduitController::class, 'getProduitsEnRupture']);
});
