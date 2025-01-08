"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../tooltip";
import { useSidebar } from "./sidebar-context";

const sidebarItemVariants = cva(
  "group/sidebar-item relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "gap-1.5 px-1.5 py-1 text-xs",
        md: "gap-2 px-2 py-1.5 text-sm",
        lg: "gap-2.5 px-2.5 py-2 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SidebarItemProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof sidebarItemVariants> {
  asChild?: boolean;
  isActive?: boolean;
}

export const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className, asChild = false, size, isActive, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    const { state } = useSidebar();

    const content = (
      <Comp
        ref={ref}
        className={cn(
          sidebarItemVariants({ size }),
          isActive && "bg-accent text-accent-foreground",
          className
        )}
        {...props}
      />
    );

    if (state === "collapsed") {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={20}>
            {props.children}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  }
);

export const SidebarItemSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Skeleton> & { size?: "sm" | "md" | "lg" }
>(({ size = "md", className, ...props }, ref) => {
  return (
    <Skeleton
      ref={ref}
      className={cn(
        "w-full",
        size === "sm" && "h-6",
        size === "md" && "h-8",
        size === "lg" && "h-10",
        className
      )}
      {...props}
    />
  );
});
