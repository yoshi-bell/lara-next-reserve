"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function ThanksPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <Header />
            
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-white p-12 rounded shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-8 text-black">会員登録ありがとうございます</h2>
                    <p className="mb-8 text-gray-600">
                        ご登録のメールアドレスに確認メールを送信しました。<br />
                        メール内のリンクをクリックして、登録を完了してください。
                    </p>
                    <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition">
                        ログインする
                    </Link>
                </div>
            </div>
        </div>
    );
}
