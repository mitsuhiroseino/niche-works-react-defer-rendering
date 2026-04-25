import type { ReactNode } from 'react';
import type { UseDeferUntilOnReadyOptions } from '../useDeferUntilOnReady';

export type UseDeferUntilCalledCountOptions<
  P extends ReactNode = ReactNode,
  E extends ReactNode = ReactNode,
> = UseDeferUntilOnReadyOptions<P, E> & {
  /**
   * readyになる為のonReadyの呼び出し回数
   * 未指定の場合は1回
   */
  onReadyCount?: number;

  /**
   * errorになる為のonErrorの呼び出し回数
   * 未指定の場合は1回
   */
  onErrorCount?: number;

  /**
   * pendingになる為のonPendingの呼び出し回数
   * 未指定の場合は1回
   */
  onPendingCount?: number;
};
