<?php

namespace Tests\Feature;

use App\Mail\ReservationReminder;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Shop;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ReminderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * リマインダーメールが送信されること
     */
    public function test_reminder_email_is_sent(): void
    {
        Mail::fake();

        $user = User::factory()->create(['email_verified_at' => now()]);
        $shop = Shop::factory()->create();

        // 明日の予約を作成 (リマインダー対象)
        // ※コマンドのロジックに合わせて時間を調整（例: 09:00に翌日の予約をチェックする場合など）
        // ここでは一般的な「翌日の予約」として作成
        Reservation::factory()->create([
            'user_id' => $user->id,
            'shop_id' => $shop->id,
            'start_at' => Carbon::tomorrow()->setHour(18)->setMinute(0),
        ]);

        // コマンド実行
        $this->artisan('app:send-reservation-reminders')
             ->assertExitCode(0);

        // メールが送信されたか確認
        Mail::assertSent(ReservationReminder::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    /**
     * 対象外（当日や明後日）の予約にはメールが送信されないこと
     */
    public function test_reminder_email_is_not_sent_for_non_target_dates(): void
    {
        Mail::fake();

        $user = User::factory()->create(['email_verified_at' => now()]);
        
        // 当日の予約
        Reservation::factory()->create([
            'user_id' => $user->id,
            'start_at' => Carbon::today()->setHour(18),
        ]);

        // 明後日の予約
        Reservation::factory()->create([
            'user_id' => $user->id,
            'start_at' => Carbon::tomorrow()->addDay()->setHour(18),
        ]);

        // コマンド実行
        $this->artisan('app:send-reservation-reminders')
             ->assertExitCode(0);

        // メールが送信されていないことを確認
        Mail::assertNothingSent();
    }
}
