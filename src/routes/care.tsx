import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { CATEGORIES, SPECIES, filterSpecies, speciesById } from "@/lib/species";
import { essentialsFor } from "@/lib/essentials";
import { Button } from "@/components/ui/button";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Kicker, Display, Lede } from "@/components/type";
import { cn } from "@/lib/utils";
import { getSquareCatalog } from "@/lib/square-api";
import { formatMoney, productByName, productImage, type SquareProduct } from "@/lib/square";

type CareSearch = { id?: string };

export const Route = createFileRoute("/care")({
  validateSearch: (search: Record<string, unknown>): CareSearch => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  loader: () => getSquareCatalog(),
  component: CarePage,
  head: ({ match }) => {
    const id = (match.search as { id?: string }).id;
    const species = speciesById(id);
    if (species) {
      return pageHead({
        title: `${species.name} care sheet — Harris in Wonderland`,
        description: `Husbandry notes for ${species.name} (${species.latin}) at Harris in Wonderland in Canton, CT.`,
        path: `/care?id=${species.id}`,
      });
    }
    return pageHead({
      title: "Care sheets — Harris in Wonderland",
      description:
        "Husbandry notes for the animals Harris in Wonderland actually sells. The sheet matches the animal on the rack.",
      path: "/care",
    });
  },
});

function CarePage() {
  const { id } = Route.useSearch();
  const catalog = Route.useLoaderData();
  const selected = speciesById(id) ?? SPECIES[0];
  const related = filterSpecies(selected.category).filter((s) => s.id !== selected.id);

  return (
    <SiteShell>
    <main>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="wrap">
          <Kicker>Husbandry</Kicker>
          <Display as="h1" className="mt-2 text-display">
            The sheet matches the animal on the rack.
          </Display>
          <Lede className="mt-5">
            Harris does not publish a generic PDF. These notes get you to the right
            questions. Ask at the counter for the sheet that goes with the animal you are
            taking home.
          </Lede>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="wrap">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <Link
                key={cat.id}
                to="/care"
                search={{
                  id:
                    cat.id === "beginner"
                      ? SPECIES.find((s) => s.beginner)?.id
                      : SPECIES.find((s) => s.category === cat.id)?.id,
                }}
                className={cn(
                  "flex h-11 shrink-0 items-center border px-4 font-ui text-kicker font-bold uppercase tracking-kicker no-underline",
                  (cat.id === "beginner" && selected.beginner) ||
                    cat.id === selected.category
                    ? "border-brass bg-brass text-ticket-ink"
                    : "border-border bg-card text-fg-soft",
                )}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <article className="grid gap-6 border border-border bg-card lg:grid-cols-[1.05fr_0.95fr]">
            <SpecimenPhoto
              src={selected.image}
              alt={selected.alt}
              caption={selected.floor ? `${selected.name} · on the floor` : selected.name}
              className="aspect-[4/3] lg:aspect-auto lg:min-h-[28rem]"
              eager
            />
            <div className="p-5 sm:p-8">
              <Kicker>
                {selected.category}
                {selected.beginner ? " · first animal" : ""}
              </Kicker>
              <h2 className="mt-2 font-display text-section italic leading-none text-ticket">
                {selected.name}
              </h2>
              <p className="mt-2 font-display italic text-muted-foreground">{selected.latin}</p>
              <p className="mt-4 text-fg-soft">{selected.blurb}</p>
              <dl className="mt-6 grid gap-4">
                <Note label="Handling" body={selected.handling} />
                <Note label="Enclosure" body={selected.enclosure} />
                <Note label="Heat" body={selected.heat} />
                <Note label="Humidity" body={selected.humidity} />
                <Note label="Diet" body={selected.diet} />
              </dl>
              <p className="mt-6 border border-dashed border-brass/50 bg-secondary p-4 text-sm text-fg-soft">
                {selected.note}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <a href={SITE.phones.shop.href}>Call the shop</a>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/visit">Come in</Link>
                </Button>
              </div>
            </div>
          </article>

          <Essentials
            speciesId={selected.id}
            speciesName={selected.name}
            products={catalog.products}
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((species) => (
              <Link
                key={species.id}
                to="/care"
                search={{ id: species.id }}
                className="group flex gap-3 border border-border bg-background p-2 no-underline hover:border-brass"
              >
                <SpecimenPhoto
                  src={species.image}
                  alt={species.alt}
                  className="size-24 shrink-0"
                />
                <div className="py-1 pr-2">
                  <Kicker>{species.category}</Kicker>
                  <p className="font-display text-xl italic text-ticket">{species.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
    </SiteShell>
  );
}

function Essentials({
  speciesId,
  speciesName,
  products,
}: {
  speciesId: string;
  speciesName: string;
  products: SquareProduct[];
}) {
  const items = essentialsFor(speciesId);
  if (!items.length) return null;

  return (
    <section className="mt-6 border border-border bg-card p-5 sm:p-8">
      <Kicker>Essentials</Kicker>
      <h3 className="mt-2 font-display text-section italic text-ticket">
        What goes home with a {speciesName.toLowerCase()}.
      </h3>
      <p className="mt-3 max-w-2xl text-sm text-fg-soft">
        Setup SKUs from the Canton Square rack — not a generic kit. Pickup at 364 Albany
        Turnpike.
      </p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const product = productByName(products, item.product);
          const inner = (
            <>
              <div className="relative size-20 shrink-0 overflow-hidden bg-surface">
                {product ? (
                  <img
                    src={productImage(product)}
                    alt=""
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 py-1 pr-2">
                <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">
                  {item.label}
                </p>
                <p className="mt-1 truncate font-display text-lg italic text-ticket">
                  {product?.name ?? item.product}
                </p>
                <p className="mt-1 font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground">
                  {product ? formatMoney(product.priceLow) : "Ask the shop"}
                </p>
              </div>
            </>
          );

          return (
            <li key={item.label}>
              {product ? (
                <Link
                  to="/shop"
                  search={{ item: product.id }}
                  className="flex gap-3 border border-border bg-background p-2 no-underline transition-colors hover:border-brass"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex gap-3 border border-border bg-background p-2">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Note({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <dt className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-fg-soft">{body}</dd>
    </div>
  );
}
