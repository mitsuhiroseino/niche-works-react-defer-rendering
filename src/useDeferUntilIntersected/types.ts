import type { CSSProperties, ReactNode, RefObject } from 'react';
import type { UseDeferUntilTrueOptions } from '../useDeferUntilTrue';

export type UseDeferUntilIntersectedOptions<P extends ReactNode = ReactNode> =
  UseDeferUntilTrueOptions<P> &
    IntersectionObserverInit & {
      /**
       * 監視するコンテナーの参照
       * デフォルトはnull（ビューポート）
       */
      rootRef?: RefObject<Element | null | undefined>;

      /**
       * ビューポートとの交差判定をする基準になるマージン\
       * CSSのmarginと同じ形式で指定\
       * 未指定の場合はビューポートの端で判定される
       */
      rootMargin?: CSSProperties['margin'];

      /**
       * ビューポートに基準となる要素がどの程度の割合入ったら描画するか(0～1)\
       * デフォルトは0.1（10%）
       * @default 0.1
       */
      threshold?: number;
    };
