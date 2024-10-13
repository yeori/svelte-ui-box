import type { IconParam } from './components/index.js';

export const UnitSizeList = ['xs', 'sm', 'md'] as const;
export type UnitSize = (typeof UnitSizeList)[number];

export type ColorDef = {
  bgc: string[];
  fgc: string[];
};

export type PendingParam = {
  timeout?: number;
  text?: string;
  icon?: string | IconParam;
};
