import { useEffect, useState } from "react";
import { getShopStatus } from "@/lib/hours";
import { cn } from "@/lib/utils";

export function OpenBadge({ className }: { className?: string }) {
  const [status, setStatus] = useState(() => getShopStatus());

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getShopStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-ui text-kicker font-bold uppercase tracking-kicker",
        status.isOpen ? "text-moss" : "text-fg-soft",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status.isOpen ? "bg-moss" : "bg-muted-foreground",
        )}
      />
      {status.isOpen ? "Open now" : status.badge}
    </span>
  );
}
