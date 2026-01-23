"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
    children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
    const { user, logout } = useAuth();

    return (
        <header className="flex justify-between items-center p-8 w-full max-w-6xl mx-auto flex-wrap gap-4">
            <div className="flex items-center">
                {/* ハンバーガーメニュー */}
                <button className="bg-blue-600 text-white p-2 rounded shadow-md mr-4 hover:bg-blue-700 transition">
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
                {user ? (
                    <>
                        <Link href="/mypage" className="text-gray-700 font-bold hidden sm:inline hover:text-blue-600 transition">
                            {user.name}さん
                        </Link>
                        <button 
                            onClick={logout} 
                            className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-300 transition"
                        >
                            ログアウト
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            ログイン
                        </Link>
                        <Link href="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                            登録
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}