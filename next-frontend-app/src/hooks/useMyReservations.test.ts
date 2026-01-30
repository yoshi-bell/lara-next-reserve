/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMyReservations } from './useMyReservations';
import useSWR from 'swr';

vi.mock('@/lib/axios');
vi.mock('swr');

describe('useMyReservations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSWR as any).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });
  });

  it('デフォルト（future）では /api/reservations をリクエストすること', () => {
    renderHook(() => useMyReservations());
    expect(useSWR).toHaveBeenCalledWith('/api/reservations', expect.any(Function));
  });

  it('type="history" の場合、クエリパラメータ付きでリクエストすること', () => {
    renderHook(() => useMyReservations('history'));
    expect(useSWR).toHaveBeenCalledWith('/api/reservations?type=history', expect.any(Function));
  });
});
