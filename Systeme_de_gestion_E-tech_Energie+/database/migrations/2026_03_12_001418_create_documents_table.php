<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_client')->constrained('clients');
            $table->foreignId('id_user')->constrained('users');
            $table->string('numeroDoc')->unique();
            $table->date('dateDoc');
            $table->decimal('prixTotal', 15, 2)->default(0);
            $table->decimal('taxe', 5, 2)->default(18);
            $table->enum('statut', ['brouillon', 'valide', 'payer'])->default('brouillon');
            $table->enum('type', ['facture', 'devis', 'BL']);
            $table->enum('format', ['A3', 'A5', 'A4'])->default('A4');
            $table->boolean('stock_impacte')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
