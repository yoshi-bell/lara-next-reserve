/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMyFavorites } from './useMyFavorites';
import useSWR from 'swr';

vi.mock('@/lib/axios');
vi.mock('swr');

describe('useMyFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSWR as any).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });
  });

  it('/api/favorites をリクエストすること', () => {
    renderHook(() => useMyFavorites());
    expect(useSWR).toHaveBeenCalledWith('/api/favorites', expect.any(Function));
  });
});
