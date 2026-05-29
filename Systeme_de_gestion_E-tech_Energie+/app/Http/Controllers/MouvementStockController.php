<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\MouvementStock;

class MouvementStockController extends Controller
{
    public function index()
    {
        $mouvements = MouvementStock::with(['produit:id,nom', 'user:id,name'])->orderBy('created_at', 'desc')->get();
        return response()->json($mouvements);
    }
}
