import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { ArrowRight, Phone } from "lucide-react";
import { SITE, KEEPERS, TIMELINE } from "@/lib/site";
import { SPECIES } from "@/lib/species";
import { Button } from "@/components/ui/button";
import { BeginnerChooser } from "@/components/chooser";
import { HoursTicket } from "@/components/hours-ticket";
import { SpeciesMarquee } from "@/components/marquee";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { ShopFloor } from "@/components/shop-floor";
import { getSquareCatalog } from "@/lib/square-api";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/")({
  loader: () => getSquareCatalog(),
  component: Home,
});

const CASES = [
  SPECIES.find((s) => s.id === "ball-python")!,
  SPECIES.find((s) => s.id === "frilled-lizard")!,
  SPECIES.find((s) => s.id === "red-eyed")!,
];

function Home() {
  const catalog = Route.useLoaderData();

  return (
    <SiteShell>
    <main>
      <section className="relative min-h-[100svh] overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Giant day gecko at Harris in Wonderland, 364 Albany Turnpike, Canton CT"
          width={1600}
          height={1200}
          className="hero-ken absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,10,9,0.28)_0%,rgba(11,10,9,0.55)_42%,rgba(11,10,9,0.92)_100%)]" />
        <div className="relative wrap flex min-h-[100svh] flex-col justify-end gap-8 pb-16 pt-28">
          <div className="max-w-3xl">
            <Kicker>Connecticut reptile specialty shop</Kicker>
            <h1 className="mt-3 font-display text-display font-semibold italic leading-[0.88] tracking-display text-ticket">
              Harris
              <br />
              in <em className="text-brass">Wonderland</em>
            </h1>
            <p className="mt-4 font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft">
              Snakes, lizards, frogs · Canton, Connecticut
            </p>
            <Lede className="mt-5">
              Not a pet aisle. A working herp collection — snakes, lizards, frogs, and
              feeders — run by people who breed the animals and will talk you out of the
              wrong one.
            </Lede>
            <div className="mt-7 flex max-w-full flex-wrap gap-3">
              <Button asChild>
                <a href="#rack">
                  <span className="sm:hidden">Shop the rack</span>
                  <span className="hidden sm:inline">Shop the live rack</span>
                  <ArrowRight className="hidden sm:block" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/visit">Visit the shop</Link>
              </Button>
              <Button asChild variant="ghost">
                <a href={SITE.links.feeders} target="_blank" rel="noopener noreferrer">
                  Feeder cart
                </a>
              </Button>
            </div>
          </div>
          <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-ticket/80">
            Giant day gecko · looking glass · Route 44
          </p>
        </div>
      </section>

      <SpeciesMarquee />

      <section className="py-16 sm:py-24">
        <div className="wrap grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Kicker>Exhibits</Kicker>
            <Display className="mt-2">Cases on the floor.</Display>
            <Lede className="mt-4">
              Walk-ins call it a small-scale zoo. Morphs you will not find at a chain,
              feeders priced for people who actually feed, staff who shrink a ticket if
              the setup is not ready.
            </Lede>
          </div>
          <HoursTicket />
        </div>
        <div className="wrap mt-10 grid gap-3 md:grid-cols-3">
          {CASES.map((species, index) => (
            <Link
              key={species.id}
              to="/care"
              search={{ id: species.id }}
              className="group block border border-border bg-card no-underline transition-[border-color,box-shadow] duration-fast ease-out-smooth hover:border-brass hover:shadow-[8px_8px_0_0_color-mix(in_oklab,var(--color-brass)_40%,transparent)]"
            >
              <SpecimenPhoto
                src={species.image}
                alt={species.alt}
                caption={species.name}
                className="aspect-[4/3]"
                eager={index === 0}
              />
              <div className="p-4">
                <Kicker>Case 0{index + 1}</Kicker>
                <h3 className="mt-1 font-display text-card italic text-ticket">
                  {index === 0 ? "Snakes" : index === 1 ? "Lizards & shells" : "Amphibians"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{species.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="wrap mt-6">
          <Button asChild variant="ghost">
            <Link to="/collection">
              Walk the whole collection
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <ShopFloor catalog={catalog} />

      <section className="py-16 sm:py-24">
        <div className="wrap">
          <Kicker>Beginner chooser</Kicker>
          <Display className="mt-2">The right first animal.</Display>
          <Lede className="mt-4 mb-8">
            Harris has always steered first-timers toward hardy species. Corn or king. Leo
            or beardie. Red-foot. White’s. Ask at the counter before you fall for the
            showy one.
          </Lede>
          <BeginnerChooser />
        </div>
      </section>

      <section className="border-y border-border bg-bg-2 py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div>
            <Kicker>House rules</Kicker>
            <Display className="mt-2">Husbandry first.</Display>
            <div className="mt-5 space-y-4 text-fg-soft">
              <p>
                Adam Harris has kept and bred reptiles for more than twenty years, with
                field time in Costa Rica, Thailand, Australia, South Africa, and the
                Bahamas. Seth built the original shop as a fish-keeper and taught
                high-school biology for 31 years.
              </p>
              <p>
                Many animals are captive-bred here or by local people the shop will stand
                behind. Frozen rodents, crickets, and roaches are why regulars drive even
                when they are not adding a new animal. Ask for the care sheet that matches
                the animal on the rack.
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            <article className="border border-border bg-card p-5">
              <h3 className="font-display text-card italic text-ticket">Honest setups</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enclosures, heat, UV, substrate, plants, food. They size the tub before
                they size the receipt.
              </p>
            </article>
            <article className="border border-border bg-card p-5">
              <h3 className="font-display text-card italic text-ticket">Rare on the wall</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Reviewers mention animals they have never seen at a chain — morphs, odd
                colubrids, well-kept giants.
              </p>
            </article>
            <article className="border border-border bg-card p-5">
              <h3 className="font-display text-card italic text-ticket">
                Parties that handle animals
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Birthday programs and education visits. Book ahead. These fill.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <Kicker>The Harris story</Kicker>
            <Display className="mt-2">From a house of tanks to Route 44.</Display>
            <ol className="mt-8 border-l-2 border-brass pl-5">
              {TIMELINE.map((item) => (
                <li key={item.when} className="pb-6">
                  <Kicker>{item.when}</Kicker>
                  <h3 className="mt-1 font-display text-xl italic text-ticket">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ol>
            <Button asChild variant="ghost" className="mt-2">
              <Link to="/story">
                Read the keepers
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div>
            <Kicker>Keepers</Kicker>
            <Display className="mt-2">Biology, not scripts.</Display>
            <div className="mt-8 grid gap-3">
              {KEEPERS.map((person) => (
                <article key={person.name} className="border border-border bg-card p-5">
                  <Kicker>{person.role}</Kicker>
                  <h3 className="mt-1 font-display text-card italic text-ticket">
                    {person.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{person.bio}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-brass bg-surface py-14">
        <div className="wrap flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Kicker>364 Albany Turnpike</Kicker>
            <Display as="p" className="mt-2 text-3xl">
              Buy here. Pick up through the snake-handle door.
            </Display>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={SITE.phones.shop.href}>
                <Phone />
                {SITE.phones.shop.display}
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/visit">Hours & map</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
    </SiteShell>
  );
}