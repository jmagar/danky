'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Separator } from '@danky/ui';
import type { SeparatorProps } from '@danky/ui';

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex flex-col gap-2 px-2 py-2', className)} {...props} />;
  }
);
SidebarSection.displayName = 'SidebarSection';

export interface SidebarSectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarSectionTitle = React.forwardRef<HTMLDivElement, SidebarSectionTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-muted-foreground px-2 text-xs font-semibold', className)}
        {...props}
      />
    );
  }
);
SidebarSectionTitle.displayName = 'SidebarSectionTitle';

export interface SidebarSectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const SidebarSectionContent = React.forwardRef<HTMLDivElement, SidebarSectionContentProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return <Comp ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />;
  }
);
SidebarSectionContent.displayName = 'SidebarSectionContent';

export interface SidebarSectionSeparatorProps extends SeparatorProps {}

export const SidebarSectionSeparator = React.forwardRef<
  HTMLDivElement,
  SidebarSectionSeparatorProps
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn('my-2', className)}
      {...props}
    />
  );
});
SidebarSectionSeparator.displayName = 'SidebarSectionSeparator';
