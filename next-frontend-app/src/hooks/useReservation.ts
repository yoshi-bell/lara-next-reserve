// src/hooks/useReservation.ts
import useSWRMutation from 'swr/mutation';
import axios from '@/lib/axios';

async function reservationFetcher(url: string, { arg }: { arg: { shop_id: number; start_at: string; number: number } }) {
    return await axios.post(url, arg);
}

export function useReservation() {
    const { trigger: createReservation, isMutating } = useSWRMutation(
        '/api/reservations',
        reservationFetcher
    );

    return {
        createReservation,
        isMutating,
    };
}
