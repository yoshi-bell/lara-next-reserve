<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\ReservationSlot;
use App\Models\Shop;
use App\Models\User;
use App\Services\ReservationService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Mail;
use Exception;

class ReservationSeeder extends Seeder
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // シーダー実行時はメールを送信しない
        Mail::fake();

        $users = User::all();
        $shops = Shop::all();

        if ($users->isEmpty() || $shops->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // 未来の予約 3件
            $this->createReservationsForUser($user, $shops, 3, 'future');

            // 過去の予約 2件
            $this->createReservationsForUser($user, $shops, 2, 'past');
        }
    }

    private function createReservationsForUser($user, $shops, $count, $type)
    {
        $createdCount = 0;
        $attempts = 0;
        $maxAttempts = 50; // 無限ループ防止

        while ($createdCount < $count && $attempts < $maxAttempts) {
            $attempts++;

            $shop = $shops->random();
            $stayTime = $shop->default_stay_time ?? 60; // 店舗ごとの滞在時間
            $number = rand(1, 4); // 1~4名

            // 店舗の営業時間を考慮した日時の決定
            $startAt = $this->generateRandomDateTimeForShop($shop, $type);

            // ユーザー重複チェック
            if ($this->hasUserConflict($user->id, $startAt, $stayTime)) {
                continue;
            }

            // スロットの準備と容量チェック
            // ※ここでのチェックは「スロットを作る」ため。
            //   実際の予約作成時のロック＆チェックはServiceが行う。
            if (!$this->prepareSlots($shop, $startAt, $stayTime, $number)) {
                continue; // 満席などで確保できなかった場合
            }

            try {
                // Serviceを使って予約作成（在庫更新、トランザクション含む）
                $this->reservationService->createReservation(
                    $user,
                    $shop->id,
                    $startAt,
                    $number
                );
                $createdCount++;
            } catch (Exception $e) {
                // Service側で競合などで失敗した場合はスキップして再試行
                continue;
            }
        }
    }

    private function generateRandomDateTimeForShop($shop, $type)
    {
        // 店舗の営業時間をパース
        $startHour = (int) substr($shop->start_time, 0, 2);
        $endHour = (int) substr($shop->end_time, 0, 2);
        
        // 滞在時間を考慮した最終予約可能時間（閉店時間の少し前まで）
        $lastOrderHour = max($startHour, $endHour - 1); 

        $baseDate = $type === 'future' 
            ? Carbon::tomorrow()->addDays(rand(0, 14)) // 明日〜2週間後
            : Carbon::yesterday()->subDays(rand(0, 14)); // 昨日〜2週間前

        $hour = rand($startHour, $lastOrderHour);
        $minute = rand(0, 1) * 30;

        $dt = $baseDate->copy()->setTime($hour, $minute, 0);
        $closeTime = $baseDate->copy()->setTime($endHour, 0, 0);

        if ($dt->gte($closeTime)) {
            $dt->setTime($startHour, 0, 0);
        }

        return $dt;
    }

    private function hasUserConflict($userId, $startAt, $stayTime)
    {
        $endAt = $startAt->copy()->addMinutes($stayTime);

        return Reservation::where('user_id', $userId)
            ->where(function ($query) use ($startAt, $endAt) {
                $query->where('start_at', '<', $endAt)
                      ->whereRaw('DATE_ADD(start_at, INTERVAL usage_time MINUTE) > ?', [$startAt]);
            })
            ->exists();
    }

    /**
     * 指定された日時のスロットが存在することを確認し、なければ作成する。
     * また、現在の空き容量が十分かチェックする。
     */
    private function prepareSlots($shop, $startAt, $stayTime, $number)
    {
        $slotsNeeded = ceil($stayTime / 30);
        $current = $startAt->copy();
        
        for ($i = 0; $i < $slotsNeeded; $i++) {
            $slot = ReservationSlot::firstOrNew([
                'shop_id' => $shop->id,
                'slot_datetime' => $current,
            ], [
                'max_capacity' => $shop->default_capacity ?? 10,
                'current_reserved' => 0,
            ]);

            // 新規作成の場合は保存
            if (!$slot->exists) {
                $slot->save();
            }

            // 容量チェック
            if (($slot->max_capacity - $slot->current_reserved) < $number) {
                return false; // 容量不足
            }
            
            $current->addMinutes(30);
        }

        return true;
    }
}