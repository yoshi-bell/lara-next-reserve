"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMyReservations } from "@/hooks/useMyReservations";
import { useMyFavorites } from "@/hooks/useMyFavorites";
import Header from "@/components/Header";
import ShopCard from "@/components/ShopCard";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Mypage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { reservations, isLoading: isResLoading, mutate: mutateReservations } = useMyReservations();
    const { favoriteShops, isLoading: isFavLoading } = useMyFavorites();
    const router = useRouter();

    // お気に入り削除確認のスキップ設定
    const [skipConfirm, setSkipConfirm] = useState(false);

    // 初回ロード時にLocalStorageから設定を読み込む
    useEffect(() => {
        const storedSetting = localStorage.getItem("skipFavoriteDeleteConfirm");
        
        if (storedSetting === "true") {
            // setTimeoutでラップして非同期にすることで、
            // ページロード時の同期的なsetState警告（cascading renders）を回避します。
            setTimeout(() => {
                setSkipConfirm(true);
            }, 0);
        }
    }, []);

    // 設定変更時にLocalStorageに保存する
    const handleSkipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setSkipConfirm(isChecked);
        localStorage.setItem("skipFavoriteDeleteConfirm", isChecked.toString());
    };

    // 未ログイン時のリダイレクト
    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push("/login");
        }
    }, [user, isAuthLoading, router]);

    const handleCancel = async (reservationId: number) => {
        if (!confirm("予約をキャンセルしてもよろしいですか？")) return;

        try {
            await axios.delete(`/api/reservations/${reservationId}`);
            alert("予約をキャンセルしました。");
            mutateReservations(); // 一覧を再取得
        } catch (error) {
            console.error("Failed to cancel reservation:", error);
            alert("キャンセルの実行に失敗しました。");
        }
    };

    if (isAuthLoading || isResLoading || isFavLoading) return <div className="text-center py-8">読み込み中...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <Header />

            <main className="w-full max-w-6xl px-8 pb-12">
                {/* ユーザー名 (見本にはないが、あれば親切。不要なら削除可) */}
                {/* <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black">{user.name}さん</h2>
                </div> */}

                <div className="flex flex-col md:flex-row gap-12">
                    {/* 左側: 予約状況 (幅狭め) */}
                    <div className="md:w-1/3 lg:w-1/3">
                        <h3 className="text-xl font-bold mb-6 text-black">予約状況</h3>
                        <div className="space-y-6">
                            {(!reservations || reservations.length === 0) ? (
                                <p className="text-gray-500">現在、予約はありません。</p>
                            ) : (
                                reservations.map((res, index) => (
                                    <div key={res.id} className="bg-blue-600 rounded-lg shadow-lg p-6 text-white relative">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-bold text-lg">予約{index + 1}</span>
                                            </div>
                                            <button 
                                                onClick={() => handleCancel(res.id)}
                                                className="bg-blue-500 hover:bg-blue-400 rounded-full p-1 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4 text-sm">
                                            <div className="flex items-center">
                                                <span className="w-20">Shop</span>
                                                <span>{res.shop.name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-20">Date</span>
                                                <span>{res.start_at.split(/[ T]/)[0]}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-20">Time</span>
                                                <span>{res.start_at.split(/[ T]/)[1]?.substring(0, 5)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-20">Number</span>
                                                <span>{res.number}人</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 右側: お気に入り店舗 (幅広め) */}
                    <div className="md:w-2/3 lg:w-2/3">
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-xl font-bold text-black">お気に入り店舗</h3>
                            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="mr-2"
                                    checked={skipConfirm}
                                    onChange={handleSkipChange}
                                />
                                お気に入り解除時の確認を省略
                            </label>
                        </div>
                        {(!favoriteShops || favoriteShops.length === 0) ? (
                            <p className="text-gray-500">お気に入り店舗はありません。</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {favoriteShops.map((shop) => (
                                    <ShopCard 
                                        key={shop.id} 
                                        shop={shop} 
                                        showConfirmDialog={!skipConfirm}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
