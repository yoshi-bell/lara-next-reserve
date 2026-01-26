<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * メールアドレスを検証し、完了後にフロントエンドへリダイレクトする
     */
    public function __invoke(Request $request): RedirectResponse
    {
        // URLのIDからユーザーを取得
        $user = User::find($request->route('id'));

        if (! $user) {
            // ユーザーが存在しない場合、フロントエンドのエラーページへ
            return redirect(config('app.frontend_url') . '/login?error=invalid_user');
        }

        // 既に検証済みの場合
        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.frontend_url') . '/login?verified=1');
        }

        // ハッシュが一致するか確認 (signedミドルウェアでチェック済みだが念のため)
        if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
             return redirect(config('app.frontend_url') . '/login?error=invalid_hash');
        }

        // 検証完了処理
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // フロントエンドのサンクスページ（またはログインページ）へリダイレクト
        return redirect(config('app.frontend_url') . '/thanks');
    }
}