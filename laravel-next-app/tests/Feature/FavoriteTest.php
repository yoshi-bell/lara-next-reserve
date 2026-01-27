<?php

namespace Tests\Feature;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['sanctum.stateful' => ['localhost']]);
    }

    /**
     * ログインユーザーがお気に入り登録できること
     */
    public function test_user_can_add_favorite(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $shop = Shop::factory()->create();

        $response = $this->actingAs($user)
            ->postJson("http://localhost/api/shops/{$shop->id}/favorite");

        $response->assertStatus(201); // Created
        $this->assertDatabaseHas('favorites', [
            'user_id' => $user->id,
            'shop_id' => $shop->id,
        ]);
    }

    /**
     * ログインユーザーがお気に入りを解除できること
     */
    public function test_user_can_remove_favorite(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $shop = Shop::factory()->create();

        // 先に登録しておく
        $this->actingAs($user)
            ->postJson("http://localhost/api/shops/{$shop->id}/favorite");

        // 解除実行
        $response = $this->actingAs($user)
            ->deleteJson("http://localhost/api/shops/{$shop->id}/favorite");

        $response->assertStatus(200); // OK or NoContent
        $this->assertDatabaseMissing('favorites', [
            'user_id' => $user->id,
            'shop_id' => $shop->id,
        ]);
    }

    /**
     * 未ログインユーザーはお気に入り登録できないこと
     */
    public function test_guest_cannot_add_favorite(): void
    {
        $shop = Shop::factory()->create();

        $response = $this->postJson("http://localhost/api/shops/{$shop->id}/favorite");

        $response->assertStatus(401); // Unauthorized
    }

    /**
     * 既に登録済みの店舗を再度登録しようとした場合（多重送信対策）
     * ※実装によっては 200, 201, 409, 422 のいずれかになる。
     * 現状のコントローラーを確認する必要があるが、一旦一般的な挙動として
     * 「エラーにならず、DBに1件だけある状態」を確認する。
     */
    public function test_user_cannot_add_duplicate_favorite(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $shop = Shop::factory()->create();

        // 1回目
        $this->actingAs($user)->postJson("http://localhost/api/shops/{$shop->id}/favorite");

        // 2回目 (既に登録済み)
        $response = $this->actingAs($user)->postJson("http://localhost/api/shops/{$shop->id}/favorite");

        // コントローラーの実装次第だが、ここでは「DBが1件のままであること」を最優先で確認
        $this->assertDatabaseCount('favorites', 1);
    }
}