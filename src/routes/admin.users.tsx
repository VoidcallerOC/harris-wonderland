import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { assignRole, createAdminUser, deleteAdminUser, getAdminDashboard, listAdminUsers, RBAC_ROLES } from "@/lib/auth/rbac";
import { requireAdminRoute } from "@/lib/auth/admin-route";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/users")({
  loader: () => requireAdminRoute(async () => ({ access: await getAdminDashboard(), users: await listAdminUsers() })),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const initial = Route.useLoaderData();
  const [users, setUsers] = useState(initial.users);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof RBAC_ROLES)[number] | "">("");
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
  async function addUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("create"); setMessage(null);
    try {
      const created = await createAdminUser({ data: { name, email, password, role: role || null } });
      setUsers((current) => [{ ...created, roleUpdatedAt: null, role_updated_at: null }, ...current]);
      setName(""); setEmail(""); setPassword(""); setRole("");
      setMessage("User created. Share the temporary password securely; it is not shown again.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "User creation failed."); }
    finally { setBusy(null); }
  }
  return <SiteShell><AdminPanel access={initial.access} title="Users and roles." description="Only Owners can view users, assign the closed set of business roles, or delete accounts. Final-Owner safety is enforced on the server.">
    <form onSubmit={(event) => void addUser(event)} className="mb-8 border border-brass/40 bg-brass/5 p-5">
      <div className="mb-4"><p className="font-ui text-kicker uppercase tracking-kicker text-brass">Create account</p><h2 className="mt-1 font-display text-card italic text-ticket">Add a user.</h2><p className="mt-1 text-sm text-muted-foreground">Create an email/password account and optionally give it a role. Share the temporary password through a secure channel.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-fg-soft">Name<input required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="min-h-11 border border-border bg-transparent px-3 text-ticket outline-none focus:border-brass" /></label>
        <label className="grid gap-1 text-sm text-fg-soft">Email<input required type="email" autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-11 border border-border bg-transparent px-3 text-ticket outline-none focus:border-brass" /></label>
        <label className="grid gap-1 text-sm text-fg-soft">Temporary password<input required type="password" minLength={8} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-11 border border-border bg-transparent px-3 text-ticket outline-none focus:border-brass" /></label>
        <label className="grid gap-1 text-sm text-fg-soft">Initial role<select value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="min-h-11 border border-border bg-card px-3 text-ticket outline-none focus:border-brass"><option value="">No role yet</option>{RBAC_ROLES.map((item) => <option key={item} value={item}>{item.replace("_", " ")}</option>)}</select></label>
      </div>
      <Button type="submit" size="sm" variant="brass" className="mt-4" disabled={busy === "create"}>{busy === "create" ? "Creating…" : "Create user"}</Button>
    </form>
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
