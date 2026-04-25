import type { ReactNode } from 'react';
import type { UseDeferUntilTimeoutOptions } from '../useDeferUntilTimeout';

export type UseDeferUntilDateOptions<P extends ReactNode = ReactNode> =
  UseDeferUntilTimeoutOptions<P>;
