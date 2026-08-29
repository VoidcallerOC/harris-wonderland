import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ticket-ink px-2.5 py-1.5 font-ui text-kicker font-bold uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}
