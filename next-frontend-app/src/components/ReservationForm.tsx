"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReservation } from "@/hooks/useReservation";
import { isAxiosError } from "axios";

type Props = {
    shopId: number;
    shopName: string;
};

export default function ReservationForm({ shopId, shopName }: Props) {
    const router = useRouter();
    const { createReservation, isMutating } = useReservation();

    // 予約フォームの状態
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [number, setNumber] = useState(1);
    const [reservationError, setReservationError] = useState("");

    const handleReservation = async () => {
        setReservationError("");
        
        // 開発中のバックエンドバリデーション確認のため、フロントバリデーションを一時無効化
        /*
        if (!date || !time) {
            setReservationError("日付と時間を入力してください。");
            return;
        }
        */

        try {
            // start_at の作成 (YYYY-MM-DD HH:mm:ss)
            // 入力が空の場合は適当な文字列を送ってバックエンドで弾かせる
            const safeDate = date || "2000-01-01";
            const safeTime = time || "00:00";
            const startAt = `${safeDate} ${safeTime}:00`;

            await createReservation({
                shop_id: shopId,
                start_at: startAt,
                number: Number(number),
            });

            router.push("/done");
        } catch (error) {
            console.error("Reservation failed:", error);
            if (isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
                setReservationError(error.response.data.message);
            } else {
                setReservationError("予約に失敗しました。ログイン状態や入力内容を確認してください。");
            }
        }
    };

    return (
        <div className="bg-blue-600 rounded shadow-lg flex flex-col overflow-hidden h-auto w-full md:w-96 sticky top-8">
            <div className="p-8 text-white flex-grow">
                <h3 className="text-xl font-bold mb-6">予約</h3>
                
                <div className="space-y-4 mb-6">
                    <input 
                        type="date" 
                        className="w-full p-2 rounded text-gray-700 outline-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <select 
                        className="w-full p-2 rounded text-gray-700 outline-none"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    >
                        <option value="">時間を選択してください</option>
                        {/* 17:00 ~ 23:00 までの選択肢 (簡易実装) */}
                        {Array.from({ length: 13 }, (_, i) => {
                            const hour = 17 + Math.floor(i / 2);
                            const min = i % 2 === 0 ? "00" : "30";
                            const timeStr = `${hour}:${min}`;
                            return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                        })}
                    </select>
                    <select 
                        className="w-full p-2 rounded text-gray-700 outline-none"
                        value={number}
                        onChange={(e) => setNumber(Number(e.target.value))}
                    >
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}人</option>
                        ))}
                    </select>
                </div>

                {/* 予約確認表示 */}
                <div className="bg-blue-500/50 p-4 rounded mb-4 text-sm">
                    <div className="flex justify-between mb-2">
                        <span>Shop</span>
                        <span>{shopName}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Date</span>
                        <span>{date}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Time</span>
                        <span>{time}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Number</span>
                        <span>{number}人</span>
                    </div>
                </div>

                {reservationError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4">
                        {reservationError}
                    </div>
                )}
            </div>

            <button 
                onClick={handleReservation}
                disabled={isMutating}
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-4 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isMutating ? "予約中..." : "予約する"}
            </button>
        </div>
    );
}
