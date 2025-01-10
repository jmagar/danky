"use client";

import * as React from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "../button";
import { useSidebar } from "./sidebar-context";

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={(e) => {
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
});

SidebarTrigger.displayName = "SidebarTrigger";
