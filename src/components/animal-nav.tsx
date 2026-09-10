import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ANIMAL_ROOT_CATEGORIES, ANIMAL_TAXONOMY } from "@/lib/species";
import { cn } from "@/lib/utils";

const childCategories = (parentId: string) =>
  ANIMAL_TAXONOMY.filter((category) => category.parentId === parentId);

const VISIT_LINKS = [
  { to: "/visit", label: "Visit the shop" },
  { to: "/fish", label: "Tropical fish" },
  { to: "/rentals", label: "Rentals" },
  { to: "/story", label: "Our story" },
] as const;

export function DesktopAnimalNav({ pathname }: { pathname: string }) {
  const active = pathname.startsWith("/collection") || pathname === "/shop";
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft outline-none transition-colors duration-quick hover:text-ticket",
          active && "text-ticket",
        )}
      >
        Available Animals
        <ChevronDown className="size-3.5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="center"
          sideOffset={10}
          className="z-50 min-w-56 border border-brass bg-card p-2 shadow-[6px_6px_0_0_var(--color-brass)]"
        >
          <DropdownMenu.Item asChild>
            <Link to="/collection" className="block px-3 py-2 font-ui text-kicker font-bold uppercase tracking-kicker text-ticket no-underline hover:bg-brass hover:text-ticket-ink">
              All available animals
            </Link>
          </DropdownMenu.Item>
          {ANIMAL_ROOT_CATEGORIES.map((root) => (
            <div key={root.id} className="mt-2 border-t border-border pt-2 first:mt-0 first:border-0 first:pt-0">
              <DropdownMenu.Item asChild>
                <Link to="/collection/$category" params={{ category: root.slug }} className="block px-3 py-2 font-ui text-kicker font-bold uppercase tracking-kicker text-brass no-underline hover:bg-brass hover:text-ticket-ink">
                  {root.name}
                </Link>
              </DropdownMenu.Item>
              {childCategories(root.id).map((child) => (
                <DropdownMenu.Item asChild key={child.id}>
                  <Link to="/collection/$category" params={{ category: child.slug }} className="block px-5 py-1.5 text-sm text-fg-soft no-underline hover:bg-brass hover:text-ticket-ink">
                    {child.name}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </div>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function DesktopVisitNav({ pathname }: { pathname: string }) {
  const active = VISIT_LINKS.some((item) => pathname.startsWith(item.to));
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft outline-none transition-colors duration-quick hover:text-ticket",
          active && "text-ticket",
        )}
      >
        Visit the shop
        <ChevronDown className="size-3.5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="center"
          sideOffset={10}
          className="z-50 min-w-56 border border-brass bg-card p-2 shadow-[6px_6px_0_0_var(--color-brass)]"
        >
          {VISIT_LINKS.map((item) => (
            <DropdownMenu.Item asChild key={item.to}>
              <Link
                to={item.to}
                className="block px-3 py-2 font-ui text-kicker font-bold uppercase tracking-kicker text-ticket no-underline hover:bg-brass hover:text-ticket-ink"
              >
                {item.label}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MobileAnimalNav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="border-y border-border py-4">
      <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">Available Animals</p>
      <div className="mt-2 grid gap-1">
        <Link to="/collection" onClick={onNavigate} className="flex min-h-11 items-center font-display text-2xl italic text-ticket no-underline">
          All available animals
        </Link>
        {ANIMAL_ROOT_CATEGORIES.map((root) => (
          <div key={root.id} className="mt-2">
            <Link to="/collection/$category" params={{ category: root.slug }} onClick={onNavigate} className="flex min-h-11 items-center font-display text-2xl italic text-ticket no-underline">
              {root.name}
            </Link>
            <div className="ml-4 grid border-l border-brass pl-3">
              {childCategories(root.id).map((child) => (
                <Link key={child.id} to="/collection/$category" params={{ category: child.slug }} onClick={onNavigate} className="flex min-h-10 items-center text-sm text-fg-soft no-underline">
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
