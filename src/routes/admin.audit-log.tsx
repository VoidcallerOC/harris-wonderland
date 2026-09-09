import { createFileRoute } from "@tanstack/react-router";
import { getAdminDashboard, listAuditLog } from "@/lib/auth/rbac";
import { requireAdminRoute } from "@/lib/auth/admin-route";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/admin/audit-log")({
  loader: () => requireAdminRoute(async () => ({ access: await getAdminDashboard(), entries: await listAuditLog() })),
  component: AuditLogPage,
});

function AuditLogPage() {
  const { access, entries } = Route.useLoaderData();
  return <SiteShell><AdminPanel access={access} title="Audit log." description="Sensitive role, hold, payment, and system actions are recorded here. This view is read-only; ordinary Staff cannot access it.">
    <div className="overflow-x-auto border border-border"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-card font-ui text-kicker uppercase tracking-kicker text-brass"><tr><th className="p-3">Time</th><th className="p-3">Action</th><th className="p-3">Resource</th><th className="p-3">Actor</th></tr></thead><tbody>{entries.map((entry) => <tr key={entry.id} className="border-b border-border last:border-0"><td className="p-3 text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</td><td className="p-3">{entry.action}</td><td className="p-3">{entry.resourceType}{entry.resourceId ? ` · ${entry.resourceId}` : ""}</td><td className="p-3 text-muted-foreground">{entry.actorUserId}</td></tr>)}</tbody></table>{!entries.length ? <p className="p-6 text-muted-foreground">No audit entries yet.</p> : null}</div>
  </AdminPanel></SiteShell>;
}
