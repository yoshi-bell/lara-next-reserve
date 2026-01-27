// src/hooks/useAuth.ts
import useSWR from 'swr';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios'; // 追加

interface User {
    id: number;
    name: string;
    email: string;
    // 必要に応じて他のフィールドを追加
}

const fetcher = async (url: string) => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        if (isAxiosError(error) && error.response && error.response.status === 401) {
            // 401 Unauthorized の場合は null を返す（未ログイン）
            return null;
        }
        throw error;
    }
};

export function useAuth() {
    const router = useRouter();
    
    const { data: user, error, isLoading, mutate } = useSWR<User | null>('/api/user', fetcher, {
        shouldRetryOnError: false, // 401エラーなどでリトライしないようにする
    });

    const logout = async () => {
        await axios.post('/api/logout');
        mutate(null); // キャッシュをクリア
        router.push('/login');
    };

    // ミドルウェア処理（簡易版）
    // useEffectなどで、userの状態に応じてリダイレクト処理を入れることも可能
    // 今回はフックからはデータとログアウト関数を提供するに留める

    return {
        user,
        isLoading,
        isError: error,
        logout,
        mutate, // 追加
    };
}
