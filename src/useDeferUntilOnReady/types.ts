import type { ReactNode } from 'react';
import type { UseDeferUntilReadyOptions } from '../useDeferUntilReady';

export type UseDeferUntilOnReadyOptions<
  P extends ReactNode = ReactNode,
  E extends ReactNode = ReactNode,
> = UseDeferUntilReadyOptions<P, E> & {
  /**
   * onReadyのデバウンス時間（ミリ秒）
   * 未指定の場合は即時処理
   */
  onReadyDelay?: number;

  /**
   * onFallbackのデバウンス時間（ミリ秒）
   * 未指定の場合は即時処理
   */
  onFallbackDelay?: number;

  /**
   * onPendingのデバウンス時間（ミリ秒）
   * 未指定の場合は即時処理
   */
  onPendingDelay?: number;
};
