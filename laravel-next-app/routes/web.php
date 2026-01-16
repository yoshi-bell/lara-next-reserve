<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// ログイン
Route::post("/login", function (Request $request) {
    $credentials = $request->validate([
        "email" => ["required", "email"],
        "password" => ["required"],
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        return response()->json(Auth::user());
    }

    return response()->json([
        "message" => "The provided credentials do not match our records.",
    ], 401);
});

// ログアウト
Route::post("/logout", function (Request $request) {
    Auth::guard("web")->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return response()->noContent();
});
