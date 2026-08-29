import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { CATEGORIES, filterSpecies } from "@/lib/species";
import { Button } from "@/components/ui/button";
import { SpecimenCard } from "@/components/specimen-card";
import { Kicker, Display, Lede } from "@/components/type";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/collection")({
  component: CollectionPage,
  head: () => ({
    meta: [
      { title: "The collection — Harris in Wonderland" },
      {
        name: "description",
        content:
          "Snakes, lizards, tortoises, and amphibians at Harris in Wonderland in Canton, CT. Captive-bred stock, feeders, and care sheets.",
      },
    ],
  }),
});

function CollectionPage() {
  const [filter, setFilter] = useState("all");
  const list = filterSpecies(filter);

  return (
    <SiteShell>
    <main>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="wrap">
          <Kicker>Live collection</Kicker>
          <Display as="h1" className="mt-2 text-display">
            What is on the rack this week.
          </Display>
          <Lede className="mt-5">
            Ball pythons and designer morphs, corns, western hognose, milks and kings,
            beardies, geckos, red-foots, darts, pacmans. The named animal lives in Canton
            — this page is the map, not the inventory.
          </Lede>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <a href={SITE.links.collection} target="_blank" rel="noopener noreferrer">
                Available animals
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href={SITE.links.feeders} target="_blank" rel="noopener noreferrer">
                Feeder cart
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="wrap">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {CATEGORIES.map((cat) => {
              const active = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  className={cn(
                    "h-11 shrink-0 border px-4 font-ui text-kicker font-bold uppercase tracking-kicker transition-colors duration-quick",
                    active
                      ? "border-brass bg-brass text-ticket-ink"
                      : "border-border bg-card text-fg-soft hover:border-brass",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((species, index) => (
              <SpecimenCard key={species.id} species={species} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-2 py-16">
        <div className="wrap grid gap-8 lg:grid-cols-2">
          <div>
            <Kicker>How to buy here</Kicker>
            <Display className="mt-2">The right animal. Not the biggest ticket.</Display>
            <p className="mt-4 max-w-[46ch] text-fg-soft">
              Staff will shrink a purchase if the enclosure or the feeder size is wrong.
              Bring photos of your setup. If you do not have one, start with the box and
              the heat.
            </p>
          </div>
          <div className="border border-border bg-card p-6">
            <h2 className="font-display text-card italic text-ticket">Ask on the phone</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Species or morph · sex and age · same-day enclosure · feeder size · a hold.
              If it is for a birthday program, say that first.
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
    </main>
    </SiteShell>
  );
}
