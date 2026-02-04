import useSWR, { SWRConfiguration } from 'swr';
import axios from '@/lib/axios';
import { ApiResponse } from '@/types';
import { ZodType } from 'zod';

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

/**
 * 汎用データフェッチHook
 * APIレスポンス (ApiResponse<T>) を自動的にアンラップして T を返します。
 * オプションで Zod スキーマを渡すと、ランタイムバリデーションを実行します。
 */
export function useData<T>(url: string | null, schema?: ZodType<T>, options?: SWRConfiguration) {
    const { data, error, isLoading, mutate, isValidating } = useSWR<ApiResponse<T>>(url, fetcher, options);

    // ランタイムバリデーション (データが存在し、スキーマが渡された場合のみ)
    if (data?.data && schema) {
        const result = schema.safeParse(data.data);
        if (!result.success) {
            console.error("Zod Validation Error:", result.error);
            // 開発環境ではエラーを投げるなど、厳格に扱うことも可能
            // 今回はコンソール出力に留める
        }
    }

    return {
        data: data?.data, // data.data を返す
        error,
        isLoading,
        mutate,
        isValidating,
        rawData: data, // 必要なら生のレスポンスも参照可能
    };
}
