// src/hooks/useShops.ts
import useSWR from 'swr';
import axios from '@/lib/axios'; // 作成済みのaxiosインスタンスをインポート

// AreaとGenreの型定義 (必要に応じて詳細化)
interface Area {
    id: number;
    name: string;
}

interface Genre {
    id: number;
    name: string;
}

// 店舗データの型定義 (バックエンドのAPIレスポンスに合わせて調整)
interface Shop {
    id: number;
    name: string;
    area_id: number;
    genre_id: number;
    description: string;
    image_url: string;
    start_time: string;
    end_time: string;
    default_capacity: number;
    default_stay_time: number;
    
    area: Area; // Areaリレーションを追加
    genre: Genre; // Genreリレーションを追加
    // 必要に応じて他のフィールドも追加
}

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useShops() {
    // SWRを使って /api/shops からデータをフェッチ
    const { data, error, isLoading, mutate } = useSWR<Shop[]>('/api/shops', fetcher);

    return {
        shops: data,
        isLoading,
        isError: error,
        mutate, // データ再フェッチ用の関数
    };
}
