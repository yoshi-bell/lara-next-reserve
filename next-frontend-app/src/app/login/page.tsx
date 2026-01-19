"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios"; // 作成済みの設定済みaxiosを使う

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // 1. CSRFクッキー取得
            await axios.get('/sanctum/csrf-cookie');

            // 2. ログインリクエスト (axiosを使用)
            await axios.post('/api/login', {
                email,
                password,
            });

            // 3. 成功時
            router.push("/"); 

        } catch (err: any) {
            // エラーハンドリング
            if (err.response && err.response.data) {
                setError(err.response.data.message || "ログインに失敗しました。");
            } else {
                setError("予期せぬエラーが発生しました。");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* ↓ 提案コードではここに w-full max-w-md を追加していましたが、元のままにしています */}
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center">ログイン</h1>
                {error && (
                    <p className="text-red-500 text-center text-sm mt-2">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="メールアドレス"
                            // ↓ 元のデザインクラスを維持
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            パスワード
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="パスワード"
                            // ↓ 元のデザインクラスを維持
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            ログイン
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}