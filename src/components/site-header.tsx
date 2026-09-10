import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, Facebook, Instagram, Menu, Phone, ShoppingBag, X } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { OpenBadge } from "@/components/open-badge";
import { cartCount, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { DesktopAnimalNav, DesktopVisitNav, MobileAnimalNav } from "@/components/animal-nav";

function NavLinks({
  pathname,
  className,
  items = NAV,
}: {
  pathname: string;
  className?: string;
  items?: readonly (typeof NAV)[number][];
}) {
  return (
    <>
      {items.map((item) => {
        const current = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={current ? "page" : undefined}
            className={cn(
              "whitespace-nowrap font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft no-underline transition-colors duration-quick hover:text-ticket",
              current && "text-ticket",
              className,
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const items = useCart((s) => s.items);
  const setCartOpen = useCart((s) => s.setOpen);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const count = hydrated ? cartCount(items) : 0;
  const closeMenu = () => {
    setOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="wrap flex h-16 min-w-0 items-center justify-between gap-2 sm:h-[4.5rem] sm:gap-3">
        <Link
          to="/"
          className="flex min-h-11 min-w-0 items-center gap-2 text-foreground no-underline hover:text-ticket max-[359px]:min-w-11 sm:gap-2.5"
        >
          <img
            src="/images/logo-192.png"
            alt=""
            width={192}
            height={192}
            className="size-10 shrink-0 rounded-full ring-1 ring-brass/50 sm:size-12"
          />
          <span className="block min-w-0 max-[359px]:hidden">
            <span className="block whitespace-nowrap font-display text-sm font-semibold italic leading-none sm:text-xl">
              Harris in Wonderland
            </span>
            <span className="mt-1 hidden font-ui text-kicker font-bold uppercase tracking-kicker text-brass sm:block">
              Canton
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <OpenBadge className="hidden md:inline-flex" />
          <Button asChild size="sm" variant="ghost" className="max-sm:size-11 max-sm:p-0">
            <a href={SITE.phones.shop.href} aria-label={`Call the shop at ${SITE.phones.shop.display}`}>
              <Phone />
              <span className="hidden sm:inline">Call</span>
            </a>
          </Button>
          <div className="hidden items-center gap-1 sm:flex" aria-label="Social links">
            <a href={SITE.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex size-10 items-center justify-center text-ticket hover:text-brass">
              <Instagram className="size-4" />
            </a>
            <a href={SITE.links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex size-10 items-center justify-center text-ticket hover:text-brass">
              <Facebook className="size-4" />
            </a>
          </div>
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
          <Dialog.Root open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : closeMenu())}>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex size-11 shrink-0 items-center justify-center border border-brass/40 text-ticket lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls="mobile-navigation"
            >
              <Menu className="size-5" />
            </button>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80" />
              <Dialog.Content
                id="mobile-navigation"
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[22rem] flex-col overflow-y-auto border-l border-brass bg-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))] shadow-none sm:p-6"
              >
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

                <nav aria-label="Mobile navigation" className="mt-6 grid gap-5">
                  <div>
                    <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">Start here</p>
                    <div className="mt-2 grid border-y border-border">
                      {NAV.filter((item) => item.to === "/" || item.to === "/shop").map((item) => {
                        const current = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={closeMenu}
                            aria-current={current ? "page" : undefined}
                            className={cn(
                              "flex min-h-12 items-center justify-between border-b border-border px-1 font-display text-2xl italic text-ticket no-underline last:border-0",
                              current && "text-brass",
                            )}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <a
                    href={SITE.links.morphMarket}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="flex min-h-14 items-center justify-between border border-brass bg-brass/10 px-4 font-display text-2xl italic text-ticket no-underline transition-colors hover:bg-brass hover:text-ticket-ink"
                  >
                    <span>MorphMarket</span>
                    <ExternalLink className="size-5" aria-hidden="true" />
                  </a>

                  <MobileAnimalNav onNavigate={closeMenu} />

                  <div>
                    <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">Shop & visit</p>
                    <div className="mt-2 grid border-y border-border">
                      {NAV.filter((item) => !["/", "/shop", "/collection"].includes(item.to)).map((item) => {
                        const current = pathname.startsWith(item.to);
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={closeMenu}
                            aria-current={current ? "page" : undefined}
                            className={cn(
                              "flex min-h-12 items-center justify-between border-b border-border px-1 font-display text-2xl italic text-ticket no-underline last:border-0",
                              current && "text-brass",
                            )}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </nav>

                <div className="mt-6 grid gap-3 border-t border-border pt-5">
                  <OpenBadge />
                  <Button asChild>
                    <a href={SITE.phones.shop.href}>
                      <Phone />
                      {SITE.phones.shop.display}
                    </a>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="ghost">
                      <a href={SITE.links.instagram} target="_blank" rel="noopener noreferrer"><Instagram /> Instagram</a>
                    </Button>
                    <Button asChild variant="ghost">
                      <a href={SITE.links.facebook} target="_blank" rel="noopener noreferrer"><Facebook /> Facebook</a>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      closeMenu();
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

      <nav className="hidden border-t border-border lg:block">
        <div className="wrap flex items-center justify-center gap-x-5 py-2.5 2xl:gap-x-8">
          <NavLinks
            pathname={pathname}
            items={NAV.filter((item) => !["/rentals", "/story", "/visit", "/fish"].includes(item.to))}
          />
          <DesktopAnimalNav pathname={pathname} />
          <DesktopVisitNav pathname={pathname} />
          <a
            href={SITE.links.morphMarket}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft no-underline transition-colors duration-quick hover:text-ticket"
          >
            MorphMarket
          </a>
        </div>
      </nav>
    </header>
  );
}
