"use client";

import { Reservation } from "@/hooks/useMyReservations";
import Link from "next/link";

interface ReservationCardProps {
    reservation: Reservation;
    index?: number;
    onCancel?: (id: number) => void;
    isHistory?: boolean;
}

export default function ReservationCard({ reservation, index = 0, onCancel, isHistory = false }: ReservationCardProps) {
    const bgColor = isHistory ? "bg-gray-500" : "bg-blue-600";
    const title = isHistory ? "来店履歴" : `予約${index + 1}`;

    return (
        <div 
            className={`${bgColor} rounded-lg shadow-lg p-6 text-white relative h-full flex flex-col`}
            data-testid="reservation-card"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-lg">{title}</span>
                </div>
                
                {/* 削除ボタン（未来の予約のみ） */}
                {!isHistory && onCancel && (
                    <button 
                        onClick={() => onCancel(reservation.id)}
                        className="bg-blue-500 hover:bg-blue-400 rounded-full p-1 transition"
                        aria-label="予約をキャンセル"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            
            <div className="space-y-4 text-sm flex-grow">
                <div className="flex items-center">
                    <span className="w-20">Shop</span>
                    <span>{reservation.shop.name}</span>
                </div>
                <div className="flex items-center">
                    <span className="w-20">Date</span>
                    <span>{new Date(reservation.start_at).toLocaleDateString('ja-JP')}</span>
                </div>
                <div className="flex items-center">
                    <span className="w-20">Time</span>
                    <span>{new Date(reservation.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                </div>
                <div className="flex items-center">
                    <span className="w-20">Number</span>
                    <span>{reservation.number}人</span>
                </div>
            </div>

            {/* 再予約ボタン（過去の予約のみ） */}
            {isHistory && (
                <div className="mt-6 pt-4 border-t border-gray-400">
                    <Link 
                        href={`/detail/${reservation.shop_id}`}
                        className="block w-full bg-white text-gray-800 text-center font-bold py-2 rounded hover:bg-gray-100 transition"
                    >
                        再予約する
                    </Link>
                </div>
            )}
        </div>
    );
}
