import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useDeferUntilTimeout from './useDeferUntilTimeout';

describe('useDeferUntilTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deferが未指定（null）の場合、最初からreadyになる', () => {
    const { result } = renderHook(() => useDeferUntilTimeout('target', null));
    expect(result.current.state).toBe('ready');
  });

  it('deferが0以下の場合、即座にreadyになる', () => {
    const { result } = renderHook(() => useDeferUntilTimeout('target', 0));
    expect(result.current.state).toBe('ready');

    const { result: negativeResult } = renderHook(() =>
      useDeferUntilTimeout('target', -100),
    );
    expect(negativeResult.current.state).toBe('ready');
  });

  it('deferが正の値の場合、経過時間まではpendingになる', () => {
    const { result } = renderHook(() => useDeferUntilTimeout('target', 100));
    expect(result.current.state).toBe('pending');

    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(result.current.state).toBe('pending');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.state).toBe('ready');
    expect(result.current.node).toBe('target');
  });

  it('アンマウント時にタイマーがキャンセルされる', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() =>
      useDeferUntilTimeout('target', 100),
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
