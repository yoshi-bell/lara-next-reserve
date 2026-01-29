<?php

namespace Tests\Feature\Auth;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;
use App\Models\User;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 新規ユーザー登録ができる
     */
    public function test_新規ユーザー登録ができる(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'phone_number' => '09012345678',
            'gender' => 'male',
            'age' => 30,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);

        // メール認証の通知が送信されたことを確認
        $user = User::where('email', 'test@example.com')->first();
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    /**
     * 必須項目不足でバリデーションエラーになる
     */
    public function test_必須項目が不足していると登録できない(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password', 'phone_number', 'gender', 'age']);
    }

    /**
     * パスワードが短いとエラーになる
     */
    public function test_パスワードが短いと登録できない(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'pass', // 短い
            'phone_number' => '09012345678',
            'gender' => 'male',
            'age' => 30,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * メールアドレスが重複しているとエラーになる
     */
    public function test_メールアドレスが重複していると登録できない(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com', // 重複
            'password' => 'password',
            'phone_number' => '09012345678',
            'gender' => 'male',
            'age' => 30,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
