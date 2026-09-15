import { createFileRoute } from "@tanstack/react-router";
import { getAdminDashboard, listAdminPayments } from "@/lib/auth/rbac";
import { requireAdminRoute } from "@/lib/auth/admin-route";
import { listSugarGliderHolds } from "@/lib/sugar-glider-holds";
import { getSquareCatalog } from "@/lib/square-api";
import { isAnimal, isFeeder } from "@/lib/square";
import { AdminPanel, Can } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/admin/")({
  loader: () => requireAdminRoute(async () => {
    const access = await getAdminDashboard();
    const [catalog, holds, payments] = await Promise.all([
      getSquareCatalog(),
      access.permissions.includes("holds.view") ? listSugarGliderHolds() : Promise.resolve([]),
      access.permissions.includes("payments.view") ? listAdminPayments() : Promise.resolve([]),
    ]);
    return { access, catalog, holds, payments };
  }),
  component: AdminDashboardPage,
});

function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return <article className="border border-border bg-card p-5"><p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">{label}</p><p className="mt-2 font-display text-4xl italic text-ticket">{value}</p><p className="mt-2 text-sm text-muted-foreground">{detail}</p></article>;
}

function AdminDashboardPage() {
  const { access, catalog, holds, payments } = Route.useLoaderData();
  const animals = catalog.products.filter(isAnimal);
  const feeders = catalog.products.filter(isFeeder);
  const available = catalog.products.filter((product) => !product.soldOut);
  const activeHolds = holds.filter((hold) => !["cancelled", "expired", "completed"].includes(hold.status));
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  return (
    <SiteShell>
      <AdminPanel access={access} title="Administration." description="Business operations are separated from technical controls by server-enforced permissions. The figures below come from Harris's live catalog and operational records; no demo metrics are manufactured.">
        <section aria-label="Inventory overview" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Catalog products" value={catalog.products.length} detail={`${catalog.categories.length} Square categories`} />
          <Metric label="Available now" value={available.length} detail={`${catalog.products.length - available.length} marked sold out`} />
          <Metric label="Animals" value={animals.length} detail="Catalog items classified as animal inventory" />
          <Metric label="Feeders" value={feeders.length} detail="Catalog items classified as feeder inventory" />
        </section>
        <section aria-label="Operations overview" className="mt-10 border-t border-border pt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">Operations</p>
              <h2 className="mt-1 font-display text-2xl italic text-ticket">Today at a glance.</h2>
            </div>
            <p className="hidden text-sm text-muted-foreground sm:block">Live records and catalog health</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Can access={access} permission="holds.view"><Metric label="Active holds" value={activeHolds.length} detail={`${holds.length} total hold records`} /></Can>
          <Can access={access} permission="payments.view"><Metric label="Payment attempts" value={payments.length} detail={`${pendingPayments.length} currently pending`} /></Can>
          <Metric label="Catalog source" value={catalog.live ? "Live" : "Fallback"} detail={`Fetched ${new Date(catalog.fetchedAt).toLocaleString()}`} />
          </div>
        </section>
        <section aria-label="Admin navigation" className="mt-10 border-t border-border pt-8">
          <div className="mb-4">
            <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">Work areas</p>
            <h2 className="mt-1 font-display text-2xl italic text-ticket">Choose a section.</h2>
          </div>
          <div className="grid items-stretch gap-4 md:grid-cols-2">
            <Can access={access} permission="holds.view"><a href="/admin/holds" className="flex min-h-32 flex-col border border-border bg-card p-5 no-underline transition-colors hover:border-brass"><strong className="font-display text-card italic text-ticket">Holds</strong><p className="mt-2 text-sm text-muted-foreground">Review requests and manage authorized lifecycle changes.</p></a></Can>
            <Can access={access} permission="animals.view"><a href="/admin/animals" className="flex min-h-32 flex-col border border-border bg-card p-5 no-underline transition-colors hover:border-brass"><strong className="font-display text-card italic text-ticket">Animals</strong><p className="mt-2 text-sm text-muted-foreground">Review the current Square catalog, availability, pricing, and images.</p></a></Can>
            <Can access={access} permission="payments.view"><a href="/admin/payments" className="flex min-h-32 flex-col border border-border bg-card p-5 no-underline transition-colors hover:border-brass"><strong className="font-display text-card italic text-ticket">Payments</strong><p className="mt-2 text-sm text-muted-foreground">View only the payment information allowed by your role.</p></a></Can>
            <Can access={access} permission="system.logs"><a href="/admin/audit-log" className="flex min-h-32 flex-col border border-border bg-card p-5 no-underline transition-colors hover:border-brass"><strong className="font-display text-card italic text-ticket">Audit log</strong><p className="mt-2 text-sm text-muted-foreground">Review append-only sensitive-action records.</p></a></Can>
          </div>
        </section>
      </AdminPanel>
    </SiteShell>
  );
}
