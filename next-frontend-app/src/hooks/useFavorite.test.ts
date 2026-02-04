import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavorite } from "./useFavorite";
import axios from "@/lib/axios";
import { useSWRConfig } from "swr";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";

vi.mock("@/lib/axios");
vi.mock("swr");
vi.mock("swr/mutation");

describe("useFavorite", () => {
    const mockMutate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // SWRConfigの型対応
        vi.mocked(useSWRConfig).mockReturnValue({
            mutate: mockMutate,
        } as unknown as ReturnType<typeof useSWRConfig>);

        // 【修正点】SWRの型定義が複雑なため、モック引数は any で許容する
        vi.mocked(useSWRMutation).mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (key: any, fetcher: any, options: any) => {
                return {
                    trigger: async (arg: unknown) => {
                        // fetcher呼び出しも柔軟に対応
                        await fetcher(key, { arg });
                        if (options?.onSuccess) options.onSuccess();
                    },
                    isMutating: false,
                    data: undefined,
                    error: undefined,
                    reset: vi.fn(),
                } as unknown as SWRMutationResponse<unknown, unknown, string, unknown>;
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
        expect(mockMutate).toHaveBeenCalledWith(`/api/shops/${shopId}`); // useFavorite内でENDPOINTSを使うように修正されたが、値は同じ
        // 注意: useFavorite.ts内の修正により、ここも ENDPOINTS.SHOPS.DETAIL(shopId) などを使っているはずだが
        // 文字列としては等価なのでテストは通るはず。
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
