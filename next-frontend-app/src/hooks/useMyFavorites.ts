// src/hooks/useMyFavorites.ts
import useSWR from 'swr';
import axios from '@/lib/axios';
import { Shop } from '@/types';

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useMyFavorites() {
    const { data, error, isLoading, mutate } = useSWR<Shop[]>('/api/favorites', fetcher);

    return {
        favoriteShops: data,
        isLoading,
        isError: error,
        mutate,
    };
}
