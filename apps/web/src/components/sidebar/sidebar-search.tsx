'use client';

import * as React from 'react';
import { Input, type InputProps } from '@danky/ui';
import { cn } from '@/lib/utils';

export interface SidebarSearchProps extends InputProps {
  className?: string;
}

export const SidebarSearch = React.forwardRef<HTMLInputElement, SidebarSearchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="px-4 py-2">
        <Input
          ref={ref}
          type="search"
          placeholder="Search..."
          className={cn('bg-background h-8 w-full px-3', className)}
          {...props}
        />
      </div>
    );
  }
);
SidebarSearch.displayName = 'SidebarSearch';
