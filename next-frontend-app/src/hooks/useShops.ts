// src/hooks/useShops.ts
import { Shop } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { buildQueryParams } from '@/lib/utils';
import { useData } from './useData';
import { shopSchema } from '@/lib/schemas';
import { z } from 'zod';

export function useShops(params?: { areaId?: string; genreId?: string; name?: string }) {
    // 汎用ユーティリティを使ってクエリパラメータ付きのURLを構築
    const url = `${ENDPOINTS.SHOPS.LIST}${buildQueryParams({
        area_id: params?.areaId,
        genre_id: params?.genreId,
        name: params?.name,
    })}`;

    // useDataを使ってデータをフェッチ (自動アンラップ + Zodバリデーション)
    // 第2引数にスキーマ、第3引数にオプションを渡す
    const result = useData<Shop[]>(url, z.array(shopSchema), {
        keepPreviousData: true,
    });

    return {
        ...result,
        shops: result.data, // 互換性のためのエイリアス
    };
}
