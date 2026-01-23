// src/hooks/useShopDetail.ts
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
    description: string;
    image_url: string;
    area: Area;
    genre: Genre;
}

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useShopDetail(id: string | number | undefined) {
    // SWRを使って /api/shops/{id} からデータをフェッチ
    const { data, error, isLoading } = useSWR<Shop>(
        id ? `/api/shops/${id}` : null,
        fetcher
    );

    return {
        shop: data,
        isLoading,
        isError: error,
    };
}
