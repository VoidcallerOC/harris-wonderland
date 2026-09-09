import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { assignRole, deleteAdminUser, getAdminDashboard, listAdminUsers, RBAC_ROLES } from "@/lib/auth/rbac";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/users")({
  loader: async () => ({ access: await getAdminDashboard(), users: await listAdminUsers() }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const initial = Route.useLoaderData();
  const [users, setUsers] = useState(initial.users);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  async function changeRole(userId: string, role: (typeof RBAC_ROLES)[number]) {
    setBusy(userId); setMessage(null);
    try {
      await assignRole({ data: { userId, role } });
      setUsers((current) => current.map((user) => user.id === userId ? { ...user, role } : user));
      setMessage("Role updated and recorded in the audit log.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Role update failed."); }
    finally { setBusy(null); }
  }
  async function removeUser(userId: string) {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    setBusy(userId); setMessage(null);
    try {
      await deleteAdminUser({ data: { userId } });
      setUsers((current) => current.filter((user) => user.id !== userId));
      setMessage("User deleted and recorded in the audit log.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "User deletion failed."); }
    finally { setBusy(null); }
  }
  return <SiteShell><AdminPanel access={initial.access} title="Users and roles." description="Only Owners can view users, assign the closed set of business roles, or delete accounts. Final-Owner safety is enforced on the server.">
    <div className="grid gap-4">
      {users.map((user) => <article key={user.id} className="border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-card italic text-ticket">{user.name}</h2><p className="text-sm text-muted-foreground">{user.email} · {user.id}</p></div><span className="font-ui text-kicker uppercase tracking-kicker text-brass">{user.role ?? "Unassigned"}</span></div>
        <div className="mt-4 flex flex-wrap gap-2">{RBAC_ROLES.map((role) => <Button key={role} size="sm" variant={user.role === role ? "brass" : "ghost"} disabled={busy === user.id} onClick={() => changeRole(user.id, role)}>{role.replace("_", " ")}</Button>)}<Button size="sm" variant="ghost" disabled={busy === user.id} onClick={() => removeUser(user.id)}>Delete user</Button></div>
      </article>)}
      {!users.length ? <p className="border border-dashed border-border p-6 text-muted-foreground">No users found.</p> : null}
    </div>
    {message ? <p role="status" className="mt-4 text-sm text-fg-soft">{message}</p> : null}
  </AdminPanel></SiteShell>;
}
