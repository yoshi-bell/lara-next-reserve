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
        state = { status: 'loading', data: undefined, error: undefined, isLoading: true };
    } else if (apiError) {
        // 通信エラー (AxiosError等)
        state = { status: 'error', data: undefined, error: apiError, isLoading: false };
    } else {
        // rawResponse.data が存在する場合
        if (schema && rawResponse) {
            const result = schema.safeParse(rawResponse.data);
            if (result.success) {
                // バリデーション成功: パース・変換済みデータ (result.data) を使用
                // これにより Branded Type への変換も反映される
                state = { status: 'success', data: result.data, error: undefined, isLoading: false };
            } else {
                // バリデーション失敗: 専用のエラー型を生成
                const vError = new ValidationError(result.error, url || 'unknown');
                console.error(`[useData] Validation Error at ${url}:`, result.error.format());
                state = { status: 'error', data: undefined, error: vError, isLoading: false };
            }
        } else {
            // スキーマ指定なし、またはデータ未取得
            state = { 
                status: rawResponse ? 'success' : 'loading', 
                data: rawResponse?.data as T, 
                error: undefined, 
                isLoading: !rawResponse 
            };
        }
    }

    return {
        ...state,
        mutate,
        isValidating,
        rawData: rawResponse,
    };
}