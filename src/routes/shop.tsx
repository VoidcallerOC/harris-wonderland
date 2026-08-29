import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { ShopFloor } from "@/components/shop-floor";
import { getSquareCatalog } from "@/lib/square-api";

export const Route = createFileRoute("/shop")({
  loader: () => getSquareCatalog(),
  component: ShopPage,
});

function ShopPage() {
  const catalog = Route.useLoaderData();
  return (
    <SiteShell>
      <main className="pt-6">
        <ShopFloor catalog={catalog} />
      </main>
    </SiteShell>
  );
}