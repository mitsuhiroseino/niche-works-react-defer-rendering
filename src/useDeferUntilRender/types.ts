import type { ReactNode, RefObject } from 'react';
import type { UseDeferUntilTrueOptions } from '../useDeferUntilTrue';

export type UseDeferUntilRenderOptions<P extends ReactNode = ReactNode> =
  UseDeferUntilTrueOptions<P> & {
    /**
     * 監視するコンテナーの参照\
     * デフォルトはdocument（文書全体）
     */
    rootRef?: RefObject<Element | Document | null | undefined>;

    /**
     * DOM変更検知時のデバウンス時間（ミリ秒）
     * デフォルトは100ms
     * @default 100
     */
    detectionDelay?: number;

    /**
     * SSR時など、実際のエレメントの描画状態を判定できない環境での初期値\
     * デフォルトはfalse
     * @default false
     */
    initialCondition?: boolean;
  };
