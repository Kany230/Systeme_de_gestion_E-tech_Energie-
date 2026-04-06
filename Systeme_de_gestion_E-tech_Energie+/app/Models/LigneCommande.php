<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $id_doc
 * @property int $id_produit
 * @property int $quantite
 * @property string $prixUnitaire
 * @property string $sousTotal
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Document $document
 * @property-read \App\Models\Produit $produit
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande query()
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande whereIdDoc($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande whereIdProduit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande wherePrixUnitaire($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande whereQuantite($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande whereSousTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LigneCommande whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class LigneCommande extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_doc',
        'id_produit',
        'quantite',
        'prixUnitaire',
        'sousTotal'
    ];

    public function document(){
        return $this->belongsTo(Document::class, 'id_doc');
    }

    public function produit(){
        return $this->belongsTo(Produit::class, 'id_produit');
    }

    public function calculerTotalLigne(){
        $this->sousTotal = $this->quantite * $this->prixUnitaire;
        $this->save();
        return $this->sousTotal;
    }
}
