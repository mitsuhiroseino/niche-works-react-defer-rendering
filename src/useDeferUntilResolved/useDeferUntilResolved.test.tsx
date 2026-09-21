import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useDeferUntilResolved from './useDeferUntilResolved';

describe('useDeferUntilResolved', () => {
  it('promiseが未指定（null）の場合、最初からreadyになる', () => {
    const { result } = renderHook(() =>
      useDeferUntilResolved('target', null),
    );
    expect(result.current.state).toBe('ready');
  });

  it('promiseが指定されている間はpendingになる', () => {
    const promise = new Promise<void>(() => {});
    const { result } = renderHook(() =>
      useDeferUntilResolved('target', promise, { pending: 'loading' }),
    );
    expect(result.current.state).toBe('pending');
    expect(result.current.node).toBe('loading');
  });

  it('promiseがresolveするとreadyになる', async () => {
    const promise = Promise.resolve();
    const { result } = renderHook(() =>
      useDeferUntilResolved('target', promise),
    );
    expect(result.current.state).toBe('pending');

    await act(async () => {
      await promise;
    });
    expect(result.current.state).toBe('ready');
    expect(result.current.node).toBe('target');
  });

  it('promiseがrejectするとfallbackになる', async () => {
    const promise = Promise.reject(new Error('failed'));
    const { result } = renderHook(() =>
      useDeferUntilResolved('target', promise, { fallback: 'error' }),
    );
    expect(result.current.state).toBe('pending');

    await act(async () => {
      await promise.catch(() => {});
    });
    expect(result.current.state).toBe('fallback');
    expect(result.current.node).toBe('error');
  });

  it('アンマウント後にpromiseが解決してもエラーにならない', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    let resolvePromise: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const { unmount } = renderHook(() =>
      useDeferUntilResolved('target', promise),
    );

    unmount();
    await act(async () => {
      resolvePromise();
      await promise;
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
