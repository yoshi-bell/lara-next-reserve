import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMyFavorites } from "./useMyFavorites";
import { useData } from "./useData";
import { ENDPOINTS } from "@/services/endpoints";

vi.mock("./useData");

describe("useMyFavorites", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useData as Mock).mockReturnValue({
            data: [],
            error: null,
            isLoading: false,
            mutate: vi.fn(),
        });
    });

    it("/api/favorites をリクエストすること", () => {
        renderHook(() => useMyFavorites());
        // 第2引数(Schema) は anything() で許容
        expect(useData).toHaveBeenCalledWith(
            ENDPOINTS.FAVORITES.LIST,
            expect.anything(),
        );
    });
});
