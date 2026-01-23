"use client";

import { useShops } from "@/hooks/useShops";
import { useAreas } from "@/hooks/useAreas";
import { useGenres } from "@/hooks/useGenres";
import Image from "next/image";
import { useState } from "react";

export default function ShopsPage() {
    // 検索条件のステート管理
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [searchName, setSearchName] = useState("");

    // ステートを渡して店舗データを取得 (連動して自動再取得される)
    const { shops, isLoading, isError } = useShops({
        areaId: selectedArea,
        genreId: selectedGenre,
        name: searchName,
    });

    // プルダウン用データの取得
    const { areas } = useAreas();
    const { genres } = useGenres();

    if (isLoading && !shops) return <div className="text-center py-8">読み込み中...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">データの読み込みに失敗しました。</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* ヘッダー */}
            <header className="flex justify-between items-center p-8 flex-wrap gap-4">
                <div className="flex items-center">
                    {/* ハンバーガーメニュー */}
                    <button className="bg-blue-600 text-white p-2 rounded shadow-md mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    {/* ロゴ */}
                    <h1 className="text-3xl font-bold text-blue-600">Rese</h1>
                </div>

                {/* 検索バー */}
                <div className="flex bg-white rounded shadow-md overflow-hidden flex-grow md:flex-grow-0">
                    {/* エリア選択 */}
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
                    {/* ジャンル選択 */}
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
                    {/* キーワード検索 */}
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
            </header>

            {/* 店舗一覧 */}
            <div className="container mx-auto px-8 pb-8">
                {(!shops || shops.length === 0) ? (
                    <div className="text-center py-8">店舗が見つかりませんでした。</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {shops.map((shop, index) => (
                            <div key={shop.id} className="bg-white rounded shadow-md overflow-hidden flex flex-col">
                                {/* 画像 */}
                                <div className="relative h-40 w-full">
                                    {shop.image_url ? (
                                        <Image
                                            src={shop.image_url}
                                            alt={shop.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            priority={index < 4}
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
                                        <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                                            詳しくみる
                                        </button>
                                        <button className="text-gray-300 hover:text-red-500 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}