import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMyReservations } from "./useMyReservations";
import { useData } from "./useData";

vi.mock("./useData");

describe("useMyReservations", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useData as Mock).mockReturnValue({
            data: [],
            error: null,
            isLoading: false,
            mutate: vi.fn(),
        });
    });

    it("デフォルト（future）では /api/reservations をリクエストすること", () => {
        renderHook(() => useMyReservations());
        expect(useData).toHaveBeenCalledWith(
            "/api/reservations",
            expect.anything(),
        );
    });

    it('type="history" の場合、クエリパラメータ付きでリクエストすること', () => {
        renderHook(() => useMyReservations("history"));
        expect(useData).toHaveBeenCalledWith(
            "/api/reservations?type=history",
            expect.anything(),
        );
    });
});
