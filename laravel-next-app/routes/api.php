<?php

use App\Http\Controllers\ShopController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);
