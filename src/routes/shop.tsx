import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { ShopFloor } from "@/components/shop-floor";
import { getSquareCatalog } from "@/lib/square-api";

type ShopSearch = { item?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    item: typeof search.item === "string" ? search.item : undefined,
  }),
  loader: () => getSquareCatalog(),
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop the rack — Harris in Wonderland" },
      {
        name: "description",
        content:
          "Live Square inventory from Harris in Wonderland in Canton, CT. Snakes, lizards, feeders, and husbandry — pickup at 364 Albany Turnpike.",
      },
    ],
  }),
});

function ShopPage() {
  const catalog = Route.useLoaderData();
  const { item } = Route.useSearch();
  return (
    <SiteShell>
      <main className="pt-6">
        <ShopFloor catalog={catalog} headingAs="h1" focusId={item} />
      </main>
    </SiteShell>
  );
}
