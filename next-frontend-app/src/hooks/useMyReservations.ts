// src/hooks/useMyReservations.ts
import { Reservation } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { buildQueryParams } from '@/lib/utils';
import { useData } from './useData';

export function useMyReservations(type: 'future' | 'history' = 'future') {
    const url = `${ENDPOINTS.RESERVATIONS.LIST}${buildQueryParams({
        type: type === 'history' ? 'history' : undefined,
    })}`;

    const { data, error, isLoading, mutate } = useData<Reservation[]>(url);

    return {
        reservations: data,
        isLoading,
        isError: error,
        mutate,
    };
}
