"use client";

import * as React from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { ToggleGroupMultipleProps, ToggleGroupSingleProps } from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/toggle";

type BaseToggleGroupProps = {
  className?: string;
  variant?: VariantProps<typeof toggleVariants>["variant"];
  size?: VariantProps<typeof toggleVariants>["size"];
};

type ToggleGroupProps = BaseToggleGroupProps &
  (ToggleGroupSingleProps | ToggleGroupMultipleProps);

const ToggleGroup = React.forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  />
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

interface ToggleGroupItemProps
  extends ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  className?: string;
  variant?: VariantProps<typeof toggleVariants>["variant"];
  size?: VariantProps<typeof toggleVariants>["size"];
}

const ToggleGroupItem = React.forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export {
  type ToggleGroupProps,
  type ToggleGroupItemProps,
  ToggleGroup,
  ToggleGroupItem
};
