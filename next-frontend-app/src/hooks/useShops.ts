// src/hooks/useShops.ts
import useSWR from 'swr';
import axios from '@/lib/axios'; // 作成済みのaxiosインスタンスをインポート
import { Shop } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { buildQueryParams } from '@/lib/utils';

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useShops(params?: { areaId?: string; genreId?: string; name?: string }) {
    // 汎用ユーティリティを使ってクエリパラメータ付きのURLを構築
    const url = `${ENDPOINTS.SHOPS.LIST}${buildQueryParams({
        area_id: params?.areaId,
        genre_id: params?.genreId,
        name: params?.name,
    })}`;

    // SWRを使ってデータをフェッチ。キーにURLを含めることで、パラメータ変更時に自動再取得される。
    // keepPreviousData: true により、再フェッチ中も以前のデータを表示し続け、UXを向上させる。
    const { data, error, isLoading, mutate } = useSWR<{ data: Shop[] }>(url, fetcher, {
        keepPreviousData: true,
    });

    return {
        shops: data?.data,
        isLoading,
        isError: error,
        mutate,
    };
}
