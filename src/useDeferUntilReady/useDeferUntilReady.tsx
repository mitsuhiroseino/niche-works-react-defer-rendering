import useIsMounted from '@niche-works/react/hooks/useIsMounted';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { DeferRenderingResult, RenderingState } from '../types';
import type { UseDeferUntilReadyOptions } from './types';

/**
 * ステートが'ready'になるまで描画を遅延させるhook
 * @param target 描画対象のノード
 * @param state ステート（'pending', 'ready', 'error'）
 * @param options オプション
 * @returns state（'pending', 'ready', 'error'）と状態に応じたノード
 */
export default function useDeferUntilReady<T extends ReactNode, P, E>(
  target: T,
  state: RenderingState,
  options: UseDeferUntilReadyOptions<P, E> = {},
): DeferRenderingResult<T | P | E> {
  const {
    pending,
    error,
    pendingDefer,
    errorDefer,
    readyDefer,
    preserveOnceError,
    preserveOnceReady,
  } = options;
  const latestStateRef = useRef<RenderingState>(null);
  const latestState = latestStateRef.current;
  let currentState = state;
  if (preserveOnceReady && latestState === 'ready') {
    // 一度readyになったらready状態を保持する
    currentState = latestState;
  } else if (preserveOnceError && latestState === 'error') {
    // 一度errorになったらerror状態を保持する
    currentState = latestState;
  }
  latestStateRef.current = currentState;
  // currentに応じたノードと遅延時間を取得
  const nextInfo = {
    pending: { nextNode: pending, defer: pendingDefer },
    error: { nextNode: error, defer: errorDefer },
    ready: { nextNode: target, defer: readyDefer },
  }[currentState];
  const nextRef = useRef(nextInfo);
  nextRef.current = nextInfo;
  const [node, setNode] = useState(() =>
    nextInfo.defer == null ? nextInfo.nextNode : null,
  );
  const isMounted = useIsMounted();

  useEffect(() => {
    const { nextNode, defer } = nextRef.current;
    if (defer == null) {
      // 遅延なし
      setNode(nextNode);
      return;
    } else {
      // 遅延あり
      const timeoutId = setTimeout(() => {
        if (isMounted()) {
          setNode(nextNode);
        }
      }, defer);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentState]);

  return {
    state: currentState,
    node,
  };
}
