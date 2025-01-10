"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";

interface ToasterProps extends Omit<SonnerProps, "theme"> {
  theme?: SonnerProps["theme"] | undefined;
}

const Toaster = ({ theme: propTheme, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={(propTheme ?? theme) as SonnerProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

Toaster.displayName = "Toaster";

export { Toaster };
export type { ToasterProps };
