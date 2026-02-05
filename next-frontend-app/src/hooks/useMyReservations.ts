// src/hooks/useMyReservations.ts
import { Reservation } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { buildQueryParams } from '@/lib/utils';
import { useData } from './useData';
import { reservationSchema } from '@/lib/schemas';
import { z } from 'zod';

export function useMyReservations(type: 'future' | 'history' = 'future') {
    const url = `${ENDPOINTS.RESERVATIONS.LIST}${buildQueryParams({
        type: type === 'history' ? 'history' : undefined,
    })}`;

    const result = useData<Reservation[]>(url, z.array(reservationSchema));

    return {
        ...result,
        reservations: result.data,
    };
}
