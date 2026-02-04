import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useShops } from "./useShops";
import { useData } from "./useData";

// useData をモックする
vi.mock("./useData");

describe("useShops", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // useData の戻り値を設定
        (useData as Mock).mockReturnValue({
            data: [],
            error: null,
            isLoading: false,
            mutate: vi.fn(),
        });
    });

    it("引数なしの場合、クエリパラメータなしでリクエストすること", () => {
        renderHook(() => useShops());
        // useData が正しいURLで呼ばれたか確認
        // 第2引数(Schema), 第3引数(Options) は anything() で許容
        expect(useData).toHaveBeenCalledWith(
            "/api/shops",
            expect.anything(),
            expect.anything(),
        );
    });

    it("検索条件がある場合、正しいクエリパラメータが付与されること", () => {
        renderHook(() =>
            useShops({ areaId: "1", genreId: "2", name: "Sushi" }),
        );

        const expectedUrl = "/api/shops?area_id=1&genre_id=2&name=Sushi";
        expect(useData).toHaveBeenCalledWith(
            expectedUrl,
            expect.anything(),
            expect.anything(),
        );
    });
});
