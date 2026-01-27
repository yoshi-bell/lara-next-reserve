"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios"; // 作成済みの設定済みaxiosを使う
import { isAxiosError } from "axios"; // 追加
import Header from "@/components/Header"; // Headerをインポート
import { useAuth } from "@/hooks/useAuth"; // useAuthをインポート

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { mutate } = useAuth(); // mutateを取得

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

            // 3. ユーザー情報の再取得 (SWRのキャッシュ更新)
            await mutate();

            // 4. 成功時
            router.push("/"); 

        } catch (err) {
            // エラーハンドリング
            if (isAxiosError(err) && err.response && err.response.data) {
                setError(err.response.data.message || "ログインに失敗しました。");
            } else {
                setError("予期せぬエラーが発生しました。");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <Header />
            
            <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden mt-12">
                <div className="bg-blue-600 px-6 py-4">
                    <h1 className="text-xl font-bold text-white">Login</h1>
                </div>
                
                <div className="px-8 py-6">
                    {error && (
                        <p className="text-red-500 text-center text-sm mb-4">
                            {error}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <div className="relative flex items-center border-b border-gray-300 pb-1">
                                <span className="text-gray-400 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    className="w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-8">
                            <div className="relative flex items-center border-b border-gray-300 pb-1">
                                <span className="text-gray-400 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                            >
                                ログイン
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
