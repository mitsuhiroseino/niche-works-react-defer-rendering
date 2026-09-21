import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useDeferUntilFontReady from './useDeferUntilFontReady';

const { setLoadImpl, FontFaceObserverMock } = vi.hoisted(() => {
  let impl: () => Promise<void> = () => new Promise(() => {});
  // newで呼び出せるようclass構文でモックする
  class FontFaceObserverMockClass {
    load = vi.fn(() => impl());
  }
  const FontFaceObserverMock = vi.fn(FontFaceObserverMockClass);
  return {
    setLoadImpl: (fn: () => Promise<void>) => {
      impl = fn;
    },
    FontFaceObserverMock,
  };
});

vi.mock('fontfaceobserver', () => ({ default: FontFaceObserverMock }));

describe('useDeferUntilFontReady', () => {
  beforeEach(() => {
    setLoadImpl(() => new Promise(() => {}));
    FontFaceObserverMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('フォントの読み込みが成功するとreadyになる', async () => {
    setLoadImpl(() => Promise.resolve());
    const { result } = renderHook(() =>
      useDeferUntilFontReady('target', 'Roboto', {}),
    );
    expect(result.current.state).toBe('pending');

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.state).toBe('ready');
    expect(result.current.node).toBe('target');
  });

  it('フォントの読み込みが失敗するとfallbackになる', async () => {
    setLoadImpl(() => Promise.reject(new Error('timeout')));
    const { result } = renderHook(() =>
      useDeferUntilFontReady('target', 'Roboto', { fallback: 'error' }),
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.state).toBe('fallback');
    expect(result.current.node).toBe('error');
  });

  it('loaderを指定した場合、loader成功後にフォント確認が行われる', async () => {
    setLoadImpl(() => Promise.resolve());
    const loader = vi.fn(() => Promise.resolve());
    const { result } = renderHook(() =>
      useDeferUntilFontReady('target', 'Roboto', { loader }),
    );

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(loader).toHaveBeenCalled();
    expect(result.current.state).toBe('ready');
  });

  it('loaderが失敗した場合はfallbackになる', async () => {
    const loader = vi.fn(() => Promise.reject(new Error('load failed')));
    const { result } = renderHook(() =>
      useDeferUntilFontReady('target', 'Roboto', {
        loader,
        fallback: 'error',
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.state).toBe('fallback');
    // FontFaceObserverでの確認自体は行われない
    expect(FontFaceObserverMock).not.toHaveBeenCalled();
  });

  it('initialStateを指定した場合、確認完了までその値が維持される', () => {
    // load()を保留状態にしたまま、マウント直後の状態を確認する
    const { result } = renderHook(() =>
      useDeferUntilFontReady('target', 'Roboto', { initialState: 'ready' }),
    );
    // isFirstRunのガードにより、マウント直後にpendingへリセットされない
    expect(result.current.state).toBe('ready');
  });

  it('マウント後にfontFamilyが変わった場合は改めてpendingになる', async () => {
    setLoadImpl(() => new Promise(() => {}));
    const { result, rerender } = renderHook(
      ({ fontFamily }: { fontFamily: string }) =>
        useDeferUntilFontReady('target', fontFamily, {
          initialState: 'ready',
        }),
      { initialProps: { fontFamily: 'Roboto' } },
    );
    expect(result.current.state).toBe('ready');

    rerender({ fontFamily: 'Noto Sans' });
    expect(result.current.state).toBe('pending');
  });
});
