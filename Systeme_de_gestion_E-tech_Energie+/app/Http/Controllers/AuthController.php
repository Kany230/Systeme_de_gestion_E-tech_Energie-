<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\UserStatusNotification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;


class AuthController extends Controller
{
    //Inscription de l'utilisateur
    public function inscription(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,secretaire'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_validated' => false,
            'statut' => 'en_attente'
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'inscription reuissie'
        ], 210);
    }

    public function validerCompte($id){
        $user = User::findOrFail($id);
        
        $user->update([
            'is_validated' => true,
            'statut' => 'active'
        ]);

        $user->notify(new UserStatusNotification("Votre inscription a été validée par l'administrateur."));

        return response()->json(['message' => 'compte valide et email de notification envoye']);
    }

    public function bloquerCompte($id){
        $user = User::findOrFail($id);

        $user->update([
            'is_validated' => false,
            'statut' => 'blocked'
        ]);

        $user->notify(new UserStatusNotification("Votre compte a été bloquée par l'administrateur."));

        return response()->json(['message' => 'compte bloqué et email de notification envoyé']);
    }

     public function debloquerCompte($id){
        $user = User::findOrFail($id);

        $user->update([
            'is_validated' => true,
            'statut' => 'debloque'
        ]);

        $user->notify(new UserStatusNotification("Votre compte a été débloquée par l'administrateur."));

        return response()->json(['message' => 'compte débloqué et email de notification envoyé']);
    }

    public function connexion(Request $request){
        $request -> validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if(! $user || ! Hash::check($request->password, $user->password)){
            return response()->json([
                'message' => 'mot de passe incorrect'
            ], 401);
        }

        if(!$user->is_validated){
            return response()->json([
                'message' => "Votre compte n'est pas encore activé ou a été bloqué. Contactez l'administration."
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token-type' => 'Bearer'
        ]);
    }

    public function passwordOublier(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if($validator->fails()){
            return response()->json(['erreur' => $validator->errors()], 422);
        }

        //envoyer un lien dans l'email pour qu'il puisse changer de mot de passe
        $statut = Password::sendResetLink($request->only('email'));

        return $statut === Password::RESET_LINK_SENT
        ? response()->json(['message'=> 'Verifiez votre email s\' il vous plait.'])
        : response()->json(['message'=> 'Impossible d\'envoyer l\'email.']);
    }

    public function reinitialiserPassword(Request $request){
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8'
        ]);

        $statut = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password){
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $statut === Password::PASSWORD_RESET
        ? response()->json(['message'=> 'Votre mot de passe a ete change.'])
        : response()->json(['message'=> 'Impossible d\'envoyer l\'email.']);
    }

    public function deconnexion(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'deconnexion reuissie'
        ]);
    }

    public function listUsers(){
        $users = User::all();
        return response()->json([
            'users' => $users
        ]);
    }

    public function deleteUser(Request $request, $id){
        $user = User::findOrFail($id);

        //Empecher que l'admin supprime son propre compte
        if($user->id == $request->user()->id){
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte']);
        } 

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprime avec succes']);
    }

    public function me(Request $request)
{
    // Retourne les données de l'utilisateur authentifié par le token en JSON
    return response()->json($request->user());
}

    // À ajouter dans votre classe AuthController

public function modifierProfil(Request $request)
{
    $user = $request->user();

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:8|confirmed',
    ]);

    $user->name = $request->name;
    $user->email = $request->email;

    // On ne change le mot de passe que s'il a été rempli dans le formulaire
    if ($request->filled('password')) {
        $user->password = Hash::make($request->password);
    }

    $user->save();

    return response()->json([
        'user' => $user,
        'message' => 'Profil mis à jour avec succès.'
    ]);
}

    
}