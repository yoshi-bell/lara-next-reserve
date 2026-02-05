// 共通型定義ファイル (Aggregation Layer)

// Layer 1: Branded Types
export * from './brands';

// Layer 2: Zod Schemas & Inferred Types
export * from '@/lib/schemas';

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
    | { status: "loading"; data: undefined; error: undefined; isLoading: true }
    | { status: "success"; data: T; error: undefined; isLoading: false }
    | { status: "error"; data: undefined; error: Error; isLoading: false };
