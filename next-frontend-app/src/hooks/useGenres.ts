// src/hooks/useGenres.ts
import useSWR from 'swr';
import axios from '@/lib/axios';

export interface Genre {
    id: number;
    name: string;
}

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useGenres() {
    const { data, error, isLoading } = useSWR<Genre[]>('/api/genres', fetcher);

    return {
        genres: data,
        isLoading,
        isError: error,
    };
}
