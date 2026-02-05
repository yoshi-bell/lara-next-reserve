// 共通型定義ファイル

// API Response Wrapper
export interface ApiResponse<T> {
    data: T;
}

// API Error Response
export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}

/**
 * 非同期データの状態を表す Discriminated Union
 */
export type AsyncState<T> =
    | { status: 'loading'; data: undefined; error: undefined; isLoading: true }
    | { status: 'success'; data: T;         error: undefined; isLoading: false }
    | { status: 'error';   data: undefined; error: Error;     isLoading: false };

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
    start_time: string;
    end_time: string;
    default_capacity: number;
    default_stay_time: number;
    area?: Area;
    genre?: Genre;
    favorites_exists?: boolean;
    created_at?: string;
    updated_at?: string;
}

// Reservation
export interface Reservation {
    id: number;
    user_id: number;
    shop_id: number;
    start_at: string;
    number: number;
    usage_time: number;
    shop?: Shop;
    created_at?: string;
    updated_at?: string;
}

// User
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}
