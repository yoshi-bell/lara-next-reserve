"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios"; // 作成したaxiosをインポート
import { isAxiosError } from "axios"; // isAxiosErrorをインポート
import Header from "@/components/Header"; // 追加

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
            router.push("/thanks");
        } catch (err) {
            // エラーハンドリング
            if (isAxiosError(err) && err.response && err.response.data) {
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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <Header />

            <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden mt-12 mb-12">
                <div className="bg-blue-600 px-6 py-4">
                    <h1 className="text-xl font-bold text-white">Registration</h1>
                </div>
                
                <div className="px-8 py-6">
                    {error && (
                        <p className="text-red-500 text-center text-sm mb-4">
                            {error}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Name */}
                        <div className="mb-4">
                            <div className="relative flex items-center border-b border-gray-300 pb-1">
                                <span className="text-gray-400 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </span>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Username"
                                    className="w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Email */}
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
                        {/* Password */}
                        <div className="mb-4">
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
                        {/* Password Confirmation */}
                        <div className="mb-4">
                            <div className="relative flex items-center border-b border-gray-300 pb-1">
                                <span className="text-gray-400 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </span>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Password Confirmation"
                                    className="w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Phone */}
                        <div className="mb-4">
                            <div className="relative flex items-center border-b border-gray-300 pb-1">
                                <span className="text-gray-400 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </span>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Gender */}
                        <div className="mb-4">
                            <div className="relative flex items-center border-b border-gray-300 pb-1">
                                <span className="text-gray-400 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </span>
                                <select
                                    id="gender"
                                    className="w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none bg-white"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        {/* Age */}
                        <div className="mb-8">
                            <div className="relative flex items-center border-b border-gray-300 pb-1">
                                <span className="text-gray-400 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <input
                                    id="age"
                                    type="number"
                                    placeholder="Age"
                                    className="w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                            >
                                登録
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
