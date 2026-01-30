/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from "./useAuth";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import useSWR from "swr";

// モックの定義
vi.mock("@/lib/axios");
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));
vi.mock("swr");

describe("useAuth", () => {
    const mockRouter = { push: vi.fn() };
    const mockMutate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
        // useSWRのデフォルト挙動（未ログイン）
        (useSWR as any).mockReturnValue({
            data: null,
            error: null,
            isLoading: false,
            mutate: mockMutate,
        });
    });

    it("未ログイン時は user が null であること", () => {
        const { result } = renderHook(() => useAuth());
        expect(result.current.user).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it("ログイン済み時は user データが返されること", () => {
        const mockUser = {
            id: 1,
            name: "Test User",
            email: "test@example.com",
        };
        (useSWR as any).mockReturnValue({
            data: mockUser,
            error: null,
            isLoading: false,
            mutate: mockMutate,
        });

        const { result } = renderHook(() => useAuth());
        expect(result.current.user).toEqual(mockUser);
    });

    it("logout を呼ぶと axios.post が呼ばれ、キャッシュがクリアされ、ログイン画面へ遷移すること", async () => {
        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.logout();
        });

        // 1. axios.post('/api/logout') が呼ばれたか
        expect(axios.post).toHaveBeenCalledWith("/api/logout");

        // 2. mutate(null) が呼ばれたか
        expect(mockMutate).toHaveBeenCalledWith(null);

        // 3. router.push('/login') が呼ばれたか
        expect(mockRouter.push).toHaveBeenCalledWith("/login");
    });
});
