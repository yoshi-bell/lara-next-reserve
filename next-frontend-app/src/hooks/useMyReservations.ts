// src/hooks/useMyReservations.ts
import useSWR from 'swr';
import axios from '@/lib/axios';
import { Reservation } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useMyReservations(type: 'future' | 'history' = 'future') {
    const baseUrl = ENDPOINTS.RESERVATIONS.LIST;
    const url = type === 'history' ? `${baseUrl}?type=history` : baseUrl;
    const { data, error, isLoading, mutate } = useSWR<Reservation[]>(url, fetcher);

    return {
        reservations: data,
        isLoading,
        isError: error,
        mutate,
    };
}
