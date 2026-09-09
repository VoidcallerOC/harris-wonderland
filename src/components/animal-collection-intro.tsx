import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Kicker, Display, Lede } from "@/components/type";

export function AnimalCollectionIntro() {
  return (
    <section className="border-b border-border py-14 sm:py-20">
      <div className="wrap">
        <Kicker>Available animals</Kicker>
        <Display as="h1" className="mt-2 text-display">
          Find the right animal for your setup.
        </Display>
        <Lede className="mt-5">
          Reptiles, mammals, birds, and tropical fish are organized by family below. The live shop page remains connected to Square for current inventory, pricing, pickup, and checkout.
        </Lede>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/shop">Shop current inventory</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/" hash="feeders">
              Shop feeders
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function AnimalCollectionContact() {
  return (
    <section className="border-t border-border bg-bg-2 py-16">
      <div className="wrap grid gap-8 lg:grid-cols-2">
        <div>
          <Kicker>How to buy here</Kicker>
          <Display className="mt-2">The right animal, not the biggest sale.</Display>
          <p className="mt-4 max-w-[46ch] text-fg-soft">
            If the enclosure or the feeder size is wrong we will say so, and sell you the setup first. Bring photos of what you have. If you do not have one yet, start with the box and the heat.
          </p>
        </div>
        <div className="border border-border bg-card p-6">
          <h2 className="font-display text-card italic text-ticket">Ask on the phone</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Species or morph · sex and age · same-day enclosure · feeder size · a hold. If it is for a birthday program, say that first.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href={SITE.phones.shop.href}>{SITE.phones.shop.display}</a>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/visit">Visit the shop</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
