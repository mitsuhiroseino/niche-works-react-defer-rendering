'use client';

import unit from '@niche-works/web-utils/unit';
import type { ReactNode, RefObject } from 'react';
import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { DeferRenderingResult } from '../types';
import useDeferUntilTrue from '../useDeferUntilTrue';
import type { UseDeferUntilIntersectedOptions } from './types';

/**
 * 基準となる要素がビューポートに入るまで描画を遅延させるhook
 * @param target 描画対象のノード
 * @param elementRef 基準となる要素の参照
 * @param options オプション
 * @returns state（'pending', 'ready'）と状態に応じたノード
 */
export default function useDeferUntilIntersected<
  T extends ReactNode,
  P extends ReactNode = ReactNode,
>(
  target: T,
  elementRef: RefObject<HTMLElement | null | undefined>,
  options: UseDeferUntilIntersectedOptions<P> = {},
): DeferRenderingResult<T | P> {
  const defaultRootRef = useRef<Element | null | undefined>(null);
  const {
    rootRef = defaultRootRef,
    rootMargin,
    threshold = 0.1,
    initialCondition = false,
    ...opts
  } = options;
  // IntersectionObserverは同期的に現在値を取得できないため、直近の通知結果を保持する
  const snapshotRef = useRef(initialCondition);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const element = elementRef.current;
      const container = rootRef.current;
      if (!element) {
        return () => {};
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (snapshotRef.current !== entry.isIntersecting) {
            snapshotRef.current = entry.isIntersecting;
            onStoreChange();
          }
        },
        {
          root: container,
          rootMargin: unit(rootMargin),
          threshold,
        },
      );

      observer.observe(element);

      return () => {
        observer.disconnect(); // クリーンアップ
      };
    },
    [elementRef.current, rootRef.current, threshold, rootMargin],
  );
  const getSnapshot = useCallback(() => snapshotRef.current, []);
  // SSR時は実際の交差状態を判定できないためinitialConditionを使う
  const getServerSnapshot = useCallback(
    () => initialCondition,
    [initialCondition],
  );

  const condition = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useDeferUntilTrue(target, condition, opts);
}
