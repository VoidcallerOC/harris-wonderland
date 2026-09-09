import { createFileRoute } from "@tanstack/react-router";
import { getAdminDashboard } from "@/lib/auth/rbac";
import { requireAdminRoute } from "@/lib/auth/admin-route";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/admin/animals")({ loader: () => requireAdminRoute(() => getAdminDashboard()), component: AdminAnimalsPage });
function AdminAnimalsPage() { const access = Route.useLoaderData(); return <SiteShell><AdminPanel access={access} title="Animals." description="Inventory remains authoritative in Square. This permission-aware surface is reserved for future catalog mutations and availability workflows." /></SiteShell>; }
