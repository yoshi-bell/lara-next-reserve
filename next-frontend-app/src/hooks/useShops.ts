// src/hooks/useShops.ts
import useSWR from 'swr';
import axios from '@/lib/axios'; // 作成済みのaxiosインスタンスをインポート
import { Shop } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useShops(params?: { areaId?: string; genreId?: string; name?: string }) {
    // クエリパラメータを構築
    const query = new URLSearchParams();
    if (params?.areaId) query.append('area_id', params.areaId);
    if (params?.genreId) query.append('genre_id', params.genreId);
    if (params?.name) query.append('name', params.name);

    const baseUrl = ENDPOINTS.SHOPS.LIST;
    const url = query.toString() ? `${baseUrl}?${query.toString()}` : baseUrl;

    // SWRを使ってデータをフェッチ。キーにURLを含めることで、パラメータ変更時に自動再取得される。
    // keepPreviousData: true により、再フェッチ中も以前のデータを表示し続け、UXを向上させる。
    const { data, error, isLoading, mutate } = useSWR<Shop[]>(url, fetcher, {
        keepPreviousData: true,
    });

    return {
        shops: data,
        isLoading,
        isError: error,
        mutate,
    };
}
