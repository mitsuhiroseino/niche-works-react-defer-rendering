import type { ReactNode, RefObject } from 'react';
import type { UseDeferUntilTrueOptions } from '../useDeferUntilTrue';

export type UseDeferUntilScrolledOptions<P extends ReactNode = ReactNode> =
  UseDeferUntilTrueOptions<P> & {
    /**
     * 監視するコンテナーの参照
     */
    rootRef?: RefObject<Element | null | undefined>;

    rootMargin?: number;

    /**
     * スクロールイベントのデバウンス時間（ミリ秒）
     * デフォルトは100ms
     * @default 100
     */
    detectionDelay?: number;

    /**
     * 検知するスクロールの方向
     */
    direction?: 'vertical' | 'horizontal';

    /**
     * SSR時など、実際のスクロール位置を判定できない環境での初期値\
     * デフォルトはfalse
     * @default false
     */
    initialCondition?: boolean;
  };
