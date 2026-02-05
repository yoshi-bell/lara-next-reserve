// src/hooks/useAuth.ts
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useData } from "./useData";
import { ENDPOINTS } from "@/services/endpoints";
import { User } from "@/types";
import { userSchema } from "@/lib/schemas";
import { AxiosError } from "axios";

/**
 * 認証状態を管理するHook
 */
export function useAuth() {
    const router = useRouter();

    // ジェネリクスで null を許容する型にするかは検討事項だが、
    // ここでは API が成功すれば User が返り、失敗(401)すれば error になる構造前提で調整する。
    const { data, error, status, mutate, isLoading } = useData<User>(
        ENDPOINTS.AUTH.USER,
        userSchema,
        {
            shouldRetryOnError: false,
        },
    );

    // 401 Unauthorized は「未ログイン」という正常状態として扱う
    const isUnauthorized =
        error instanceof AxiosError && error.response?.status === 401;

    // 真のエラー（500やネットワークエラー）のみをエラーとする
    const isTrueError = !!error && !isUnauthorized;

    // ユーザーオブジェクト: 成功時のみデータが存在、401時は null
    const user: User | null = status === "success" ? data : null;

    // ローディング判定:
    // status === 'loading' が基本だが、401エラーが確定した場合はローディング終了とみなす
    // useData の仕様上、error が入ると status='error', isLoading=false になるので、そのままで良いはずだが念のため。

    /**
     * ログアウト処理
     */
    const logout = async () => {
        try {
            await axios.post(ENDPOINTS.AUTH.LOGOUT);
        } catch (err) {
            console.error("Logout API failed:", err);
            // API失敗時もフロント側はログアウト扱いにする
        } finally {
            // キャッシュを明示的にクリア (undefined をセット)
            // useData<User> だと型エラーになる可能性があるため any で回避するか、
            // useSWR の mutate は柔軟なのでそのまま通る場合が多い。
            // ここでは再検証 (revalidate) を無効にして即座に消す。
            await mutate(undefined, { revalidate: false });
            router.push("/login");
        }
    };

    return {
        user,
        // useData の isLoading は初期ロード中のみ true。
        // SWR の isValidating (再検証中) も含めたい場合は || isValidating だが、
        // 認証判定ではちらつき防止のため isLoading (初期ロード) のみを見るのが一般的。
        isLoading,
        isError: isTrueError,
        logout,
        mutate,
    };
}
