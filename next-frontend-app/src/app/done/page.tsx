"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function DonePage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <Header />
            
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-white p-12 rounded shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-8 text-black">ご予約ありがとうございます</h2>
                    <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition">
                        戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
