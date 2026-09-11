import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAdminDashboard } from "@/lib/auth/rbac";
import { listSiteCopy, saveSiteCopy } from "@/lib/site-copy";
import { requireAdminRoute } from "@/lib/auth/admin-route";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/settings")({
  loader: () => requireAdminRoute(async () => ({ access: await getAdminDashboard(), fields: await listSiteCopy() })),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const initial = Route.useLoaderData();
  const [fields, setFields] = useState(initial.fields);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function save(key: string, value: string) {
    setBusy(key);
    setMessage(null);
    try {
      const saved = await saveSiteCopy({ data: { key, value } });
      setFields((current) => current.map((field) => field.key === key ? { ...field, value: saved.value } : field));
      setMessage("Saved. The live site will use this text on the next page load.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save copy.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <SiteShell>
      <AdminPanel access={initial.access} title="Site copy." description="These fields power the public homepage, footer, phone, and address. Save a field and it replaces the hard-coded line on the live site. Care sheets and Square product names stay on their own systems.">
        <div className="grid gap-5">
          {fields.map((field) => (
            <CopyRow key={field.key} field={field} busy={busy === field.key} onSave={save} />
          ))}
        </div>
        {message ? <p role="status" className="mt-4 text-sm text-fg-soft">{message}</p> : null}
      </AdminPanel>
    </SiteShell>
  );
}

function CopyRow({
  field,
  busy,
  onSave,
}: {
  field: { key: string; label: string; value: string };
  busy: boolean;
  onSave: (key: string, value: string) => Promise<void>;
}) {
  const [value, setValue] = useState(field.value);
  const multiline = field.value.length > 80 || field.key.includes("lede") || field.key.includes("blurb") || field.key.includes("description");
  return (
    <article className="border border-border bg-card p-5">
      <label className="grid gap-2 text-sm text-fg-soft">
        {field.label}
        {multiline ? (
          <textarea value={value} onChange={(event) => setValue(event.target.value)} rows={5} className="border border-border bg-transparent px-3 py-2 text-ticket outline-none focus:border-brass" />
        ) : (
          <input value={value} onChange={(event) => setValue(event.target.value)} className="min-h-12 border border-border bg-transparent px-3 text-ticket outline-none focus:border-brass" />
        )}
      </label>
      <div className="mt-3">
        <Button size="sm" disabled={busy || value === field.value} onClick={() => void onSave(field.key, value)}>
          {busy ? "Saving…" : "Save"}
        </Button>
      </div>
    </article>
  );
}
