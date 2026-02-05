import useSWR, { SWRConfiguration } from 'swr';
import axios from '@/lib/axios';
import { ApiResponse, AsyncState } from '@/types';
import { ZodType } from 'zod';

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
    const { data, error, isLoading, mutate, isValidating } = useSWR<ApiResponse<T>>(url, fetcher, options);

    // ランタイムバリデーション
    if (data?.data && schema) {
        const result = schema.safeParse(data.data);
        if (!result.success) {
            console.error("Zod Validation Error:", result.error);
        }
    }

    // Discriminated Union (AsyncState) の構築
    let state: AsyncState<T>;
    if (isLoading || (!data && !error)) {
        state = { status: 'loading', data: undefined, error: undefined, isLoading: true };
    } else if (error) {
        state = { status: 'error', data: undefined, error, isLoading: false };
    } else {
        // success の場合、data.data が T 型であることを保証する
        state = { status: 'success', data: data!.data, error: undefined, isLoading: false };
    }

    return {
        ...state, // status, data, error, isLoading をマージ
        mutate,
        isValidating,
        rawData: data,
    };
}
