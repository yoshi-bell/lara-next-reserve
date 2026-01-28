// src/hooks/useAreas.ts
import useSWR from 'swr';
import axios from '@/lib/axios';

export interface Area {
    id: number;
    name: string;
}

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useAreas() {
    const { data, error, isLoading } = useSWR<Area[]>('/api/areas', fetcher);

    return {
        areas: data,
        isLoading,
        isError: error,
    };
}
