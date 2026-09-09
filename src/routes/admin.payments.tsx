import { createFileRoute } from "@tanstack/react-router";
import { getAdminDashboard } from "@/lib/auth/rbac";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/admin/payments")({ loader: () => getAdminDashboard(), component: AdminPaymentsPage });
function AdminPaymentsPage() { const access = Route.useLoaderData(); return <SiteShell><AdminPanel access={access} title="Payments." description="Payment operations remain server-authoritative and connected to Square. This route exposes only the payment information and actions permitted by the signed-in role." /></SiteShell>; }
