<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\ReservationSlot;
use App\Models\Shop;
use Illuminate\Http\Request;
use App\Http\Requests\StoreReservationRequest; // 追加
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationCompleted;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * ログインユーザーの予約一覧を取得
     */
    public function index()
    {
        $user = Auth::user();
        $reservations = Reservation::where('user_id', $user->id)
            ->with(['shop.area', 'shop.genre'])
            ->orderBy('start_at', 'asc')
            ->get();

        return response()->json($reservations);
    }

    /**
     * 予約を作成
     */
    public function store(StoreReservationRequest $request) // 型変更
    {
        // バリデーションは自動実行されるため削除

        $user = Auth::user();
        $shopId = $request->shop_id;
        $startAt = Carbon::parse($request->start_at);
        $people = $request->number;

        // 店舗情報を取得（滞在時間を知るため）
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

            // 2. 整合性チェック
            $requiredSlotsCount = ceil($stayMinutes / 30); 
            if ($slots->count() < $requiredSlotsCount) {
                 return response()->json(['message' => '指定された時間帯は予約できません（枠不足）。'], 400);
            }

            // 3. 空きチェック & 在庫更新
            foreach ($slots as $slot) {
                if (($slot->max_capacity - $slot->current_reserved) < $people) {
                    return response()->json(['message' => '満席の時間帯が含まれています。'], 400);
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
            Mail::to($user->email)->send(new ReservationCompleted($reservation));
            
            return response()->json([
                'message' => '予約が完了しました。',
                'data' => $reservation
            ], 201);
        });
    }

    /**
     * 予約を削除（キャンセル）
     * ※ 論理削除を使用
     */
    public function destroy(Reservation $reservation)
    {
        // 自分の予約か確認
        if ($reservation->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // トランザクション開始
        return DB::transaction(function () use ($reservation) {
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

            return response()->json(['message' => '予約をキャンセルしました。'], 200);
        });
    }
}