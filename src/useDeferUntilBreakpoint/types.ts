import type { ReactNode } from 'react';
import type { UseDeferUntilTrueOptions } from '../useDeferUntilTrue';

export type UseDeferUntilBreakpointOptions<P extends ReactNode = ReactNode> =
  UseDeferUntilTrueOptions<P> & {
    /**
     * メディアクエリー変更時のデバウンス時間（ミリ秒）
     * デフォルトは100ms
     * @default 100
     */
    detectionDelay?: number;

    /**
     * SSR時など、実際のメディアクエリーを判定できない環境での初期値\
     * デフォルトはfalse
     * @default false
     */
    initialCondition?: boolean;
  };
