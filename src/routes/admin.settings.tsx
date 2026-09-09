import { createFileRoute } from "@tanstack/react-router";
import { getAdminDashboard } from "@/lib/auth/rbac";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/admin/settings")({ loader: () => getAdminDashboard(), component: AdminSettingsPage });
function AdminSettingsPage() { const access = Route.useLoaderData(); return <SiteShell><AdminPanel access={access} title="System settings." description="Technical controls are permission-gated separately from business and financial authority. Secrets and deployment operations are never exposed to business-only roles." /></SiteShell>; }
