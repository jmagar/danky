"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Separator } from "../separator";

export const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 px-2 py-2", className)}
      {...props}
    />
  );
});

export const SidebarSectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-2 text-xs font-semibold text-muted-foreground", className)}
      {...props}
    />
  );
});

export const SidebarSectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
});

export const SidebarSectionSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator ref={ref} className={cn("my-2", className)} {...props} />
  );
});
