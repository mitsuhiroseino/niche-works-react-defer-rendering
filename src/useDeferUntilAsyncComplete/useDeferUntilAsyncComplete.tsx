import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { DeferRenderingResult } from '../types';
import useDeferUntilResolved from '../useDeferUntilResolved';
import type { UseDeferUntilAsyncCompleteOptions } from './types';

/**
 * 非同期関数の処理の完了まで描画を遅延させるhook
 * @param target 描画対象のノード
 * @param asyncFn 非同期関数
 * @param options オプション
 * @returns state（'pending', 'ready', 'fallback'）と状態に応じたノード
 */
export default function useDeferUntilAsyncComplete<T extends ReactNode, P, E>(
  target: T,
  asyncFn: (() => Promise<void>) | null | undefined,
  options: UseDeferUntilAsyncCompleteOptions<P, E> = {},
): DeferRenderingResult<T | P | E> {
  const promise = useMemo(() => {
    if (asyncFn) {
      return asyncFn();
    }
  }, [asyncFn]);

  return useDeferUntilResolved(target, promise, options);
}
