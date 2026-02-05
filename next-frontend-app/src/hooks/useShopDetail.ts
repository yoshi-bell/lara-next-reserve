// src/hooks/useShopDetail.ts
import { Shop } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { useData } from './useData';
import { shopSchema } from '@/lib/schemas';

export function useShopDetail(id: string | number | undefined) {
    // SWRを使って /api/shops/{id} からデータをフェッチ
    const result = useData<Shop>(
        id ? ENDPOINTS.SHOPS.DETAIL(id) : null,
        shopSchema
    );

    return {
        ...result,
        shop: result.data,
        isError: result.error,
    };
}
