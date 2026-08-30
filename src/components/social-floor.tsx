import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Display, Kicker, Lede } from "@/components/type";

const INSTAGRAM_EMBED = "https://www.instagram.com/harris_in_wonderland_pets/embed/";

export function SocialFloor() {
  return (
    <section id="floor-notes" className="border-y border-border bg-bg-2 py-16 sm:py-24">
      <div className="wrap min-w-0">
        <Kicker>Floor notes</Kicker>
        <Display className="mt-2">What they posted this week.</Display>
        <Lede className="mt-4 max-w-2xl">
          Live from the shop Instagram — arrivals, sales, and the animals on the rack.
          Facebook is one tap through; Safari will not load their plugin.
        </Lede>
        <div className="mt-10 grid min-w-0 gap-3 lg:grid-cols-2">
          <article className="flex min-w-0 flex-col overflow-hidden border border-border bg-card">
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <Kicker>Instagram</Kicker>
              <a
                href={SITE.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 truncate font-ui text-kicker font-bold uppercase tracking-kicker text-brass no-underline hover:text-ember-2"
              >
                <span className="sm:hidden">Open</span>
                <span className="hidden sm:inline">@harris_in_wonderland_pets</span>
              </a>
            </div>
            <div
              className="relative min-h-[28rem] overflow-hidden bg-white sm:min-h-[36rem] lg:min-h-[42rem]"
              style={{ colorScheme: "light" }}
            >
              <div className="absolute inset-0 flex flex-col items-start justify-end gap-3 bg-card p-5">
                <h3 className="font-display text-2xl italic text-ticket">Instagram</h3>
                <p className="text-sm text-muted-foreground">
                  Arrivals and the animals they just unboxed.
                </p>
                <Button asChild variant="ghost">
                  <a href={SITE.links.instagram} target="_blank" rel="noopener noreferrer">
                    Open Instagram
                    <ArrowRight />
                  </a>
                </Button>
              </div>
              <iframe
                title="Harris in Wonderland on Instagram"
                src={INSTAGRAM_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                className="absolute inset-0 z-10 h-full w-full max-w-full border-0 bg-white"
              />
            </div>
          </article>

          <article className="flex min-w-0 flex-col overflow-hidden border border-border bg-card">
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <Kicker>Facebook</Kicker>
              <a
                href={SITE.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 truncate font-ui text-kicker font-bold uppercase tracking-kicker text-brass no-underline hover:text-ember-2"
              >
                Open the page
              </a>
            </div>
            <SpecimenPhoto
              src="/images/case-lizards.jpg"
              alt="Animals on the floor at Harris in Wonderland"
              caption="Canton · live notes"
              className="aspect-[16/10] lg:aspect-[5/3]"
            />
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="font-display text-2xl italic text-ticket sm:text-3xl">
                Harris in Wonderland Pets
              </h3>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Same-day arrivals, weekend hours, parties, and the animals they just
                unboxed. Facebook will not let us embed the timeline on a phone — the
                page itself is current.
              </p>
              <p className="mt-3 text-sm text-fg-soft">
                {SITE.address.line}
                <span className="text-brass"> · </span>
                {SITE.phones.shop.display}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <a href={SITE.links.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook timeline
                    <ArrowRight />
                  </a>
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
