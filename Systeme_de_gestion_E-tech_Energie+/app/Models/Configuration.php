<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
