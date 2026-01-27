// src/hooks/useMyReservations.ts
import useSWR from 'swr';
import axios from '@/lib/axios';

interface Area {
    id: number;
    name: string;
}

interface Genre {
    id: number;
    name: string;
}

interface Shop {
    id: number;
    name: string;
    image_url: string;
    area: Area;
    genre: Genre;
}

export interface Reservation {
    id: number;
    shop_id: number;
    start_at: string;
    number: number;
    usage_time: number;
    shop: Shop;
}

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useMyReservations(type: 'future' | 'history' = 'future') {
    const url = type === 'history' ? '/api/reservations?type=history' : '/api/reservations';
    const { data, error, isLoading, mutate } = useSWR<Reservation[]>(url, fetcher);

    return {
        reservations: data,
        isLoading,
        isError: error,
        mutate,
    };
}
