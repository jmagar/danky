'use client';

import * as React from 'react';
import { PanelLeft } from 'lucide-react';
import { Button, type ButtonProps } from '@danky/ui';
import { useSidebarContext } from './sidebar-context';

export interface SidebarTriggerProps extends ButtonProps {}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebarContext();

    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(e);
          toggleSidebar();
        }}
        ref={ref}
        {...props}
      >
        <PanelLeft className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    );
  }
);

SidebarTrigger.displayName = 'SidebarTrigger';
