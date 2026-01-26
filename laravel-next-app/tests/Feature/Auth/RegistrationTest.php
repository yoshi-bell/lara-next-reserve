<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 新規ユーザー登録ができる
     */
    public function test_new_users_can_register(): void
    {
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
    }

    /**
     * 必須項目不足でバリデーションエラーになる
     */
    public function test_registration_validation_required_fields(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password', 'phone_number', 'gender', 'age']);
    }

    /**
     * パスワードが短いとエラーになる
     */
    public function test_registration_validation_password_length(): void
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
    public function test_registration_validation_email_unique(): void
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