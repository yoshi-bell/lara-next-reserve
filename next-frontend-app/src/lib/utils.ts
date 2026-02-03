/**
 * オブジェクトからクエリ文字列（?key=value&...）を構築する汎用ユーティリティ。
 * null, undefined, または空文字 ("") の値を持つキーは自動的に除外される。
 *
 * @param params クエリパラメータのオブジェクト
 * @returns 構築されたクエリ文字列（パラメータがない場合は空文字）
 */
export function buildQueryParams(params: Record<string, string | number | boolean | undefined | null>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        // 有効な値のみをパラメータに追加
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    
    // 文字列が存在する場合のみ先頭に "?" を付与
    return queryString ? `?${queryString}` : "";
}
