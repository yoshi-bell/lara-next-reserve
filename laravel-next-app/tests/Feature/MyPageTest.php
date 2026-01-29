<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\Reservation;
use App\Models\ReservationSlot;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['sanctum.stateful' => ['localhost']]);
    }

    /**
     * 自分の予約一覧を取得できる
     */
    public function test_user_can_get_my_reservations(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $otherUser = User::factory()->create(['email_verified_at' => now()]);
        
        // 自分の予約
        Reservation::factory()->create(['user_id' => $user->id]);
        // 他人の予約
        Reservation::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->getJson('http://localhost/api/reservations');

        $response->assertStatus(200)
                 ->assertJsonCount(1); // 自分のが1件だけ
    }

    /**
     * 自分のお気に入り一覧を取得できる
     */
    public function test_user_can_get_my_favorites(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $shop = Shop::factory()->create();

        // お気に入り登録
        Favorite::create([
            'user_id' => $user->id,
            'shop_id' => $shop->id,
        ]);

        $response = $this->actingAs($user)->getJson('http://localhost/api/favorites');

        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    /**
     * 自分の予約をキャンセル（物理削除）できる
     */
    public function test_user_can_cancel_own_reservation(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $reservation = Reservation::factory()->create(['user_id' => $user->id]);

        // キャンセル時に在庫を戻す処理があるため、Slotも作っておく必要がある
        // (ReservationFactoryでstart_atがランダム生成されるため、それに合わせたSlotを作る)
        $shop = $reservation->shop;
        ReservationSlot::create([
            'shop_id' => $shop->id,
            'slot_datetime' => $reservation->start_at,
            'max_capacity' => 10,
            'current_reserved' => $reservation->number, // 予約分埋まっている状態
        ]);

        $response = $this->actingAs($user)->deleteJson('http://localhost/api/reservations/' . $reservation->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('reservations', ['id' => $reservation->id]);
    }

    /**
     * 他人の予約はキャンセルできない
     */
    public function test_user_cannot_cancel_others_reservation(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $otherUser = User::factory()->create(['email_verified_at' => now()]);
        $reservation = Reservation::factory()->create(['user_id' => $otherUser->id]); // 他人の予約

        $response = $this->actingAs($user)->deleteJson('http://localhost/api/reservations/' . $reservation->id);

        $response->assertStatus(403); // Forbidden
        $this->assertDatabaseHas('reservations', ['id' => $reservation->id]); // 消えていないこと
    }
}