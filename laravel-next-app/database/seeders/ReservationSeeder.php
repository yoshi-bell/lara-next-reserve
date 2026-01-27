<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\ReservationSlot;
use App\Models\Shop;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

            // 店舗の容量チェック（スロット確保）
            if (!$this->ensureSlots($shop, $startAt, $stayTime, $number)) {
                continue; // 満席などで確保できなかった場合
            }

            // 予約作成
            Reservation::create([
                'user_id' => $user->id,
                'shop_id' => $shop->id,
                'start_at' => $startAt,
                'number' => $number,
                'usage_time' => $stayTime,
            ]);

            $createdCount++;
        }
    }

    private function generateRandomDateTimeForShop($shop, $type)
    {
        // 店舗の営業時間をパース
        $startHour = (int) substr($shop->start_time, 0, 2);
        $endHour = (int) substr($shop->end_time, 0, 2);
        
        // 滞在時間を考慮した最終予約可能時間（閉店時間の少し前まで）
        // 簡易的に「閉店の1時間前」を最終受付とする
        $lastOrderHour = max($startHour, $endHour - 1); 

        $baseDate = $type === 'future' 
            ? Carbon::tomorrow()->addDays(rand(0, 14)) // 明日〜2週間後
            : Carbon::yesterday()->subDays(rand(0, 14)); // 昨日〜2週間前

        // 営業時間内でランダムな時間を生成 (30分刻み)
        $hour = rand($startHour, $lastOrderHour);
        $minute = rand(0, 1) * 30;

        // 生成された時間が閉店時間を超えないか最終チェック（念の為）
        // 例えば 22:00 閉店で 22:00 開始はNG、21:30開始はOKなど
        // ここでは lastOrderHour で制御済みだが、閉店時間を超える場合は調整
        $dt = $baseDate->copy()->setTime($hour, $minute, 0);
        $closeTime = $baseDate->copy()->setTime($endHour, 0, 0);

        if ($dt->gte($closeTime)) {
            $dt->setTime($startHour, 0, 0); // 失敗したら開店時間にフォールバック
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

    private function ensureSlots($shop, $startAt, $stayTime, $number)
    {
        $slotsNeeded = ceil($stayTime / 30);
        $current = $startAt->copy();
        
        // 容量チェック
        for ($i = 0; $i < $slotsNeeded; $i++) {
            $slot = ReservationSlot::firstOrNew([
                'shop_id' => $shop->id,
                'slot_datetime' => $current,
            ], [
                'max_capacity' => $shop->default_capacity ?? 10,
                'current_reserved' => 0,
            ]);

            if (($slot->max_capacity - $slot->current_reserved) < $number) {
                return false; // 容量不足
            }
            $current->addMinutes(30);
        }

        // 更新実行
        $current = $startAt->copy();
        for ($i = 0; $i < $slotsNeeded; $i++) {
            $slot = ReservationSlot::firstOrNew([
                'shop_id' => $shop->id,
                'slot_datetime' => $current,
            ], [
                'max_capacity' => $shop->default_capacity ?? 10,
                'current_reserved' => 0,
            ]);

            $slot->current_reserved += $number;
            $slot->save();
            $current->addMinutes(30);
        }

        return true;
    }
}
