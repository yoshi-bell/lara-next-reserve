// src/hooks/useShops.ts
import { Shop } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { buildQueryParams } from '@/lib/utils';
import { useData } from './useData';

export function useShops(params?: { areaId?: string; genreId?: string; name?: string }) {
    // 汎用ユーティリティを使ってクエリパラメータ付きのURLを構築
    const url = `${ENDPOINTS.SHOPS.LIST}${buildQueryParams({
        area_id: params?.areaId,
        genre_id: params?.genreId,
        name: params?.name,
    })}`;

    // useDataを使ってデータをフェッチ (自動アンラップ)
    const { data, error, isLoading, mutate } = useData<Shop[]>(url, {
        keepPreviousData: true,
    });

    return {
        shops: data, // 既にアンラップされている
        isLoading,
        isError: error,
        mutate,
    };
}
