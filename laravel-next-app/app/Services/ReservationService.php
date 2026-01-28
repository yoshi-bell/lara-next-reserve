<?php

namespace App\Services;

use App\Mail\ReservationCompleted;
use App\Models\Reservation;
use App\Models\ReservationSlot;
use App\Models\Shop;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Exception;

class ReservationService
{
    /**
     * 予約を作成する
     * 
     * @throws Exception 在庫不足などの業務エラー
     */
    public function createReservation(User $user, int $shopId, Carbon $startAt, int $people): Reservation
    {
        // 店舗情報を取得
        $shop = Shop::findOrFail($shopId);
        $stayMinutes = $shop->default_stay_time; // 店舗ごとのデフォルト滞在時間

        // 終了時間を計算
        $endAt = $startAt->copy()->addMinutes($stayMinutes);

        // トランザクション開始
        return DB::transaction(function () use ($user, $shop, $startAt, $endAt, $people, $stayMinutes) {
            // 1. 対象スロットをロックして取得
            // shop_id が一致し、かつ時間が startAt以上 endAt未満 の枠
            $slots = ReservationSlot::where('shop_id', $shop->id)
                ->where('slot_datetime', '>=', $startAt)
                ->where('slot_datetime', '<', $endAt)
                ->lockForUpdate()
                ->get();

            // 2. 整合性チェック (必要なスロット数が確保できているか)
            // 該当する時間のスロットレコードが存在しない場合は「枠不足」とみなす
            // (シーダー等でスロットが作られていない時間帯への予約防止)
            $requiredSlotsCount = ceil($stayMinutes / ReservationSlot::SLOT_INTERVAL); 
            if ($slots->count() < $requiredSlotsCount) {
                 throw new Exception('指定された時間帯は予約できません（枠不足）。');
            }

            // 3. 空きチェック & 在庫更新
            foreach ($slots as $slot) {
                if (($slot->max_capacity - $slot->current_reserved) < $people) {
                    throw new Exception('満席の時間帯が含まれています。');
                }
                $slot->current_reserved += $people;
                $slot->save();
            }

            // 4. 予約データの作成
            $reservation = Reservation::create([
                'user_id' => $user->id,
                'shop_id' => $shop->id,
                'start_at' => $startAt,
                'number' => $people,
                'usage_time' => $stayMinutes,
            ]);

            // 5. 予約完了メール送信
            // ※シーダー実行時などメール送信をしたくない場合は呼び出し元で制御するか、
            //   ここでは送信せずイベントを発火する形が理想だが、今回は既存ロジックを踏襲する。
            //   ただし、Mail::fake() が効くのでテスト時は問題ない。
            //   大量のシーディング時はパフォーマンスに影響するため、環境判定を入れるか検討が必要だが
            //   今回はそのまま実装する。
            Mail::to($user->email)->send(new ReservationCompleted($reservation));
            
            return $reservation;
        });
    }

    /**
     * 予約をキャンセルする
     */
    public function cancelReservation(Reservation $reservation): void
    {
        DB::transaction(function () use ($reservation) {
            // 1. 在庫を戻すための計算
            $startAt = Carbon::parse($reservation->start_at);
            // usage_time があればそれを使い、なければ店舗の現在設定を使う（フォールバック）
            $stayMinutes = $reservation->usage_time ?? $reservation->shop->default_stay_time;
            $endAt = $startAt->copy()->addMinutes($stayMinutes);
            $people = $reservation->number;

            // 2. 対象スロットを取得してロック
            $slots = ReservationSlot::where('shop_id', $reservation->shop_id)
                ->where('slot_datetime', '>=', $startAt)
                ->where('slot_datetime', '<', $endAt)
                ->lockForUpdate()
                ->get();

            // 3. 在庫を減算（空きを増やす）
            foreach ($slots as $slot) {
                $slot->current_reserved = max(0, $slot->current_reserved - $people);
                $slot->save();
            }

            // 4. 予約を論理削除
            $reservation->delete();
        });
    }
}
