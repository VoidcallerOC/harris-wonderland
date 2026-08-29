import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/fish")({
  component: FishPage,
  head: () => ({
    meta: [
      { title: "Fish room — Harris in Wonderland" },
      {
        name: "description",
        content:
          "The fish room at Harris in Wonderland in Canton, CT: freshwater and marine tanks, pond work, and sugar gliders when they have them.",
      },
    ],
  }),
});

const ROOMS = [
  {
    title: "Freshwater",
    body: "Community fish and the unglamorous livestock that keeps a tank stable.",
  },
  {
    title: "Marine & coral",
    body: "Saltwater, corals, inverts when the systems are holding them. Call for a named coral.",
  },
  {
    title: "Ponds",
    body: "Install, stock with fish and plants, stay on the line for maintenance.",
  },
  {
    title: "Sugar gliders",
    body: "Not an impulse pet. Diet, cage, and colony before money moves.",
  },
  {
    title: "Other mammals",
    body: "Rotating, when they have them. The center of gravity is still herps.",
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
          <Kicker>Secondary room</Kicker>
          <Display as="h1" className="mt-2 text-display">
            Fish room
          </Display>
          <Lede className="mt-4">
            Harris started as a fish house. Canton still runs freshwater and marine tanks,
            pond installs, and sugar gliders when they have them. The front of the shop is
            the herp collection.
          </Lede>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((room) => (
            <article key={room.title} className="border border-border bg-card p-5">
              <h2 className="font-display text-card italic text-ticket">{room.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{room.body}</p>
            </article>
          ))}
        </div>
        <div className="wrap mt-10 flex flex-wrap gap-3">
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
