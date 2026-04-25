import type { ReactNode } from 'react';

/**
 * オプションのベース
 */
export type DeferRenderingOptionsBase<P extends ReactNode> = {
  /**
   * 表示待ち中に表示するノード
   */
  pending?: P;

  /**
   * pendingを表示する際の遅延時間（ミリ秒）
   * 未指定の場合は即表示
   */
  pendingDefer?: number;

  /**
   * readyを表示する際の遅延時間（ミリ秒）
   * 未指定の場合は即表示
   */
  readyDefer?: number;

  /**
   * 一旦readyになったらready状態を保持するかどうか
   * trueの場合、ready状態になった後にpending状態に戻すことができない
   */
  preserveOnceReady?: boolean;
};

/**
 * オプションのベース(エラー有り)
 */
export type DeferRenderingWithErrorOptionsBase<
  P extends ReactNode,
  E extends ReactNode,
> = DeferRenderingOptionsBase<P> & {
  /**
   * エラー時に表示するノード
   */
  error?: E;

  /**
   * errorを表示する際の遅延時間（ミリ秒）
   * 未指定の場合は即表示
   */
  errorDefer?: number;

  /**
   * 一旦errorになったらerror状態を保持するかどうか
   * trueの場合、error状態になった後にpending状態に戻すことができない
   */
  preserveOnceError?: boolean;
};

/**
 * 描画に関する状態
 */
export type RenderingState = 'pending' | 'error' | 'ready';

/**
 * 現在の状態を示す戻り値
 */
export type DeferRenderingResult<N extends ReactNode> = {
  /**
   * 描画状態
   */
  state: RenderingState;

  /**
   * 描画するノード
   */
  node: N;
};

/**
 * 現在の状態と状態変更用のハンドラーを返す戻り値
 */
export type DeferRenderingWithHandlersResult<N extends ReactNode> =
  DeferRenderingResult<N> & {
    /**
     * 描画前の状態に戻すハンドラー
     * @returns
     */
    onPending: () => void;

    /**
     * 描画不可能な状態になった時に実行するハンドラー
     * @returns
     */
    onError: () => void;

    /**
     * 描画可能な状態になった時に実行するハンドラー
     * @returns
     */
    onReady: () => void;
  };
