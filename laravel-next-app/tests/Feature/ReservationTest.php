<?php

namespace Tests\Feature;

use App\Mail\ReservationCompleted;
use App\Models\Reservation;
use App\Models\ReservationSlot;
use App\Models\Shop;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['sanctum.stateful' => ['localhost']]);
    }

    /**
     * API経由で予約ができること
     */
    public function test_user_can_reserve_via_api(): void
    {
        Mail::fake();

        $user = User::factory()->create(['email_verified_at' => now()]);
        $shop = Shop::factory()->create(['default_stay_time' => 60]); // 60分滞在
        $startAt = Carbon::tomorrow()->setHour(18)->setMinute(0);

        // 予約枠（在庫）を作成しておく
        ReservationSlot::create([
            'shop_id' => $shop->id,
            'slot_datetime' => $startAt,
            'max_capacity' => 10,
            'current_reserved' => 0,
        ]);
        ReservationSlot::create([
            'shop_id' => $shop->id,
            'slot_datetime' => $startAt->copy()->addMinutes(30),
            'max_capacity' => 10,
            'current_reserved' => 0,
        ]);

        $response = $this->actingAs($user)
            ->postJson('http://localhost/api/reservations', [
                'shop_id' => $shop->id,
                'start_at' => $startAt->format('Y-m-d H:i'),
                'number' => 2,
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reservations', [
            'user_id' => $user->id,
            'shop_id' => $shop->id,
            'number' => 2,
        ]);

        // メール送信確認
        Mail::assertSent(ReservationCompleted::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    /**
     * 満席の場合は予約できないこと
     */
    public function test_reservation_fails_when_capacity_is_full(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $shop = Shop::factory()->create(['default_stay_time' => 60]);
        $startAt = Carbon::tomorrow()->setHour(18)->setMinute(0);

        // 予約枠（満席状態）を作成
        ReservationSlot::create([
            'shop_id' => $shop->id,
            'slot_datetime' => $startAt,
            'max_capacity' => 2,
            'current_reserved' => 2, // 満席
        ]);
        // 滞在時間分の次のスロットも必要
        ReservationSlot::create([
            'shop_id' => $shop->id,
            'slot_datetime' => $startAt->copy()->addMinutes(30),
            'max_capacity' => 2,
            'current_reserved' => 0, // こちらは空いているとしても、最初のスロットが満席ならNG
        ]);

        $response = $this->actingAs($user)
            ->postJson('http://localhost/api/reservations', [
                'shop_id' => $shop->id,
                'start_at' => $startAt->format('Y-m-d H:i'),
                'number' => 1,
            ]);

        // 実装に合わせて 400 エラーとメッセージを検証
        $response->assertStatus(400)
                 ->assertJson(['message' => '満席の時間帯が含まれています。']);
    }

    /**
     * 必須項目不足でバリデーションエラーになる
     */
    public function test_reservation_validation_required_fields(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('http://localhost/api/reservations', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['shop_id', 'start_at', 'number']);
    }

    /**
     * 過去の日付で予約できないこと
     */
    public function test_reservation_validation_past_date(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('http://localhost/api/reservations', [
                'shop_id' => $shop->id,
                'start_at' => Carbon::yesterday()->format('Y-m-d H:i'),
                'number' => 2,
            ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['start_at']);
    }

    /**
     * 重複予約（同じ時間の予約）はバリデーションエラーになること
     */
    public function test_reservation_validation_duplicate_time(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create(['default_stay_time' => 60]);
        $startAt = Carbon::tomorrow()->setHour(19)->setMinute(0);

        // 予約枠の準備
        ReservationSlot::create([
            'shop_id' => $shop->id,
            'slot_datetime' => $startAt,
            'max_capacity' => 10,
            'current_reserved' => 0,
        ]);
        ReservationSlot::create([
            'shop_id' => $shop->id,
            'slot_datetime' => $startAt->copy()->addMinutes(30),
            'max_capacity' => 10,
            'current_reserved' => 0,
        ]);

        // 1回目の予約（成功するはず）
        $this->actingAs($user)->postJson('http://localhost/api/reservations', [
            'shop_id' => $shop->id,
            'start_at' => $startAt->format('Y-m-d H:i'),
            'number' => 2,
        ]);

        // 2回目の予約（失敗するはず）
        $response = $this->actingAs($user)->postJson('http://localhost/api/reservations', [
            'shop_id' => $shop->id,
            'start_at' => $startAt->format('Y-m-d H:i'),
            'number' => 2,
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['start_at']);
    }

    // --- 以下、既存のモデルテスト ---

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
