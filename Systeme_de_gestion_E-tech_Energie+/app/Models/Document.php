<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\LigneCommande;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'numeroDoc',
        'dateDoc',
        'nomClient',
        'prixTotal',
        'taxe',
        'statut',
        'format'
    ];

    public function ligneDocument(){
        return $this->hasMany(LigneCommande::class);
    }

    public function client(){
        return $this->belongsTo(Client::class);
    }

    public function getTotalTTC(){
        return $this->prixTotal * (1 + ($this->taxe / 100));
    }
}
