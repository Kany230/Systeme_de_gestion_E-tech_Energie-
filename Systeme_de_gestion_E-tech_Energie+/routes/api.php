<?php

use App\Http\Controllers\{
    AuthController,
    ClientController,
    ConfigurationController,
    DocumentController,
    LigneCommandeController,
    ProduitController,
    DashboardController,
    CategorieController,
    MouvementStockController
};
use Illuminate\Support\Facades\Route;

// --- Routes Publiques ---
Route::post('/inscription', [AuthController::class, 'inscription']);
Route::post('/connexion', [AuthController::class, 'connexion']);
Route::post('/oublierpwd', [AuthController::class, 'passwordOublier']);
Route::post('/reinitialise/{token}', [AuthController::class, 'reinitialiserPassword']);

// --- Routes Protégées (Tous utilisateurs connectés) ---
Route::middleware('auth:sanctum')->group(function () {
    // Session & Profil
    Route::post('/deconnexion', [AuthController::class, 'deconnexion']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/user/profile', [AuthController::class, 'modifierProfil']);

    // Produits — route statique AVANT la route dynamique {produit}
    Route::get('/produits/rupture', [ProduitController::class, 'getProduitsEnRupture']);
    Route::get('/produits', [ProduitController::class, 'index']);
    Route::get('/produits/{produit}', [ProduitController::class, 'show']);

    // Catégories & Stock
    Route::get('/categories', [CategorieController::class, 'index']);
    Route::get('/mouvements-stock', [MouvementStockController::class, 'index']);

    // Clients
    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/{client}', [ClientController::class, 'show']);
    Route::get('/clients/{client}/documents', [ClientController::class, 'getDocuments']);
    Route::get('/clients/{client}/solde', [ClientController::class, 'calculerSolde']);

    // Documents
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::get('/documents/{document}/pdf', [DocumentController::class, 'genererPDF']);

    // Dashboard — accessibles à tous les utilisateurs connectés
    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);
    Route::get('/dashboard/commandes', [DashboardController::class, 'derniersCommandes']);
    Route::get('/dashboard/stock-faible', [DashboardController::class, 'stockFaible']);
});

// --- Routes Réservées à l'Administrateur ---
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Gestion des utilisateurs
    Route::get('/users', [AuthController::class, 'listUsers']);
    Route::put('/users/{id}/valider', [AuthController::class, 'validerCompte']);
    Route::put('/users/{id}/bloquer', [AuthController::class, 'bloquerCompte']);
    Route::put('/users/{id}/debloquer', [AuthController::class, 'debloquerCompte']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);

    // Configuration
    Route::get('/configuration', [ConfigurationController::class, 'show']);
    Route::put('/configuration', [ConfigurationController::class, 'update']);

    // Produits (écriture)
    Route::post('/produits', [ProduitController::class, 'store']);
    Route::put('/produits/{produit}', [ProduitController::class, 'update']);
    Route::put('/produits/{produit}/stock', [ProduitController::class, 'modifierStock']);
    Route::delete('/produits/{produit}', [ProduitController::class, 'destroy']);

    // Catégories (écriture)
    Route::post('/categories', [CategorieController::class, 'store']);
    Route::delete('/categories/{id}', [CategorieController::class, 'destroy']);

    // Clients (écriture)
    Route::post('/clients', [ClientController::class, 'store']);
    Route::put('/clients/{client}', [ClientController::class, 'update']);
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);

    // Documents (écriture & workflow)
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::put('/documents/{document}', [DocumentController::class, 'update']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
    Route::post('/documents/{document}/valider', [DocumentController::class, 'valider']);
    Route::post('/documents/{devis}/convertir-en-facture', [DocumentController::class, 'convertirEnFacture']);
    Route::post('/documents/{facture}/convertir-en-bl', [DocumentController::class, 'convertirEnBL']);

    // Lignes de commande
    Route::put('/ligne-commandes/{ligneCommande}', [LigneCommandeController::class, 'update']);
    Route::delete('/ligne-commandes/{ligneCommande}', [LigneCommandeController::class, 'destroy']);

    // Rapports — noms alignés avec les pages frontend
    Route::get('/dashboard/rapports/events', [DashboardController::class, 'rapportEvents']);
    Route::get('/dashboard/rapports/action', [DashboardController::class, 'rapportAction']);
    Route::get('/dashboard/rapports/clients', [DashboardController::class, 'rapportClients']);
});