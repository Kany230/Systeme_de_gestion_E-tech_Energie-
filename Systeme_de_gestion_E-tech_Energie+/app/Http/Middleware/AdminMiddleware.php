<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
{
    // On vérifie si l'utilisateur est connecté ET s'il est admin
    if (auth()->check() && auth()->user()->isAdmin()) {
        return $next($request);
    }

    // Sinon, on bloque l'accès
    return response()->json(['message' => 'Accès refusé. Réservé aux administrateurs.'], 403);
}
}
