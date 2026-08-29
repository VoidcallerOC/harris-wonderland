import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, ShoppingBag, X, Phone } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { OpenBadge } from "@/components/open-badge";
import { cartCount, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8 shrink-0 text-brass", className)}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path
        d="M11 17.5c2.2-4 7.8-4 10 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const setCartOpen = useCart((s) => s.setOpen);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const count = hydrated ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="wrap flex h-16 min-w-0 items-center justify-between gap-3">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 text-foreground no-underline hover:text-ticket"
        >
          <Mark />
          <span className="truncate font-display text-lg font-semibold italic leading-none sm:text-xl">
            <span className="sm:hidden">Harris</span>
            <span className="hidden sm:inline">Harris in Wonderland</span>
          </span>
          <span className="hidden shrink-0 font-ui text-kicker font-bold uppercase tracking-kicker text-brass md:inline">
            Canton
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV.map((item) => {
            const current =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft no-underline transition-colors duration-quick hover:text-ticket",
                  current && "text-ticket",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <OpenBadge className="hidden xl:inline-flex" />
          <Button asChild size="sm" variant="ghost" className="hidden md:inline-flex">
            <a href={SITE.phones.shop.href}>
              <Phone />
              Call
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex size-11 items-center justify-center border border-brass/40 text-ticket"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="size-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 min-w-5 bg-ember px-1 text-center font-ui text-kicker font-bold leading-5 text-ticket">
                {count}
              </span>
            ) : null}
          </button>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                className="inline-flex size-11 shrink-0 items-center justify-center border border-brass/40 text-ticket xl:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,100%)] flex-col border-l border-brass bg-card p-6 shadow-none">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-2xl italic text-ticket">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="inline-flex size-11 items-center justify-center text-ticket"
                      aria-label="Close menu"
                    >
                      <X className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="mt-8 flex flex-col gap-1">
                  {NAV.map((item) => (
                    <Dialog.Close asChild key={item.to}>
                      <Link
                        to={item.to}
                        className="flex min-h-12 items-center font-display text-3xl italic text-ticket no-underline"
                      >
                        {item.label}
                      </Link>
                    </Dialog.Close>
                  ))}
                </nav>
                <div className="mt-auto grid gap-3 pt-8">
                  <OpenBadge />
                  <Button asChild>
                    <a href={SITE.phones.shop.href}>
                      <Phone />
                      {SITE.phones.shop.display}
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setOpen(false);
                      setCartOpen(true);
                    }}
                  >
                    <ShoppingBag />
                    Cart{count ? ` (${count})` : ""}
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}