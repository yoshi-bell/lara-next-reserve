// src/hooks/useMyFavorites.ts
import { Shop } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { useData } from './useData';
import { shopSchema } from '@/lib/schemas';
import { z } from 'zod';

export function useMyFavorites() {
    const result = useData<Shop[]>(ENDPOINTS.FAVORITES.LIST, z.array(shopSchema));

    return {
        ...result,
        favoriteShops: result.data,
    };
}
