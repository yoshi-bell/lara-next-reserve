"use client";

import { useParams } from "next/navigation";
import { useShopDetail } from "@/hooks/useShopDetail";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import ReservationForm from "@/components/ReservationForm"; // コンポーネントをインポート

export default function ShopDetailPage() {
    const params = useParams();
    const shop_id = params.shop_id as string;
    const { shop, isLoading, isError } = useShopDetail(shop_id);

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

            <div className="relative w-full h-64 md:h-80 mb-6 shadow-md rounded overflow-hidden">
                {shop.image_url ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.image_url}`}
                        alt={shop.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        unoptimized
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

                {/* 右側: 予約フォーム (コンポーネント化) */}
                <ReservationForm shopId={shop.id} shopName={shop.name} />
            </main>
        </div>
    );
}
