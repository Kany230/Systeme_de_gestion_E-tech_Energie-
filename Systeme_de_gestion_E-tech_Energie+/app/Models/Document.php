<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\LigneCommande;

/**
 * @property int $id
 * @property int $id_client
 * @property int $id_user
 * @property string $numeroDoc
 * @property string $dateDoc
 * @property string $prixTotal
 * @property string $taxe
 * @property string $statut
 * @property string $type
 * @property string $format
 * @property int $stock_impacte
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client $client
 * @property-read \Illuminate\Database\Eloquent\Collection<int, LigneCommande> $ligneDocument
 * @property-read int|null $ligne_document_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Document newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Document newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Document query()
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereDateDoc($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereFormat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereIdClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereIdUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereNumeroDoc($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document wherePrixTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereStockImpacte($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereTaxe($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Document whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_client',
        'id_user',
        'numeroDoc',
        'dateDoc',
        'nomClient',
        'prixTotal',
        'taxe',
        'statut',
        'format',
        'type',
        'stock_impacte'
    ];

    public function ligneDocument(){
        return $this->hasMany(LigneCommande::class, 'id_doc');
    }

    public function client(){
        return $this->belongsTo(Client::class, 'id_client');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function getTotalTTC(){
        return $this->prixTotal * (1 + ($this->taxe / 100));
    }

    public function isFacture(){
        return $this->type === 'facture';
    }

    public function isDevis(){
        return $this->type === 'devis';
    }

    public function totalDoc(){
        $total = $this->ligneDocument->sum('sousTotal');
        $montantTTC = $total * (1 + ($this->taxe / 100));
        $this->update(['prixTotal' => $montantTTC]);
        return $montantTTC;
        
    }
}
