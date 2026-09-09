import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAdminDashboard } from "@/lib/auth/rbac";
import { AdminPanel, Can } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    try {
      return await getAdminDashboard();
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        throw redirect({ to: "/login" });
      }
      throw error;
    }
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const access = Route.useLoaderData();
  return (
    <SiteShell>
      <AdminPanel access={access} title="Administration." description="Business operations are separated from technical controls by server-enforced permissions. Your role determines the actions and information available here.">
        <div className="grid gap-4 md:grid-cols-2">
          <Can access={access} permission="holds.view"><a href="/admin/holds" className="border border-border bg-card p-5 no-underline hover:border-brass"><strong className="font-display text-card italic text-ticket">Holds</strong><p className="mt-2 text-sm text-muted-foreground">Review requests and manage authorized lifecycle changes.</p></a></Can>
          <Can access={access} permission="animals.view"><a href="/admin/animals" className="border border-border bg-card p-5 no-underline hover:border-brass"><strong className="font-display text-card italic text-ticket">Animals</strong><p className="mt-2 text-sm text-muted-foreground">Review inventory and availability controls.</p></a></Can>
          <Can access={access} permission="payments.view"><a href="/admin/payments" className="border border-border bg-card p-5 no-underline hover:border-brass"><strong className="font-display text-card italic text-ticket">Payments</strong><p className="mt-2 text-sm text-muted-foreground">View only the payment information allowed by your role.</p></a></Can>
          <Can access={access} permission="system.logs"><a href="/admin/audit-log" className="border border-border bg-card p-5 no-underline hover:border-brass"><strong className="font-display text-card italic text-ticket">Audit log</strong><p className="mt-2 text-sm text-muted-foreground">Review append-only sensitive-action records.</p></a></Can>
        </div>
      </AdminPanel>
    </SiteShell>
  );
}
