import type { ReactNode } from 'react';
import type { UseDeferUntilReadyOptions } from '../useDeferUntilReady';

export type UseDeferUntilResolvedOptions<
  P extends ReactNode = ReactNode,
  E extends ReactNode = ReactNode,
> = UseDeferUntilReadyOptions<P, E>;
