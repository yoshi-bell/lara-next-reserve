// src/hooks/useMyFavorites.ts
import useSWR from 'swr';
import axios from '@/lib/axios';

interface Shop {
    id: number;
    name: string;
    image_url: string;
    area: { name: string };
    genre: { name: string };
    favorites_exists: boolean;
}

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
