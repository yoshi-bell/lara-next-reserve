<?php

use App\Http\Controllers\ShopController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);

// 登録
Route::post("/register", function (Request $request) {
    $validated = $request->validate([
        "name" => ["required", "string", "max:255"],
        "email" => ["required", "string", "email", "max:255", "unique:users"],
        "password" => ["required", "string", "min:8", "confirmed"],
        "phone_number" => ["required", "string", "max:20"], // 電話番号
        "gender" => ["required", "string", "in:male,female,other"], // 性別
        "age" => ["required", "integer", "min:0"], // 年齢
    ]);

    $user = User::create([
        "name" => $validated["name"],
        "email" => $validated["email"],
        "password" => Hash::make($validated["password"]),
        "phone_number" => $validated["phone_number"],
        "gender" => $validated["gender"],
        "age" => $validated["age"],
    ]);

    Auth::login($user); // 登録後すぐにログインさせる

    return response()->json($user);
});

