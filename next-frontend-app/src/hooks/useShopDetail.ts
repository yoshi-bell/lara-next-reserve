// src/hooks/useShopDetail.ts
import useSWR from 'swr';
import axios from '@/lib/axios';
import { Shop } from '@/types';

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useShopDetail(id: string | number | undefined) {
    // SWRを使って /api/shops/{id} からデータをフェッチ
    const { data, error, isLoading } = useSWR<Shop>(
        id ? `/api/shops/${id}` : null,
        fetcher
    );

    return {
        shop: data,
        isLoading,
        isError: error,
    };
}
