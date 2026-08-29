import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SITE, KEEPERS, TIMELINE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/story")({
  component: StoryPage,
  head: () => ({
    meta: [
      { title: "The Harris story — Harris in Wonderland" },
      {
        name: "description",
        content:
          "From a house of tanks in West Hartford to the snake-handle door on Route 44. Seth, Adam, and Ashlee.",
      },
    ],
  }),
});

function StoryPage() {
  return (
    <SiteShell>
    <main>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="wrap grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Kicker>The Harris story</Kicker>
            <Display as="h1" className="mt-2 text-display">
              From a house of tanks to Route 44.
            </Display>
            <Lede className="mt-5">
              Biology, not scripts. A fish-keeper who taught high-school science, a
              herpetologist with field time on four continents, and the person who will
              tell you the showy animal is the wrong one.
            </Lede>
          </div>
          <SpecimenPhoto
            src="/images/hero.jpg"
            alt="Giant day gecko at Harris in Wonderland"
            caption="Looking glass · Canton"
            className="aspect-[4/3]"
            eager
          />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <ol className="border-l-2 border-brass pl-5">
            {TIMELINE.map((item) => (
              <li key={item.when} className="pb-8">
                <Kicker>{item.when}</Kicker>
                <h2 className="mt-2 font-display text-3xl italic text-ticket">{item.title}</h2>
                <p className="mt-2 max-w-[42ch] text-fg-soft">{item.body}</p>
              </li>
            ))}
          </ol>
          <div className="space-y-5 text-fg-soft">
            <p>
              The shop is first and foremost an exotic reptile and amphibian house. It
              still earns a place on any Connecticut fishkeeper’s map — freshwater,
              marine, ponds — but the front of the room is the herp collection.
            </p>
            <p>
              Dedicated parking, handicapped access, road frontage, and a facility built
              to hold live animals instead of a village storefront. The snake-handle door
              is the landmark. Come through it.
            </p>
            <p>
              Many animals are captive-bred here or by local people the shop will stand
              behind. Frozen rodents, crickets, and roaches are why regulars drive even
              when they are not adding a new animal.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-bg-2 py-16 sm:py-24">
        <div className="wrap">
          <Kicker>Keepers</Kicker>
          <Display className="mt-2">Ask for them by name.</Display>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {KEEPERS.map((person) => (
              <article key={person.name} className="border border-border bg-card p-6">
                <Kicker>{person.role}</Kicker>
                <h2 className="mt-2 font-display text-3xl italic text-ticket">{person.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {person.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/visit">Visit the shop</Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={SITE.phones.shop.href}>{SITE.phones.shop.display}</a>
          </Button>
        </div>
      </section>
    </main>
    </SiteShell>
  );
}
