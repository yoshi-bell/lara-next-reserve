/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavorite } from "./useFavorite";
import axios from "@/lib/axios";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

vi.mock("@/lib/axios");
vi.mock("swr");
vi.mock("swr/mutation");

describe("useFavorite", () => {
    const mockMutate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSWRConfig).mockReturnValue({ mutate: mockMutate } as any);

        // useSWRMutation の戻り値を設定

        vi.mocked(useSWRMutation).mockImplementation(
            (key: any, fetcher: any, options: any) => {
                // fetcherの名前や中身で add か remove か判定しにくい場合もあるが、

                // 渡された fetcher をそのまま実行することで、axiosの呼び出しを誘発する。

                return {
                    trigger: async () => {
                        await fetcher(key); // axios.post または delete が呼ばれる

                        if (options?.onSuccess) options.onSuccess(); // 成功時コールバック（mutate等）を実行
                    },

                    isMutating: false,
                } as any;
            },
        );
    });

    it("addFavorite を呼ぶと axios.post が走り、各キャッシュが更新されること", async () => {
        const shopId = 1;
        const { result } = renderHook(() => useFavorite(shopId));

        await act(async () => {
            await result.current.addFavorite();
        });

        // APIリクエスト確認
        expect(axios.post).toHaveBeenCalledWith(
            `/api/shops/${shopId}/favorite`,
        );

        // キャッシュ更新確認 (mutateの呼び出し)
        expect(mockMutate).toHaveBeenCalledWith(`/api/shops/${shopId}`);
        expect(mockMutate).toHaveBeenCalledWith("/api/favorites");
        // 店舗一覧の更新（マッチャー関数が渡されているか）
        expect(mockMutate).toHaveBeenCalledWith(
            expect.any(Function),
            undefined,
            { revalidate: true },
        );
    });

    it("removeFavorite を呼ぶと axios.delete が走り、各キャッシュが更新されること", async () => {
        const shopId = 1;
        const { result } = renderHook(() => useFavorite(shopId));

        await act(async () => {
            await result.current.removeFavorite();
        });

        expect(axios.delete).toHaveBeenCalledWith(
            `/api/shops/${shopId}/favorite`,
        );
        // mutateが3回呼ばれていること（addと同様）
        expect(mockMutate).toHaveBeenCalledTimes(3);
    });
});
