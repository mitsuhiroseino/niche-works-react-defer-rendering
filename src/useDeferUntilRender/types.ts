import type { ReactNode } from 'react';
import type { UseDeferUntilTrueOptions } from '../useDeferUntilTrue';

export type UseDeferUntilRenderOptions<P extends ReactNode = ReactNode> =
  UseDeferUntilTrueOptions<P> & {
    /**
     * エレメントを監視する間隔（ミリ秒）
     * デフォルトは400ms
     * @default 400
     */
    interval?: number;
  };
