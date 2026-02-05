import useSWR, { SWRConfiguration } from 'swr';
import axios from '@/lib/axios';
import { ApiResponse, AsyncState } from '@/types';
import { ZodType, ZodError } from 'zod';

/**
 * バリデーションエラーを区別するためのカスタムエラークラス
 */
export class ValidationError extends Error {
    constructor(public zodError: ZodError, public url: string) {
        super(`Validation failed for ${url}`);
        this.name = 'ValidationError';
    }
}

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

/**
 * 汎用データフェッチHook
 * APIレスポンス (ApiResponse<T>) を自動的にアンラップして T を返します。
 * 戻り値は Discriminated Union 型になっており、status プロパティで型を絞り込めます。
 */
export function useData<T>(url: string | null, schema?: ZodType<T>, options?: SWRConfiguration) {
    const { data: rawResponse, error: apiError, isLoading, mutate, isValidating } = useSWR<ApiResponse<T>>(url, fetcher, options);

    // Discriminated Union (AsyncState) の構築
    let state: AsyncState<T>;

    if (isLoading || (!rawResponse && !apiError)) {
        // ロード中
        state = { status: 'loading', data: undefined, error: undefined, isLoading: true };
    } else if (apiError) {
        // 通信エラー
        state = { status: 'error', data: undefined, error: apiError, isLoading: false };
    } else if (rawResponse) {
        // データ取得成功時
        if (schema) {
            const result = schema.safeParse(rawResponse.data);
            if (result.success) {
                // バリデーション成功
                state = { status: 'success', data: result.data, error: undefined, isLoading: false };
            } else {
                // バリデーション失敗
                const vError = new ValidationError(result.error, url || 'unknown');
                console.error(`[useData] Validation Error at ${url}:`, result.error.format());
                state = { status: 'error', data: undefined, error: vError, isLoading: false };
            }
        } else {
            // スキーマ指定なし (生データを T として扱う)
            state = { status: 'success', data: rawResponse.data as T, error: undefined, isLoading: false };
        }
    } else {
        // 万が一のフォールバック (基本はここには来ない)
        state = { status: 'loading', data: undefined, error: undefined, isLoading: true };
    }

    return {
        ...state,
        mutate,
        isValidating,
        rawData: rawResponse,
    };
}
