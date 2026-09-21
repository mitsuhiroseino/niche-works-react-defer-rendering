import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useDeferUntilAsyncComplete from './useDeferUntilAsyncComplete';

describe('useDeferUntilAsyncComplete', () => {
  it('asyncFnが未指定（null）の場合、最初からreadyになる', () => {
    const { result } = renderHook(() =>
      useDeferUntilAsyncComplete('target', null),
    );
    expect(result.current.state).toBe('ready');
  });

  it('asyncFnが解決するとreadyになる', async () => {
    const asyncFn = vi.fn(() => Promise.resolve());
    const { result } = renderHook(() =>
      useDeferUntilAsyncComplete('target', asyncFn),
    );
    expect(result.current.state).toBe('pending');

    await act(async () => {
      await asyncFn.mock.results[0].value;
    });
    expect(result.current.state).toBe('ready');
  });

  it('asyncFnがrejectするとfallbackになる', async () => {
    const asyncFn = vi.fn(() => Promise.reject(new Error('failed')));
    const { result } = renderHook(() =>
      useDeferUntilAsyncComplete('target', asyncFn, { fallback: 'error' }),
    );

    await act(async () => {
      await asyncFn.mock.results[0].value.catch(() => {});
    });
    expect(result.current.state).toBe('fallback');
  });

  it('同じasyncFn参照の間は再実行されない', async () => {
    const asyncFn = vi.fn(() => Promise.resolve());
    const { rerender } = renderHook(
      ({ fn }: { fn: () => Promise<void> }) =>
        useDeferUntilAsyncComplete('target', fn),
      { initialProps: { fn: asyncFn } },
    );
    expect(asyncFn).toHaveBeenCalledTimes(1);

    rerender({ fn: asyncFn });
    expect(asyncFn).toHaveBeenCalledTimes(1);

    // asyncFnの解決を待ってから終了する（act警告防止）
    await act(async () => {
      await asyncFn.mock.results[0].value;
    });
  });
});
