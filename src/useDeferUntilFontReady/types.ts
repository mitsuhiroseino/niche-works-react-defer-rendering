import type { FontVariant } from 'fontfaceobserver';
import type { ReactNode } from 'react';
import type { RenderingState } from '../types';
import type { UseDeferUntilReadyOptions } from '../useDeferUntilReady';

export type UseDeferUntilFontReadyOptions<
  P extends ReactNode = ReactNode,
  E extends ReactNode = ReactNode,
> = UseDeferUntilReadyOptions<P, E> & {
  /**
   *　フォントの詳細なスタイル
   */
  fontVariant?: FontVariant;

  /**
   * 読み込みに失敗した場合のタイムアウト（ミリ秒）
   * デフォルトは4000ms
   * @default 4000
   */
  timeout?: number;

  /**
   * フォントをロードする関数
   * @returns
   */
  loader?: () => Promise<void>;

  /**
   * SSR時など、実際のフォント読み込み状態を判定できない環境での初期状態\
   * デフォルトは'pending'
   * @default 'pending'
   */
  initialState?: RenderingState;
};
