// src/hooks/useFavorite.ts
import useSWRMutation from 'swr/mutation';
import axios from '@/lib/axios';
import { useSWRConfig } from 'swr';

async function favoriteFetcher(url: string) {
    return await axios.post(url);
}

async function unfavoriteFetcher(url: string) {
    return await axios.delete(url);
}

export function useFavorite(shopId: number) {
    const { mutate } = useSWRConfig();

    // 更新対象のキーパターン（一覧と詳細）
    // 注意: 検索クエリ付きのキー（例: /api/shops?area_id=1...）も更新する必要がありますが、
    // 単純なキーマッチングでは難しいため、ここでは 'unstable_serialize' や
    // mutate のフィルター機能を使うのが確実ですが、
    // まずは単純に全件再取得を促すため、キーの一部一致でmutateします。
    // ※今回はSWRの仕様上、正確なキー指定が必要なため、
    // ひとまず詳細ページと、引数なしの一覧ページを更新対象とします。
    // より高度な制御は今後の課題とします。

    const onSuccess = () => {
        // 詳細ページのキャッシュ更新
        mutate(`/api/shops/${shopId}`);
        
        // マイページのお気に入り一覧キャッシュ更新
        mutate('/api/favorites');

        // 一覧ページのキャッシュ更新
        // 検索条件付きのキーも含めて更新するため、matcher関数を使用
        mutate(
            (key) => typeof key === 'string' && key.startsWith('/api/shops'),
            undefined, 
            { revalidate: true }
        );
    };

    const { trigger: addFavorite, isMutating: isAdding } = useSWRMutation(
        `/api/shops/${shopId}/favorite`,
        favoriteFetcher,
        { onSuccess }
    );

    const { trigger: removeFavorite, isMutating: isRemoving } = useSWRMutation(
        `/api/shops/${shopId}/favorite`,
        unfavoriteFetcher,
        { onSuccess }
    );

    return {
        addFavorite,
        removeFavorite,
        isMutating: isAdding || isRemoving,
    };
}