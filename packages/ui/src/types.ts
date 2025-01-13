import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import type * as RadixTooltip from '@radix-ui/react-tooltip';
import type * as RadixDialog from '@radix-ui/react-dialog';

import type { Input } from './components/input';
import type { Separator } from './components/separator';
import type { Sheet } from './components/sheet';
import type { Skeleton } from './components/skeleton';
import type {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/tooltip';

export type InputElement = ElementRef<typeof Input>;
export type InputProps = ComponentPropsWithoutRef<typeof Input>;

export type SeparatorElement = ElementRef<typeof Separator>;
export type SeparatorProps = ComponentPropsWithoutRef<typeof Separator>;

export type SheetElement = ElementRef<typeof Sheet>;
export type SheetProps = ComponentPropsWithoutRef<typeof Sheet>;

export type SkeletonElement = ElementRef<typeof Skeleton>;
export type SkeletonProps = ComponentPropsWithoutRef<typeof Skeleton>;

export type TooltipElement = ElementRef<typeof Tooltip>;
export type TooltipProps = ComponentPropsWithoutRef<typeof Tooltip>;

export type TooltipContentElement = ElementRef<typeof TooltipContent>;
export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipContent>;

export type TooltipProviderElement = ElementRef<typeof TooltipProvider>;
export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipProvider>;

export type TooltipTriggerElement = ElementRef<typeof TooltipTrigger>;
export type TooltipTriggerProps = ComponentPropsWithoutRef<typeof TooltipTrigger>;
