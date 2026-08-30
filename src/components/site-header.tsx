import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, ShoppingBag, X, Phone } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { OpenBadge } from "@/components/open-badge";
import { cartCount, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const setCartOpen = useCart((s) => s.setOpen);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const count = hydrated ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="wrap flex h-[4.25rem] min-w-0 items-center justify-between gap-3 sm:h-[4.5rem]">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 text-foreground no-underline hover:text-ticket"
        >
          <img
            src="/images/logo-192.png"
            alt=""
            width={192}
            height={192}
            className="size-11 shrink-0 rounded-full ring-1 ring-brass/50 sm:size-12"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-[1.05rem] font-semibold italic leading-none sm:text-xl">
              Harris in Wonderland
            </span>
            <span className="mt-1 hidden font-ui text-kicker font-bold uppercase tracking-kicker text-brass sm:block">
              Canton
            </span>
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
                  <Dialog.Title className="flex items-center gap-2 font-display text-2xl italic text-ticket">
                    <img
                      src="/images/logo-192.png"
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-full"
                    />
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
