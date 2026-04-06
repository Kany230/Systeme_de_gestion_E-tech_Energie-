<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $nom
 * @property string $description
 * @property float $prix
 * @property int $stock
 * @property int $seuilAlerte
 * @property string|null $image
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Produit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Produit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Produit query()
 * @method static \Illuminate\Database\Eloquent\Builder|Produit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Produit whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Produit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Produit whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Produit whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Produit wherePrix($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Produit whereSeuilAlerte($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Produit whereStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Produit whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'prix',
        'stock',
        'seuilAlerte'
    ];

    public function verifierSeuil(){
        return $this->stock <= $this->seuilAlerte;
    }

    public function diminuerStock($quantite){
        if($this->stock >= $quantite){
            $this->stock -= $quantite;
            $this->save();
        }else{
            throw new \Exception("Stock insuffisant");
        }
    }
}
