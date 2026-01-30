/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useShops } from './useShops';
import useSWR from 'swr';

vi.mock('@/lib/axios');
vi.mock('swr');

describe('useShops', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSWR as any).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });
  });

  it('引数なしの場合、クエリパラメータなしでリクエストすること', () => {
    renderHook(() => useShops());
    expect(useSWR).toHaveBeenCalledWith('/api/shops', expect.any(Function), expect.anything());
  });

  it('検索条件がある場合、正しいクエリパラメータが付与されること', () => {
    renderHook(() => useShops({ areaId: '1', genreId: '2', name: 'Sushi' }));
    
    const expectedUrl = '/api/shops?area_id=1&genre_id=2&name=Sushi';
    expect(useSWR).toHaveBeenCalledWith(expectedUrl, expect.any(Function), expect.anything());
  });
});
