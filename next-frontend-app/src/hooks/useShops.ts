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
    favorites_exists: boolean; // ログインユーザーのお気に入り状態
    // 必要に応じて他のフィールドも追加
}

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};

export function useShops(params?: { areaId?: string; genreId?: string; name?: string }) {
    // クエリパラメータを構築
    const query = new URLSearchParams();
    if (params?.areaId) query.append('area_id', params.areaId);
    if (params?.genreId) query.append('genre_id', params.genreId);
    if (params?.name) query.append('name', params.name);

    const url = `/api/shops${query.toString() ? '?' + query.toString() : ''}`;

    // SWRを使ってデータをフェッチ。キーにURLを含めることで、パラメータ変更時に自動再取得される。
    // keepPreviousData: true により、再フェッチ中も以前のデータを表示し続け、UXを向上させる。
    const { data, error, isLoading, mutate } = useSWR<Shop[]>(url, fetcher, {
        keepPreviousData: true,
    });

    return {
        shops: data,
        isLoading,
        isError: error,
        mutate,
    };
}
