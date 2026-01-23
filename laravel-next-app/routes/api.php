<?php

use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\GenreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);

Route::get('/areas', [AreaController::class, 'index']);
Route::get('/genres', [GenreController::class, 'index']);

// 登録
Route::post('/register', [RegisterController::class, 'store']);

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
