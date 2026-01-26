<?php

use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\VerifyEmailController; // 追加
use App\Http\Controllers\ShopController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReservationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

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

Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);

Route::get('/areas', [AreaController::class, 'index']);
Route::get('/genres', [GenreController::class, 'index']);

// 登録
Route::post('/register', [RegisterController::class, 'store']);

// メール認証
Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// ログイン
Route::post("/login", function (Request $request) {
    $credentials = $request->validate([
        "email" => ["required", "email"],
        "password" => ["required"],
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // メール認証チェック
        if (! $user->hasVerifiedEmail()) {
            Auth::guard("web")->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return response()->json([
                "message" => "メール認証が完了していません。メール内のリンクを確認してください。",
            ], 403);
        }

        return response()->json($user);
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
