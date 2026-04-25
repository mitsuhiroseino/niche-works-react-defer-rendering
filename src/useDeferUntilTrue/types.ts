import type { ReactNode } from 'react';
import type { DeferRenderingOptionsBase } from '../types';

export type UseDeferUntilTrueOptions<P extends ReactNode = ReactNode> =
  DeferRenderingOptionsBase<P>;
