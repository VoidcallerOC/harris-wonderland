import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { ShopFloor } from "@/components/shop-floor";
import { getSquareCatalog } from "@/lib/square-api";

export const Route = createFileRoute("/shop")({
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
  return (
    <SiteShell>
      <main className="pt-6">
        <ShopFloor catalog={catalog} headingAs="h1" />
      </main>
    </SiteShell>
  );
}
