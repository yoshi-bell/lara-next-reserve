"use client";

import { useParams } from "next/navigation";
import { useShopDetail } from "@/hooks/useShopDetail";
import Image from "next/image";
import Link from "next/link";

export default function ShopDetailPage() {
    const params = useParams();
    const shop_id = params.shop_id as string;
    const { shop, isLoading, isError } = useShopDetail(shop_id);

    if (isLoading) return <div className="text-center py-8">読み込み中...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">店舗情報の取得に失敗しました。</div>;
    if (!shop) return <div className="text-center py-8">店舗が見つかりませんでした。</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            {/* 簡易ヘッダー/ナビゲーション */}
            <header className="w-full max-w-6xl flex justify-between items-center p-8">
                <div className="flex items-center">
                    <button className="bg-blue-600 text-white p-2 rounded shadow-md mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-blue-600">Rese</h1>
                </div>
            </header>

            <main className="w-full max-w-6xl px-8 flex flex-col md:flex-row gap-8">
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

                {/* 右側: 予約フォーム (プレースホルダー) */}
                <div className="w-full md:w-96 bg-blue-600 rounded shadow-lg p-8 text-white flex flex-col">
                    <h3 className="text-xl font-bold mb-6">予約</h3>
                    
                    {/* フォーム入力欄のダミー */}
                    <div className="bg-white/10 p-4 rounded-lg mb-6 flex-grow">
                        <p className="text-sm mb-4 italic">※ 予約フォームの実装は次のタスクです</p>
                        <div className="space-y-4">
                            <div className="h-10 bg-white/20 rounded"></div>
                            <div className="h-10 bg-white/20 rounded"></div>
                            <div className="h-10 bg-white/20 rounded"></div>
                        </div>
                    </div>

                    <button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-b-lg transition mt-auto">
                        予約する
                    </button>
                </div>
            </main>
        </div>
    );
}
