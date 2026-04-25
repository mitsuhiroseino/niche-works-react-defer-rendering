import type { ReactNode } from 'react';
import { useCallback, useRef } from 'react';
import type { DeferRenderingWithHandlersResult } from '../types';
import useDeferUntilOnReady from '../useDeferUntilOnReady';
import type { UseDeferUntilCalledCountOptions } from './types';

/**
 * 戻り値として返す`onReady`が実行されるまで描画を遅延させるhook
 * @param target 描画対象のノード
 * @param options オプション
 * @returns state（'pending', 'ready', 'error'）と状態に応じたノードと状態変更用のハンドラー
 */
export default function useDeferUntilCalledCount<T extends ReactNode, P, E>(
  target: T,
  options: UseDeferUntilCalledCountOptions<P, E>,
): DeferRenderingWithHandlersResult<T | P | E> {
  const {
    onPendingCount = 1,
    onErrorCount = 1,
    onReadyCount = 1,
    ...opts
  } = options;
  const {
    onPending: handlePending,
    onError: handleError,
    onReady: handleReady,
    ...rest
  } = useDeferUntilOnReady(target, opts);
  const pendingContRef = useRef(0);
  const errorContRef = useRef(0);
  const readyContRef = useRef(0);
  const reset = useCallback(() => {
    pendingContRef.current = 0;
    errorContRef.current = 0;
    readyContRef.current = 0;
  }, []);
  const onPending = useCallback(() => {
    pendingContRef.current += 1;
    if (onPendingCount <= pendingContRef.current) {
      reset();
      handlePending();
    }
  }, [handlePending, onPendingCount]);
  const onError = useCallback(() => {
    errorContRef.current += 1;
    if (onErrorCount <= errorContRef.current) {
      reset();
      handleError();
    }
  }, [handleError, onErrorCount]);
  const onReady = useCallback(() => {
    readyContRef.current += 1;
    if (onReadyCount <= readyContRef.current) {
      reset();
      handleReady();
    }
  }, [handleReady, onReadyCount]);

  return {
    ...rest,
    onPending,
    onError,
    onReady,
  };
}
