import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { DeferRenderingResult } from '../types';
import useDeferUntilTimeout from '../useDeferUntilTimeout';
import type { UseDeferUntilDateOptions } from './types';

/**
 * 指定の日時まで描画を遅延させるhook
 * @param target 描画対象のノード
 * @param defer 遅延させる時間
 * @param options オプション
 * @returns state（'pending', 'ready'）と状態に応じたノード
 */
export default function useDeferUntilDate<T extends ReactNode, P>(
  target: T,
  date: Date | null | undefined,
  options: UseDeferUntilDateOptions<P> = {},
): DeferRenderingResult<T | P> {
  const time = date ? date.getTime() : null;
  const defer = useMemo(
    () => (time != null ? time - Date.now() : null),
    [time],
  );

  return useDeferUntilTimeout(target, defer, options);
}
