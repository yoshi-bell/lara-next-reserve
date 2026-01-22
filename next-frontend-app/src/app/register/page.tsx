"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios"; // 作成したaxiosをインポート

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // 1. CSRFクッキーを取得 (GETメソッド)
            await axios.get('/sanctum/csrf-cookie');

            // 2. 登録リクエスト送信 (POSTメソッド)
            await axios.post('/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                phone_number: phone, // "phone" から "phone_number" に変更
                gender,
                age: Number(age),
            });

            // 登録成功
            router.push("/login");
        } catch (err: any) {
            // エラーハンドリング
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                const errorMessage =
                    errorData.message ||
                    (errorData.errors &&
                        Object.values(errorData.errors).flat().join(", ")) ||
                    "登録に失敗しました。";
                setError(errorMessage);
            } else {
                setError("登録処理中に予期せぬエラーが発生しました。");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center">新規登録</h1>
                {error && (
                    <p className="text-red-500 text-center text-sm mt-2">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="mt-4">
                    {/* Name */}
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            名前
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="名前"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    {/* Email */}
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
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {/* Password */}
                    <div className="mb-4">
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
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* Password Confirmation - 追加 */}
                    <div className="mb-4">
                        <label
                            htmlFor="password_confirmation"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            パスワード確認
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            placeholder="パスワード確認"
                            className="form-input"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </div>
                    {/* Phone */}
                    <div className="mb-4">
                        <label
                            htmlFor="phone"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            電話番号
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="電話番号"
                            className="form-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    {/* Gender */}
                    <div className="mb-4">
                        <label
                            htmlFor="gender"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            性別
                        </label>
                        <select
                            id="gender"
                            className="form-input"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">選択してください</option>
                            <option value="male">男性</option>
                            <option value="female">女性</option>
                            <option value="other">その他</option>
                        </select>
                    </div>
                    {/* Age */}
                    <div className="mb-6">
                        <label
                            htmlFor="age"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            年齢
                        </label>
                        <input
                            id="age"
                            type="number"
                            placeholder="年齢"
                            className="form-input"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            登録
                        </button>
                    </div>
                </form>
                <style jsx>{`
                    .form-input {
                        width: 100%;
                        padding: 0.5rem;
                        border: 1px solid #d1d5db;
                        border-radius: 0.375rem;
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    }
                    .form-input:focus {
                        outline: 2px solid transparent;
                        outline-offset: 2px;
                        border-color: #3b82f6;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
                    }
                `}</style>
            </div>
        </div>
    );
}