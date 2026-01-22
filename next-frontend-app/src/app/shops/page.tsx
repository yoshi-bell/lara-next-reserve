"use client";

import { useShops } from "@/hooks/useShops";
import Image from "next/image"; // Next.jsのImageコンポーネント

export default function ShopsPage() {
    const { shops, isLoading, isError } = useShops();

    if (isLoading) return <div className="text-center py-8">読み込み中...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">店舗データの読み込みに失敗しました。</div>;
    if (!shops || shops.length === 0) return <div className="text-center py-8">店舗が見つかりませんでした。</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">店舗一覧</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shops.map(shop => (
                    <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-48 w-full">
                            {shop.image_url ? (
                                <Image
                                    src={shop.image_url}
                                    alt={shop.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="transition-transform duration-300 hover:scale-105"
                                />
                            ) : (
                                // 画像がない場合のプレースホルダー
                                <div className="flex items-center justify-center h-full bg-gray-200">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
                            <div className="text-gray-600 text-sm mb-4">
                                <p>エリア: {shop.area.name}</p>
                                <p>ジャンル: {shop.genre.name}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                {/* 詳細ボタン */}
                                <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded">
                                    詳しく見る
                                </button>
                                {/* お気に入りアイコン (後で機能追加) */}
                                <button className="text-gray-400 hover:text-red-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}