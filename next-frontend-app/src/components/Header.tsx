"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import MenuOverlay from "./MenuOverlay"; // 追加

interface HeaderProps {
    children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            
            <header className="flex justify-between items-center p-8 w-full max-w-6xl mx-auto flex-wrap gap-4">
                <div className="flex items-center">
                    {/* ハンバーガーメニュー */}
                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="bg-blue-600 text-white p-2 rounded shadow-md mr-4 hover:bg-blue-700 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    {/* ロゴ */}
                <Link href="/">
                    <h1 className="text-3xl font-bold text-blue-600 cursor-pointer">Rese</h1>
                </Link>
            </div>

            {/* スロット: 検索バーなどがここに入る */}
            {children && (
                <div className="flex-grow flex justify-center md:justify-end">
                    {children}
                </div>
            )}

            {/* 認証状態表示 */}
            <div className="flex items-center gap-4">
                {user && (
                    <Link href="/mypage" className="text-gray-700 font-bold flex items-center gap-1 hover:text-blue-600 transition">
                        <span>{user.name}さん</span>
                        <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded ml-1 hover:bg-blue-100 hover:text-blue-600 transition">マイページ</span>
                    </Link>
                )}
            </div>
        </header>
        </>
    );
}