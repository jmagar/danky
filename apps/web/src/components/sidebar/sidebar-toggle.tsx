'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useSidebarContext } from './sidebar-context';

export function SidebarToggle({ className }: React.HTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebarContext();

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        'bg-background absolute -right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm',
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );
}
