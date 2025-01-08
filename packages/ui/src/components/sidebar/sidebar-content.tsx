"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { isOpen } = useSidebar();

  return (
    <div
      ref={ref}
      data-sidebar="content"
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        "h-full w-[300px] border-r bg-background transition-all duration-300 ease-in-out data-[state=closed]:w-[0px] data-[state=closed]:opacity-0",
        className
      )}
      {...props}
    />
  );
});
