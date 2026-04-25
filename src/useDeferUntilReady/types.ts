import type { ReactNode } from 'react';
import type { DeferRenderingWithErrorOptionsBase } from '../types';

export type UseDeferUntilReadyOptions<
  P extends ReactNode = ReactNode,
  E extends ReactNode = ReactNode,
> = DeferRenderingWithErrorOptionsBase<P, E>;
