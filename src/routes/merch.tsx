import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/site-shell";
import { ArrowUpRight } from "lucide-react";
import { MERCH_CATEGORIES, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/merch")({
  component: MerchPage,
  head: () =>
    pageHead({
      title: "Merch — Harris in Wonderland",
      description:
        "Harris in Wonderland apparel, prints, and shop merch — coming soon. Pickup in Canton, CT, or ask Adam when the first drop lands.",
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
            Apparel, prints, and shop marks for the people who drive to Canton on purpose.
            Not for sale yet — email Adam when you want first word.
          </Lede>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="wrap">
          <div className="border border-brass bg-[color-mix(in_oklab,var(--color-ember)_10%,var(--color-card))] p-5 sm:p-6">
            <Kicker>Coming soon</Kicker>
            <p className="mt-2 max-w-2xl text-fg-soft">
              Merch is being stocked. The lineup below is what is coming — once it is live
              in the shop each piece becomes a buy link. Want the first drop?{" "}
              <a
                className="text-brass underline-offset-4 hover:underline"
                href={`mailto:${SITE.emails.adam}?subject=${encodeURIComponent("Harris in Wonderland merch")}`}
              >
                Email Adam
              </a>{" "}
              to hear when it lands.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {MERCH_CATEGORIES.map((item) => (
              <article key={item.title} className="flex flex-col border border-border bg-card p-5">
                <Kicker>{item.role}</Kicker>
                <h2 className="mt-1 font-display text-card italic text-ticket">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                <span className="mt-4 inline-flex w-fit border border-brass/50 px-2 py-1 font-ui text-[0.62rem] font-bold uppercase tracking-kicker text-brass">
                  {item.ships}
                </span>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 border border-border bg-card p-6 md:flex-row md:items-center">
            <p className="max-w-xl text-fg-soft">
              When merch is live it opens in the Square store, alongside the animals,
              feeders, and supplies.
            </p>
            <Button asChild>
              <a href={SITE.links.merch} target="_blank" rel="noopener noreferrer">
                Open the store
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
    </SiteShell>
  );
}
