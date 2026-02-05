// src/hooks/useAreas.ts
import { Area } from '@/types';
import { ENDPOINTS } from '@/services/endpoints';
import { useData } from './useData';
import { areaSchema } from '@/lib/schemas';
import { z } from 'zod';

export function useAreas() {
    const result = useData<Area[]>(ENDPOINTS.AREAS.LIST, z.array(areaSchema));

    return {
        ...result,
        areas: result.data,
    };
}
