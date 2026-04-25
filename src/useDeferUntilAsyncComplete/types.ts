import type { ReactNode } from 'react';
import type { UseDeferUntilResolvedOptions } from '../useDeferUntilResolved';

export type UseDeferUntilAsyncCompleteOptions<
  P extends ReactNode = ReactNode,
  E extends ReactNode = ReactNode,
> = UseDeferUntilResolvedOptions<P, E>;
