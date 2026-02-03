// src/hooks/useMyReservations.ts
import useSWR from 'swr';
import axios from '@/lib/axios';
import { Reservation } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { buildQueryParams } from '@/lib/utils';

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useMyReservations(type: 'future' | 'history' = 'future') {
    const url = `${ENDPOINTS.RESERVATIONS.LIST}${buildQueryParams({
        type: type === 'history' ? 'history' : undefined,
    })}`;

    const { data, error, isLoading, mutate } = useSWR<{ data: Reservation[] }>(url, fetcher);

    return {
        reservations: data?.data,
        isLoading,
        isError: error,
        mutate,
    };
}
