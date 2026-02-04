// src/hooks/useShopDetail.ts
import { Shop } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { useData } from './useData';
import { shopSchema } from '@/lib/schemas';

export function useShopDetail(id: string | number | undefined) {
    // SWRを使って /api/shops/{id} からデータをフェッチ
    const { data, error, isLoading } = useData<Shop>(
        id ? ENDPOINTS.SHOPS.DETAIL(id) : null,
        shopSchema
    );

    return {
        shop: data,
        isLoading,
        isError: error,
    };
}
