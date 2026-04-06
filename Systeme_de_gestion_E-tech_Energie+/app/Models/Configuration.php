<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string $nomSociete
 * @property string $ninea
 * @property string $rib
 * @property string $phraseLegale
 * @property string $logo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration query()
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration whereNinea($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration whereNomSociete($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration wherePhraseLegale($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration whereRib($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Configuration whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Configuration extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomSociete',
        'ninea',
        'rib',
        'phraseLegale',
        'logo'
    ];

    public function updateLogo($image){
        //supprimer l'ancien logo
        if($this->logo){
            Storage::disk('public')->delete($this->logo);
        }

        //stocker le nouveau logo
        $path = $image->store('logos', 'public');

        $this->update(['logo' => $path]);
    }

    public function getMentionLegales(){
        return "NINEA/RC: {$this->ninea} - RIB: {$this->rib} - {$this->phraseLegale}";
    }
}
