import { useEffect, useState } from "react";
import { HOURS, getShopStatus } from "@/lib/hours";
import { SITE } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function HoursTicket({ className }: { className?: string }) {
  const [status, setStatus] = useState(() => getShopStatus());

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getShopStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <aside
      className={cn(
        "border border-dashed border-ticket-ink bg-ticket p-6 text-ticket-ink shadow-[6px_6px_0_0_var(--color-brass)]",
        className,
      )}
    >
      <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-ember">
        Admit one · the collection
      </p>
      <h2 className="mt-1 font-display text-3xl font-semibold italic leading-none">
        Shop ticket
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge
          className={cn(
            "border-ticket-ink/40",
            status.isOpen ? "text-moss" : "text-ticket-ink/70",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              status.isOpen ? "bg-moss" : "bg-muted-foreground",
            )}
          />
          {status.badge}
        </Badge>
        {status.isOpen ? null : (
          <span className="font-ui text-kicker font-bold uppercase tracking-kicker text-ticket-ink/70">
            {status.nextLabel}
          </span>
        )}
      </div>
      <ul className="mt-4">
        {HOURS.map((row) => {
          const isToday = row.day === status.today?.day;
          return (
            <li
              key={row.name}
              className={cn(
                "flex items-baseline justify-between gap-3 border-b border-ticket-ink/15 py-1.5 font-body text-sm tabular-nums",
                isToday && "font-semibold text-ember",
                row.closed && !isToday && "text-ticket-ink/50",
              )}
            >
              <span>{row.name}</span>
              <span>{row.label}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 border border-dashed border-ticket-ink/30 bg-ticket-ink/10 px-3 py-2 text-sm leading-snug">
        Confirm around holidays. Feeders are pickup at the shop, not shipped. If the
        shop line is busy, try {SITE.phones.booking.display}.
      </p>
    </aside>
  );
}
