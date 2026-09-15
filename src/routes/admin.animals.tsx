import { createFileRoute } from "@tanstack/react-router";
import { getAdminDashboard } from "@/lib/auth/rbac";
import { requireAdminRoute } from "@/lib/auth/admin-route";
import { getSquareCatalog } from "@/lib/square-api";
import { displayCategoryName, isAnimal } from "@/lib/square";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/admin/animals")({
  loader: () => requireAdminRoute(async () => ({ access: await getAdminDashboard(), catalog: await getSquareCatalog() })),
  component: AdminAnimalsPage,
});

function AdminAnimalsPage() {
  const { access, catalog } = Route.useLoaderData();
  const animals = catalog.products.filter(isAnimal);
  return <SiteShell><AdminPanel access={access} title="Animals." description="Square remains the authoritative catalog and inventory system. This view exposes the live animal records without creating a parallel Harris data model; catalog edits continue in Square until a write integration is intentionally added.">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-border bg-card p-4 text-sm text-muted-foreground">
      <p><strong className="text-ticket">{animals.length}</strong> animal records · {catalog.live ? "Live Square catalog" : "Bundled catalog fallback"}</p>
      <p>Fetched {new Date(catalog.fetchedAt).toLocaleString()}</p>
    </div>
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[48rem] text-left text-sm">
        <thead className="border-b border-border bg-card font-ui text-kicker uppercase tracking-kicker text-brass"><tr><th className="p-3">Animal</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3">Source</th></tr></thead>
        <tbody>{animals.map((animal) => {
          const price = animal.priceLow == null ? "—" : animal.priceHigh != null && animal.priceHigh !== animal.priceLow ? `$${animal.priceLow.toFixed(2)}–$${animal.priceHigh.toFixed(2)}` : `$${animal.priceLow.toFixed(2)}`;
          return <tr key={animal.id} className="border-b border-border last:border-0">
            <td className="p-3"><div className="flex items-center gap-3">{animal.image ? <img src={animal.image} alt="" className="h-12 w-12 object-cover" /> : <span className="h-12 w-12 bg-ticket/10" />}<div><p className="font-semibold text-ticket">{animal.name}</p><p className="text-xs text-muted-foreground">{animal.id}</p></div></div></td>
            <td className="p-3 text-muted-foreground">{animal.categories.length ? animal.categories.map(displayCategoryName).join(", ") : "Uncategorized"}</td>
            <td className="p-3">{price}</td>
            <td className="p-3">{animal.stock == null ? "—" : animal.stock}</td>
            <td className="p-3"><span className={animal.soldOut ? "text-ember-2" : "text-brass"}>{animal.soldOut ? "Sold out" : "Available"}</span></td>
            <td className="p-3"><a href={animal.url} target="_blank" rel="noreferrer" className="text-brass underline">Square listing</a></td>
          </tr>;
        })}</tbody>
      </table>
      {!animals.length ? <p className="p-6 text-muted-foreground">No animal records were returned by the catalog.</p> : null}
    </div>
  </AdminPanel></SiteShell>;
}
