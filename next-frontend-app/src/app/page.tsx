"use client";

import { useShops } from "@/hooks/useShops";
import { useAreas } from "@/hooks/useAreas";
import { useGenres } from "@/hooks/useGenres";
import { useState } from "react";
import ShopCard from "@/components/ShopCard";
import Header from "@/components/Header";
import ShopSearchFilter from "@/components/ShopSearchFilter";

export default function ShopsPage() {
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [searchName, setSearchName] = useState("");

    const { shops, isLoading, isError } = useShops({
        areaId: selectedArea,
        genreId: selectedGenre,
        name: searchName,
    });

    const { areas } = useAreas();
    const { genres } = useGenres();

    if (isLoading && !shops) return <div className="text-center py-8">読み込み中...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">データの読み込みに失敗しました。</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 共通ヘッダーに検索バーを差し込む */}
            <Header>
                <ShopSearchFilter
                    selectedArea={selectedArea}
                    onAreaChange={setSelectedArea}
                    selectedGenre={selectedGenre}
                    onGenreChange={setSelectedGenre}
                    searchName={searchName}
                    onNameChange={setSearchName}
                    areas={areas}
                    genres={genres}
                />
            </Header>

            {/* 店舗一覧 */}
            <div className="container mx-auto px-8 pb-8">
                {(!shops || shops.length === 0) ? (
                    <div className="text-center py-8">店舗が見つかりませんでした。</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {shops.map((shop, index) => (
                            <ShopCard 
                                key={shop.id} 
                                shop={shop} 
                                priority={index < 4} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
