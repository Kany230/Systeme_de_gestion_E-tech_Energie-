<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MouvementStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'produit_id',
        'user_id',
        'type',
        'quantite',
        'motif'
    ];

    public function produit() {
        return $this->belongsTo(Produit::class, 'produit_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
