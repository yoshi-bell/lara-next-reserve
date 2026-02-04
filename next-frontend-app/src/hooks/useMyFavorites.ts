// src/hooks/useMyFavorites.ts
import { Shop } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { useData } from './useData';

export function useMyFavorites() {
    const { data, error, isLoading, mutate } = useData<Shop[]>(ENDPOINTS.FAVORITES.LIST);

    return {
        favoriteShops: data,
        isLoading,
        isError: error,
        mutate,
    };
}
