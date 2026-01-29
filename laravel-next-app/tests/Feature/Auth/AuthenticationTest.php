<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Sanctumのステートフルドメイン設定
        config(['sanctum.stateful' => ['localhost']]);

        $this->withHeaders([
            'Referer' => 'http://localhost',
            'Accept' => 'application/json',
        ]);
    }

    /**
     * 正しい認証情報でログインできるか
     */
    public function test_ユーザーがログインできる(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertAuthenticated();
    }

    /**
     * 間違ったパスワードでログインできないか
     */
    public function test_パスワードが間違っているとログインできない(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401);
        $this->assertGuest();
    }

    /**
     * メール未認証ユーザーはログインできないか
     */
    public function test_メール未認証だとログインできない(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(403);
        $this->assertGuest();
    }

    /**
     * 必須項目が不足している場合はログインできない（バリデーション）
     */
    public function test_必須項目が空だとログインできない(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => '',
            'password' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    /**
     * ログアウトできるか
     */
    public function test_ログアウトできる(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user, 'web')->postJson('/api/logout');

        $this->assertGuest('web');
    }

    /**
     * ログイン中のユーザー情報を取得できるか
     */
    public function test_ログイン中のユーザー情報を取得できる(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        // web ガードを明示的に指定
        $response = $this->actingAs($user, 'web')->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }
}
