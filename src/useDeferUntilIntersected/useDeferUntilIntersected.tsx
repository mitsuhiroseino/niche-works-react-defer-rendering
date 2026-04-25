import useIsMounted from '@niche-works/react/hooks/useIsMounted';
import unit from '@niche-works/react/utils/unit';
import type { ReactNode, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
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
export default function useDeferUntilIntersected<T extends ReactNode, P>(
  target: T,
  elementRef: RefObject<HTMLElement | null | undefined>,
  options: UseDeferUntilIntersectedOptions<P> = {},
): DeferRenderingResult<T | P> {
  const defaultRootRef = useRef<Element | null | undefined>(null);
  const {
    rootRef = defaultRootRef,
    rootMargin,
    threshold = 0.1,
    ...opts
  } = options;
  const [condition, setCondition] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    const element = elementRef.current;
    const container = rootRef.current;
    if (element) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (isMounted()) {
            const entry = entries[0];
            setCondition(entry.isIntersecting);
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
    }
  }, [elementRef.current, rootRef.current, threshold, rootMargin]);

  return useDeferUntilTrue(target, condition, opts);
}
