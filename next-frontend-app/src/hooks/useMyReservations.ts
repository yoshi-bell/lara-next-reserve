// src/hooks/useMyReservations.ts
import useSWR from 'swr';
import axios from '@/lib/axios';
import { Reservation } from '@/types';

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
