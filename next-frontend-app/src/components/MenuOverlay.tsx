"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
    const { user, logout } = useAuth();

    // 常にレンダリングし、CSSで表示/非表示を切り替える
    // opacity-0: 透明, pointer-events-none: クリック無効
    const visibilityClass = isOpen 
        ? "opacity-100 pointer-events-auto" 
        : "opacity-0 pointer-events-none";

    const handleLogout = async () => {
        await logout();
        onClose();
    };

    return (
        <div className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${visibilityClass}`}>
            {/* 閉じるボタン */}
            <button 
                onClick={onClose}
                className="absolute top-8 left-8 bg-blue-600 text-white p-2 rounded shadow-md hover:bg-blue-700 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* メニューリスト */}
            <nav className="flex flex-col items-center gap-8 text-blue-600 text-3xl font-bold">
                <Link href="/" onClick={onClose} className="hover:text-blue-400 transition">
                    Home
                </Link>

                {user ? (
                    <>
                        <Link href="/mypage" onClick={onClose} className="hover:text-blue-400 transition">
                            Mypage
                        </Link>
                        <button onClick={handleLogout} className="hover:text-blue-400 transition">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/register" onClick={onClose} className="hover:text-blue-400 transition">
                            Registration
                        </Link>
                        <Link href="/login" onClick={onClose} className="hover:text-blue-400 transition">
                            Login
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );
}