"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMyReservations } from "@/hooks/useMyReservations";
import { useMyFavorites } from "@/hooks/useMyFavorites";
import Header from "@/components/Header";
import ShopCard from "@/components/ShopCard";
import ReservationCard from "@/components/ReservationCard"; // 追加
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Mypage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    
    // 予約タブの状態 ('future' | 'history')
    const [activeTab, setActiveTab] = useState<'future' | 'history'>('future');
    
    const { reservations, isLoading: isResLoading, mutate: mutateReservations } = useMyReservations(activeTab);
    const { favoriteShops, isLoading: isFavLoading } = useMyFavorites();
    const router = useRouter();

    // お気に入り削除確認のスキップ設定
    const [skipConfirm, setSkipConfirm] = useState(false);

    // 初回ロード時にLocalStorageから設定を読み込む
    useEffect(() => {
        const storedSetting = localStorage.getItem("skipFavoriteDeleteConfirm");
        
        if (storedSetting === "true") {
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
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-xl font-bold text-black">予約状況</h3>
                            
                            {/* タブ切り替え */}
                            <div className="flex bg-gray-200 rounded p-1">
                                <button
                                    onClick={() => setActiveTab('future')}
                                    className={`text-xs px-3 py-1 rounded transition ${activeTab === 'future' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    予定
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`text-xs px-3 py-1 rounded transition ${activeTab === 'history' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    履歴
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {(!reservations || reservations.length === 0) ? (
                                <p className="text-gray-500 text-sm">
                                    {activeTab === 'future' ? '現在、予約はありません。' : '過去の予約履歴はありません。'}
                                </p>
                            ) : (
                                reservations.map((res, index) => (
                                    <ReservationCard 
                                        key={res.id} 
                                        reservation={res} 
                                        index={index}
                                        onCancel={handleCancel}
                                        isHistory={activeTab === 'history'}
                                    />
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
