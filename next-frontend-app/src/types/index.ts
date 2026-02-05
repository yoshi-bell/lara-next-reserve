// 共通型定義ファイル

// API Response Wrapper (Laravel JsonResource default)
export interface ApiResponse<T> {
    data: T;
}

// Laravel Standard Error Response
export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string[]>; // バリデーションエラー用
}

// Area
export interface Area {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

// Genre
export interface Genre {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

// Shop
export interface Shop {
    id: number;
    name: string;
    area_id: number;
    genre_id: number;
    description: string;
    image_url: string;
    start_time: string; // HH:mm:ss
    end_time: string;   // HH:mm:ss
    default_capacity: number;
    default_stay_time: number;
    
    // Relations
    area?: Area;
    genre?: Genre;
    
    // User specific (appended via attribute or withCount/exists)
    favorites_exists?: boolean;
    
    created_at?: string;
    updated_at?: string;
}

// Reservation
export interface Reservation {
    id: number;
    user_id: number;
    shop_id: number;
    start_at: string; // DateTime string
    number: number;
    usage_time: number;
    
    // Relations
    shop?: Shop;
    
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null; // 論理削除対応（履歴表示用）
}

// User (Auth)
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}