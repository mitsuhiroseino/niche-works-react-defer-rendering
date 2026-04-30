import useIsMounted from '@niche-works/react/hooks/useIsMounted';
import FontFaceObserver from 'fontfaceobserver';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { DeferRenderingResult, RenderingState } from '../types';
import useDeferUntilStateChange from '../useDeferUntilReady';
import type { UseDeferUntilFontReadyOptions } from './types';

/**
 * 指定のフォントが利用可能になるまで描画を遅延させるhook
 * @param target 描画対象のノード
 * @param fontFamily フォントファミリー
 * @param options オプション
 * @returns state（'pending', 'ready', 'fallback'）と状態に応じたノード
 */
export default function useDeferUntilFontReady<T extends ReactNode, P, E>(
  target: T,
  fontFamily: string | null | undefined,
  options: UseDeferUntilFontReadyOptions<P, E>,
): DeferRenderingResult<T | P | E> {
  const { fontVariant, timeout = 4000, loader, ...opts } = options;
  const [state, setState] = useState<RenderingState>('pending');
  const isMounted = useIsMounted();

  useEffect(() => {
    const observe = () => {
      new FontFaceObserver(fontFamily, fontVariant)
        .load(null, timeout)
        .then(() => {
          if (isMounted()) {
            setState('ready');
          }
        })
        .catch(() => {
          if (isMounted()) {
            setState('fallback');
          }
        });
    };

    setState('pending');
    if (loader) {
      loader()
        .then(() => observe())
        .catch(() => {
          if (isMounted()) {
            setState('fallback');
          }
        });
    } else {
      observe();
    }
  }, [fontFamily, fontVariant, timeout, loader]);

  return useDeferUntilStateChange(target, state, opts);
}
