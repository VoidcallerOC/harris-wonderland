import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-bg-2">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="flex items-center gap-3 font-display text-3xl italic text-ticket">
            <img
              src="/images/logo-192.png"
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-full ring-1 ring-brass/40"
            />
            Harris in Wonderland
          </p>
          <p className="mt-3 max-w-md text-muted-foreground">
            {SITE.address.line}
            <br />
            {SITE.landmark}
            <br />
            Shop{" "}
            <a className="text-fg-soft underline-offset-4 hover:text-brass" href={SITE.phones.shop.href}>
              {SITE.phones.shop.display}
            </a>
            {" · "}
            Booking{" "}
            <a className="text-fg-soft underline-offset-4 hover:text-brass" href={SITE.phones.booking.href}>
              {SITE.phones.booking.display}
            </a>
            <br />
            <a className="text-fg-soft underline-offset-4 hover:text-brass" href={`mailto:${SITE.emails.adam}`}>
              {SITE.emails.adam}
            </a>
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            © {year} Harris in Wonderland · Canton, Connecticut
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 content-start">
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/">
            Home
          </Link>
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/shop">
            Shop
          </Link>
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/collection">
            Collection
          </Link>
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/care">
            Care sheets
          </Link>
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/story">
            Story
          </Link>
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/visit">
            Visit
          </Link>
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/rentals">
            Rentals
          </Link>
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/merch">
            Merch
          </Link>
          <Link className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass" to="/fish">
            Fish room
          </Link>
          <Link
            className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass"
            to="/shop"
          >
            Live animals
          </Link>
          <Link
            className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass"
            to="/"
            hash="feeders"
          >
            Feeder locker
          </Link>
          <a
            className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass"
            href={SITE.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:text-brass"
            href={SITE.links.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
