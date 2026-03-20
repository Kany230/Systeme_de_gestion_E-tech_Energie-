<?php

namespace App\Http\Controllers;

use App\Models\User;
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
            'role' => $request->role
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'inscription reuissie'
        ], 210);
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

    public function reinitialierPassword(Request $request){
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
}
