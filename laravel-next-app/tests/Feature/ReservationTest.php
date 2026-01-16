<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\UniqueConstraintViolationException;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * ユーザーが予約を持ち、正しくリレーションが機能することをテスト
     */
    public function test_user_can_have_reservations(): void
    {
        $user = User::factory()->create();
        $reservation = Reservation::factory()->create(['user_id' => $user->id]);

        $this->assertCount(1, $user->reservations);
        $this->assertEquals($reservation->id, $user->reservations->first()->id);
    }

    /**
     * 予約が特定の店舗に紐付いていることをテスト
     */
    public function test_reservation_belongs_to_shop(): void
    {
        $shop = Shop::factory()->create();
        $reservation = Reservation::factory()->create(['shop_id' => $shop->id]);

        $this->assertInstanceOf(Shop::class, $reservation->shop);
        $this->assertEquals($shop->id, $reservation->shop->id);
    }

    /**
     * 同じユーザーが同じ時間に予約しようとした際、DBレベルで制約がかかることをテスト
     */
    public function test_duplicate_reservation_prevented_by_unique_constraint(): void
    {
        $user = User::factory()->create();
        $startTime = now()->addDay()->format('Y-m-d H:i:s');

        // 1つ目の予約
        Reservation::factory()->create([
            'user_id' => $user->id,
            'start_at' => $startTime,
        ]);

        // 2つ目の同一時間予約は例外が発生するはず
        $this->expectException(UniqueConstraintViolationException::class);

        Reservation::factory()->create([
            'user_id' => $user->id,
            'start_at' => $startTime,
        ]);
    }

    /**
     * 予約の論理削除（Soft Delete）が機能することをテスト
     */
    public function test_reservation_can_be_soft_deleted(): void
    {
        $reservation = Reservation::factory()->create();

        $reservation->delete();

        // データベースには存在するが、通常のクエリでは取得できない
        $this->assertSoftDeleted('reservations', ['id' => $reservation->id]);
        $this->assertCount(0, Reservation::all());
        $this->assertCount(1, Reservation::withTrashed()->get());
    }
}
