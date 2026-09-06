import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/site-shell";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/merch")({
  component: MerchPage,
  head: () =>
    pageHead({
      title: "Merch — Harris in Wonderland",
      description:
        "Harris in Wonderland shop merch is not stocked yet. Email Adam to hear when the first run lands. Pickup in Canton, CT.",
      path: "/merch",
    }),
});

function MerchPage() {
  return (
    <SiteShell>
      <main>
        <section className="border-b border-border py-14 sm:py-20">
          <div className="wrap">
            <Kicker>Wear the shop</Kicker>
            <Display as="h1" className="mt-2 text-display">
              Merch
            </Display>
            <Lede className="mt-5">
              Not stocked yet. When there is something worth printing, it will be here and
              in the Square store — and you can be the first to know.
            </Lede>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="wrap grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-brass bg-[color-mix(in_oklab,var(--color-ember)_10%,var(--color-card))] p-6">
              <Kicker>First run</Kicker>
              <h2 className="mt-2 font-display text-section italic text-ticket">
                Tell Adam what you would buy.
              </h2>
              <p className="mt-3 max-w-2xl text-fg-soft">
                Shirts, hats, prints — nothing is printed yet, so the first run is still an
                open question. Email Adam and say what you want and in what size; that is
                what decides the order.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <a
                    href={`mailto:${SITE.emails.adam}?subject=${encodeURIComponent("Harris in Wonderland merch")}`}
                  >
                    Email Adam
                  </a>
                </Button>
              </div>
            </div>

            <div className="border border-border bg-card p-6">
              <Kicker>In the meantime</Kicker>
              <h2 className="mt-2 font-display text-card italic text-ticket">
                The store is open.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Animals, feeders, and husbandry supplies ring through the same Square store
                merch will land in. Pickup at 364 Albany Turnpike.
              </p>
              <div className="mt-5">
                <Button asChild variant="ghost">
                  <a href={SITE.links.merch} target="_blank" rel="noopener noreferrer">
                    Open the store
                    <ArrowUpRight />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
