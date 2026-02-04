import useSWR, { SWRConfiguration } from 'swr';
import axios from '@/lib/axios';
import { ApiResponse } from '@/types';

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

/**
 * 汎用データフェッチHook
 * APIレスポンス (ApiResponse<T>) を自動的にアンラップして T を返します。
 */
export function useData<T>(url: string | null, options?: SWRConfiguration) {
    const { data, error, isLoading, mutate, isValidating } = useSWR<ApiResponse<T>>(url, fetcher, options);

    return {
        data: data?.data, // data.data を返す
        error,
        isLoading,
        mutate,
        isValidating,
        rawData: data, // 必要なら生のレスポンスも参照可能
    };
}
