'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input, Separator, type InputProps, type SeparatorProps } from '@danky/ui';

export interface SidebarInputProps extends InputProps {}

export const SidebarInput = React.forwardRef<HTMLInputElement, SidebarInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          'bg-background focus-visible:ring-sidebar-ring h-8 w-full shadow-none focus-visible:ring-2',
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInput.displayName = 'SidebarInput';

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn('flex flex-col gap-2 p-2', className)}
        {...props}
      />
    );
  }
);
SidebarHeader.displayName = 'SidebarHeader';

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={cn('flex flex-col gap-2 p-2', className)}
        {...props}
      />
    );
  }
);
SidebarFooter.displayName = 'SidebarFooter';

export interface SidebarSeparatorProps extends SeparatorProps {}

export const SidebarSeparator = React.forwardRef<HTMLHRElement, SidebarSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn('bg-sidebar-border mx-2 w-auto', className)}
        {...props}
      />
    );
  }
);
SidebarSeparator.displayName = 'SidebarSeparator';
