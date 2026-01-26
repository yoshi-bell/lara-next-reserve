"use client";

import { useParams, useRouter } from "next/navigation";
import { useShopDetail } from "@/hooks/useShopDetail";
import { useReservation } from "@/hooks/useReservation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { useState } from "react";
import { isAxiosError } from "axios"; // 追加

export default function ShopDetailPage() {
    const params = useParams();
    const router = useRouter();
    const shop_id = params.shop_id as string;
    const { shop, isLoading, isError } = useShopDetail(shop_id);
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
                shop_id: Number(shop_id),
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

    if (isLoading) return <div className="text-center py-8">読み込み中...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">店舗情報の取得に失敗しました。</div>;
    if (!shop) return <div className="text-center py-8">店舗が見つかりませんでした。</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <Header />

            <main className="w-full max-w-6xl px-8 flex flex-col md:flex-row gap-8 pb-12">
                {/* 左側: 店舗情報 */}
                <div className="flex-1">
                    <div className="flex items-center mb-4">
                        <Link href="/" className="bg-white p-1 rounded shadow-sm mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </Link>
                        <h2 className="text-2xl font-bold text-black">{shop.name}</h2>
                    </div>

                    <div className="relative h-80 w-full mb-4 rounded overflow-hidden">
                        {shop.image_url ? (
                            <Image
                                src={shop.image_url}
                                alt={shop.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                priority
                                style={{ objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-200">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        )}
                    </div>

                    <div className="text-sm font-bold text-black mb-4">
                        <span className="mr-2">#{shop.area.name}</span>
                        <span>#{shop.genre.name}</span>
                    </div>

                    <p className="text-black leading-relaxed">
                        {shop.description}
                    </p>
                </div>

                {/* 右側: 予約フォーム */}
                <div className="w-full md:w-96 bg-blue-600 rounded shadow-lg flex flex-col overflow-hidden h-auto self-start sticky top-8">
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
                                <span>{shop.name}</span>
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
            </main>
        </div>
    );
}