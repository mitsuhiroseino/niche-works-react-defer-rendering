import type { ReactNode } from 'react';
import type { DeferRenderingWithFallbackOptionsBase } from '../types';

export type UseDeferUntilReadyOptions<
  P extends ReactNode = ReactNode,
  E extends ReactNode = ReactNode,
> = DeferRenderingWithFallbackOptionsBase<P, E>;
