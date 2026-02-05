// src/hooks/useGenres.ts
import { Genre } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { useData } from './useData';
import { genreSchema } from '@/lib/schemas';
import { z } from 'zod';

export function useGenres() {
    const { data, error, isLoading } = useData<Genre[]>(ENDPOINTS.GENRES.LIST, z.array(genreSchema));

    return {
        genres: data,
        isLoading,
        isError: error,
    };
}
