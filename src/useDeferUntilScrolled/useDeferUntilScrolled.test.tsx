import { act, renderHook } from '@testing-library/react';
import type { RefObject } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useDeferUntilScrolled from './useDeferUntilScrolled';

function makeRect(rect: Partial<DOMRect>): DOMRect {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON() {},
    ...rect,
  } as DOMRect;
}

function mockClientSize(
  element: Element,
  size: { width?: number; height?: number },
) {
  Object.defineProperty(element, 'clientHeight', {
    value: size.height ?? 0,
    configurable: true,
  });
  Object.defineProperty(element, 'clientWidth', {
    value: size.width ?? 0,
    configurable: true,
  });
}

describe('useDeferUntilScrolled', () => {
  let root: HTMLDivElement;
  let element: HTMLDivElement;
  let rootRef: RefObject<HTMLElement | null>;
  let elementRef: RefObject<HTMLElement | null>;

  beforeEach(() => {
    vi.useFakeTimers();
    root = document.createElement('div');
    document.body.appendChild(root);
    mockClientSize(root, { width: 800, height: 800 });
    element = document.createElement('div');
    rootRef = { current: root };
    elementRef = { current: element };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    root.remove();
  });

  it('マウント時に既に可視範囲内であれば即座にreadyになる', () => {
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 100, bottom: 200 }),
    );

    const { result } = renderHook(() =>
      useDeferUntilScrolled('target', elementRef, { rootRef }),
    );
    expect(result.current.state).toBe('ready');
  });

  it('可視範囲外の場合pendingになり、scrollイベントで反映される', () => {
    const rectSpy = vi.spyOn(element, 'getBoundingClientRect');
    rectSpy.mockReturnValue(makeRect({ top: 1000, bottom: 1100 }));

    const { result } = renderHook(() =>
      useDeferUntilScrolled('target', elementRef, {
        rootRef,
        detectionDelay: 100,
      }),
    );
    expect(result.current.state).toBe('pending');

    rectSpy.mockReturnValue(makeRect({ top: 100, bottom: 200 }));
    act(() => {
      root.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(100);
    });
    expect(result.current.state).toBe('ready');
    expect(result.current.node).toBe('target');
  });

  it('horizontal方向でも判定できる', () => {
    const rectSpy = vi.spyOn(element, 'getBoundingClientRect');
    rectSpy.mockReturnValue(makeRect({ left: 1000, right: 1100 }));

    const { result } = renderHook(() =>
      useDeferUntilScrolled('target', elementRef, {
        rootRef,
        direction: 'horizontal',
        detectionDelay: 100,
      }),
    );
    expect(result.current.state).toBe('pending');

    rectSpy.mockReturnValue(makeRect({ left: 100, right: 200 }));
    act(() => {
      root.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(100);
    });
    expect(result.current.state).toBe('ready');
  });

  it('initialConditionを指定した場合、マウント時に可視範囲外でも値が維持される', () => {
    // 可視判定がfalseの場合、effectはsetCondition(false)を呼ばず
    // 既存の値（initialCondition）をそのまま維持する
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 1000, bottom: 1100 }),
    );

    const { result } = renderHook(() =>
      useDeferUntilScrolled('target', elementRef, {
        rootRef,
        initialCondition: true,
      }),
    );
    expect(result.current.state).toBe('ready');
  });

  it('preserveOnceReadyを指定した場合、readyになった後はscrollリスナーが解除される', () => {
    const rectSpy = vi.spyOn(element, 'getBoundingClientRect');
    rectSpy.mockReturnValue(makeRect({ top: 1000, bottom: 1100 }));
    const removeEventListenerSpy = vi.spyOn(root, 'removeEventListener');

    const { result } = renderHook(() =>
      useDeferUntilScrolled('target', elementRef, {
        rootRef,
        preserveOnceReady: true,
        detectionDelay: 100,
      }),
    );
    expect(result.current.state).toBe('pending');

    rectSpy.mockReturnValue(makeRect({ top: 100, bottom: 200 }));
    act(() => {
      root.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(100);
    });
    expect(result.current.state).toBe('ready');
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );
  });

  it('アンマウント時にscrollリスナーが解除される', () => {
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 1000, bottom: 1100 }),
    );
    const removeEventListenerSpy = vi.spyOn(root, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useDeferUntilScrolled('target', elementRef, { rootRef }),
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );
  });

  it('rootRefを指定しない場合、document.documentElementにフォールバックしてもエラーにならない', () => {
    // 前回修正したSSRクラッシュ（トップレベルでのdocument参照）の回帰確認
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: -10, bottom: 10 }),
    );

    expect(() => {
      renderHook(() => useDeferUntilScrolled('target', elementRef));
    }).not.toThrow();
  });
});
