import useIsMounted from '@niche-works/react/hooks/useIsMounted';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { DeferRenderingResult, RenderingState } from '../types';
import useDeferUntilReady from '../useDeferUntilReady';
import type { UseDeferUntilResolvedOptions } from './types';

/**
 * Promiseの完了まで描画を遅延させるhook
 * @param target 描画対象のノード
 * @param promise プロミス
 * @param options オプション
 * @returns state（'pending', 'ready', 'error'）と状態に応じたノード
 */
export default function useDeferUntilResolved<T extends ReactNode, P, E>(
  target: T,
  promise: Promise<unknown> | null | undefined,
  options: UseDeferUntilResolvedOptions<P, E> = {},
): DeferRenderingResult<T | P | E> {
  const [state, setState] = useState<RenderingState>(
    promise ? 'pending' : 'ready',
  );
  const isMounted = useIsMounted();

  useEffect(() => {
    if (promise) {
      setState('pending');
      promise
        .then(() => {
          if (isMounted()) {
            setState('ready');
          }
        })
        .catch(() => {
          if (isMounted()) {
            setState('error');
          }
        });
    }
  }, [promise]);

  return useDeferUntilReady(target, state, options);
}
