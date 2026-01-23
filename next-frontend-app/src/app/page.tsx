"use client";

import { useShops } from "@/hooks/useShops";
import { useAreas } from "@/hooks/useAreas";
import { useGenres } from "@/hooks/useGenres";
import { useState } from "react";
import ShopCard from "@/components/ShopCard";
import Header from "@/components/Header";

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
                <div className="flex bg-white rounded shadow-md overflow-hidden w-full max-w-xl">
                    <select 
                        className="p-2 border-r border-gray-200 text-gray-700 outline-none cursor-pointer text-sm bg-white"
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                    >
                        <option value="">All area</option>
                        {areas?.map(area => (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                    </select>
                    <select 
                        className="p-2 border-r border-gray-200 text-gray-700 outline-none cursor-pointer text-sm bg-white"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="">All genre</option>
                        {genres?.map(genre => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                    <div className="flex items-center p-2 flex-grow">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 105.197 5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search ..." 
                            className="outline-none text-gray-700 text-sm w-full"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </div>
                </div>
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
