<?php

use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\VerifyEmailController;
use App\Http\Controllers\Api\AuthenticatedSessionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // ログインユーザー情報取得
    Route::get('/user', [UserController::class, 'show']);

    // ログアウト
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // メール認証済みのみ許可する機能
    Route::middleware('verified')->group(function () {
        // お気に入り機能
        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::post('/shops/{shop}/favorite', [FavoriteController::class, 'store']);
        Route::delete('/shops/{shop}/favorite', [FavoriteController::class, 'destroy']);

        // 予約機能
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);
    });
});

// 店舗関連
Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);
Route::get('/areas', [AreaController::class, 'index']);
Route::get('/genres', [GenreController::class, 'index']);

// 会員登録
Route::post('/register', [RegisterController::class, 'store']);

// ログイン
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// メール認証
Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');