import useIsMounted from '@niche-works/react/hooks/useIsMounted';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { DeferRenderingResult } from '../types';
import useDeferUntilTrue from '../useDeferUntilTrue';
import type { UseDeferUntilRenderOptions } from './types';

/**
 * セレクターに一致するエレメントが描画されるまで描画を遅延させるhook
 * @param target 描画対象のノード
 * @param query クエリセレクター（例: '.my-class'）
 * @param options オプション
 * @returns state（'pending', 'ready'）と状態に応じたノード
 */
export default function useDeferUntilRender<T extends ReactNode, P>(
  target: T,
  query: string,
  options: UseDeferUntilRenderOptions<P> = {},
): DeferRenderingResult<T | P> {
  const { interval = 400, preserveOnceReady, ...opts } = options;
  const [condition, setCondition] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (query) {
      const intervalId = setInterval(() => {
        const element = document.querySelector(query);
        if (element) {
          if (isMounted()) {
            setCondition(true);
          }
          if (preserveOnceReady) {
            // 一度readyになったらready状態を保持する場合はintervalをクリアする
            clearInterval(intervalId);
          }
        } else {
          if (isMounted()) {
            setCondition(false);
          }
        }
      }, interval);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [query]);

  return useDeferUntilTrue(target, condition, { preserveOnceReady, ...opts });
}
