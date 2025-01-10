"use client";

import * as React from "react";
import { Input } from "../input";
import { cn } from "@/lib/utils";

export const SidebarSearch = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <div className="px-4 py-2">
      <Input
        ref={ref}
        type="search"
        placeholder="Search..."
        className={cn("h-8 w-full bg-background px-3", className)}
        {...props}
      />
    </div>
  );
});
