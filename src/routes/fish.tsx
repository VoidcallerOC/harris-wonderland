import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/fish")({
  component: FishPage,
  head: () =>
    pageHead({
      title: "Fish room & ponds — Harris in Wonderland",
      description:
        "Freshwater and marine tanks, a dedicated reef room, limited garden-pond installs, and sugar gliders when they have them. Harris in Wonderland, Canton CT.",
      path: "/fish",
    }),
});

const ROOMS = [
  {
    title: "Freshwater",
    body: "Livebearers — guppies, platies, swordtails — plus African cichlids, discus, angelfish, knife fish, goldfish and koi. Community fish and the unglamorous livestock that keeps a tank stable. Ask us to order in something specific.",
  },
  {
    title: "Marine & coral",
    body: "A dedicated reef room: marine fish, mushroom and leather corals, star polyps, shrimp, crabs, snails, salt, supplements, and food. Call for a named coral. Livestock rotates — the tanks are the list.",
  },
  {
    title: "Ponds",
    body: "Limited garden-pond installs each year. Streams, waterfalls, bogs, fountains, lights. We stock it with fish and plants and stay with you on size, placement, wildlife, and maintenance. Free estimate.",
  },
];

const SIDE = [
  {
    title: "Sugar gliders",
    body: "Marsupials, not flying squirrels, and ten to twelve years with good care. Cage, nest, and diet sorted before one goes home. We stock a complete glider diet.",
  },
  {
    title: "Other mammals",
    body: "Rotating, when we have them. Call ahead for anything specific.",
  },
  {
    title: "Birds",
    body: "We can order birds, but we no longer keep them on the floor. Call before you drive out for a specific bird.",
  },
];

function FishPage() {
  return (
    <SiteShell>
    <main>
      <section className="relative min-h-[52svh] overflow-hidden">
        <SpecimenPhoto
          src="/images/fish-room.jpg"
          alt="Planted freshwater aquarium"
          className="absolute inset-0 h-full w-full"
          imgClassName="scale-105"
          eager
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,10,9,0.2)_0%,rgba(11,10,9,0.88)_100%)]" />
        <div className="relative wrap flex min-h-[52svh] flex-col justify-end pb-12 pt-24">
          <Kicker>Freshwater · marine · ponds</Kicker>
          <Display as="h1" className="mt-2 text-display">
            Fish room
          </Display>
          <Lede className="mt-4">
            Harris started as a fish house. Canton still runs freshwater and a dedicated
            marine room, a limited number of pond installs, and sugar gliders when we have
            them.
          </Lede>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap grid gap-3 lg:grid-cols-3">
          {ROOMS.map((room) => (
            <article key={room.title} className="border border-border bg-card p-5">
              <h2 className="font-display text-card italic text-ticket">{room.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{room.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-bg-2 py-16 sm:py-20">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Kicker>Garden ponds</Kicker>
            <Display className="mt-2">A limited number each year.</Display>
            <p className="mt-4 max-w-[46ch] text-fg-soft">
              Done properly, a koi or goldfish pond is an ecosystem, not a hole with a
              pump. We will talk through size, placement, construction, wildlife, and
              maintenance, then stock it. Call for a free estimate on the property.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={SITE.phones.shop.href}>Ask for a pond estimate</a>
              </Button>
              <Button asChild variant="ghost">
                <a href={`mailto:${SITE.emails.seth}`}>Write Seth</a>
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            {SIDE.map((item) => (
              <article key={item.title} className="border border-border bg-card p-5">
                <h2 className="font-display text-card italic text-ticket">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap flex flex-wrap gap-3">
          <Button asChild>
            <a href={SITE.phones.shop.href}>Ask about the systems</a>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/collection">Back to the herps</Link>
          </Button>
        </div>
      </section>
    </main>
    </SiteShell>
  );
}
