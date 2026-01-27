"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorite } from "@/hooks/useFavorite";

// 型定義は共通化すべきですが、一旦ここで定義（またはtypesディレクトリからインポート）
interface Shop {
    id: number;
    name: string;
    image_url: string;
    area: { name: string };
    genre: { name: string };
    favorites_exists: boolean;
}

interface ShopCardProps {
    shop: Shop;
    priority?: boolean;
    showConfirmDialog?: boolean; // 削除時に確認ダイアログを表示するかどうか
}

export default function ShopCard({ shop, priority = false, showConfirmDialog = false }: ShopCardProps) {
    // ローカルステートは廃止し、SWRのデータを直接参照する
    const { addFavorite, removeFavorite, isMutating } = useFavorite(shop.id);

    const handleFavoriteClick = async () => {
        if (isMutating) return;

        // 確認ダイアログが必要な場合（マイページかつスキップ設定OFFなど）
        if (shop.favorites_exists && showConfirmDialog) {
            const message = "お気に入りを解除しますか？\n\n※確認ダイアログが不要な方は、マイページ内の「お気に入り解除時の確認を省略」をONにしてください。";
            if (!window.confirm(message)) {
                return; // キャンセルされたら何もしない
            }
        }

        try {
            if (!shop.favorites_exists) {
                await addFavorite();
            } else {
                await removeFavorite();
            }
        } catch (error) {
            console.error("Failed to update favorite:", error);
            alert("お気に入りの更新に失敗しました。");
        }
    };

    return (
        <div className="bg-white rounded shadow-md overflow-hidden flex flex-col">
            {/* 画像 */}
            <div className="relative h-40 w-full">
                {shop.image_url ? (
                    <Image
                        src={shop.image_url}
                        alt={shop.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={priority}
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                        <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                )}
            </div>
            
            {/* コンテンツ */}
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold mb-2 text-black">{shop.name}</h2>
                <div className="text-[10px] text-black font-bold mb-4 flex">
                    <span className="mr-1">#{shop.area.name}</span>
                    <span>#{shop.genre.name}</span>
                </div>
                <div className="flex justify-between items-center mt-auto">
                    <Link href={`/detail/${shop.id}`} className="bg-blue-600 text-white text-xs px-4 py-2 rounded shadow hover:bg-blue-700 transition inline-block">
                        詳しくみる
                    </Link>
                    <button 
                        onClick={handleFavoriteClick}
                        className={`transition ${shop.favorites_exists ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                        disabled={isMutating}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}