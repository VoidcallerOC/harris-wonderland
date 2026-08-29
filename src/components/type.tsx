import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-ui text-kicker font-bold uppercase tracking-kicker text-brass",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Display({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-display text-section font-semibold italic leading-[0.95] tracking-display text-ticket",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Lede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("max-w-[46ch] text-lede leading-snug text-fg-soft", className)}>
      {children}
    </p>
  );
}
