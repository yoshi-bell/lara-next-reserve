<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Http\Request;
use App\Http\Requests\StoreReservationRequest;
use Illuminate\Support\Facades\Auth;
use Exception;
use Carbon\Carbon;

class ReservationController extends Controller
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    /**
     * ログインユーザーの予約一覧を取得
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Reservation::where('user_id', $user->id)
            ->with(['shop.area', 'shop.genre']);

        if ($request->type === 'history') {
            // 過去の予約（降順）
            $query->where('start_at', '<', now())
                  ->orderBy('start_at', 'desc');
        } else {
            // 未来の予約（昇順：デフォルト）
            $query->where('start_at', '>=', now())
                  ->orderBy('start_at', 'asc');
        }

        $reservations = $query->get();

        return response()->json($reservations);
    }

    /**
     * 予約を作成
     */
    public function store(StoreReservationRequest $request)
    {
        try {
            $reservation = $this->reservationService->createReservation(
                Auth::user(),
                $request->shop_id,
                Carbon::parse($request->start_at),
                $request->number
            );

            return response()->json([
                'message' => '予約が完了しました。',
                'data' => $reservation
            ], 201);

        } catch (Exception $e) {
            // 業務エラー（在庫不足など）
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * 予約を削除（キャンセル）
     */
    public function destroy(Reservation $reservation)
    {
        // 自分の予約か確認
        if ($reservation->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $this->reservationService->cancelReservation($reservation);
            return response()->json(['message' => '予約をキャンセルしました。'], 200);

        } catch (Exception $e) {
            return response()->json(['message' => 'キャンセルに失敗しました。'], 500);
        }
    }
}
