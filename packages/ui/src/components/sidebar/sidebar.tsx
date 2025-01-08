"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "../sheet";
import { useSidebar } from "./sidebar-context";
import { SIDEBAR_WIDTH_MOBILE } from "./sidebar-types";

interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          data-sidebar="sidebar"
          data-variant={variant}
          data-state={state}
          data-collapsible={collapsible}
          data-side={side}
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            side={side}
            className={cn(
              "flex w-full flex-col bg-sidebar text-sidebar-foreground",
              className
            )}
            style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
          >
            {children}
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        data-sidebar="sidebar"
        data-variant={variant}
        data-state={state}
        data-collapsible={collapsible}
        data-side={side}
        className={cn(
          "relative flex h-full flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-300",
          collapsible === "offcanvas" && [
            "w-[--sidebar-width] data-[state=collapsed]:w-0",
            "data-[state=collapsed]:invisible data-[state=collapsed]:opacity-0",
          ],
          collapsible === "icon" && [
            "w-[--sidebar-width] data-[state=collapsed]:w-[--sidebar-width-icon]",
          ],
          variant === "floating" && [
            "absolute inset-y-0 z-50 rounded-r-xl border shadow-xl",
            side === "right" && "right-0 rounded-l-xl rounded-r-none",
            side === "left" && "left-0",
          ],
          variant === "inset" && [
            "border-r shadow-inner",
            side === "right" && "border-l border-r-0",
          ],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
