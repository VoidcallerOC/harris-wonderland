import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-1.5 block font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft",
        className,
      )}
      {...props}
    />
  );
}