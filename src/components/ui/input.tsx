import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full border border-border bg-secondary px-4 text-foreground outline-none transition-[border-color] duration-quick ease-out placeholder:text-muted-foreground focus-visible:border-brass",
        className,
      )}
      {...props}
    />
  );
}
