import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { listSugarGliderHolds, updateSugarGliderHold, HOLD_STATUSES, type HoldStatus, type SugarGliderHold } from "@/lib/sugar-glider-holds";
import { SiteShell } from "@/components/site-shell";
import { Kicker, Display } from "@/components/type";
import { Button } from "@/components/ui/button";
import { formatMammalPrice } from "@/lib/mammals";

export const Route = createFileRoute("/admin/holds")({
  loader: () => listSugarGliderHolds(),
  component: AdminHoldsPage,
});

function HoldRow({ hold, onUpdate }: { hold: SugarGliderHold; onUpdate: (hold: SugarGliderHold) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function update(status: HoldStatus) {
    setBusy(true);
    setError(null);
    try {
      onUpdate(await updateSugarGliderHold({ data: { holdId: hold.id, status } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update hold.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Kicker>{hold.status.replace("_", " ")} · {hold.id.slice(0, 8).toUpperCase()}</Kicker>
          <h2 className="mt-1 font-display text-card italic text-ticket">{hold.animalDescription}</h2>
          <p className="mt-2 text-sm text-fg-soft">{hold.customerName} · {hold.customerEmail} · {hold.customerPhone}</p>
        </div>
        <p className="font-ui text-sm font-bold text-brass">{formatMammalPrice(hold.totalAmountCents / 100)} total</p>
      </div>
      <div className="mt-4 grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
        <p>Deposit: {formatMammalPrice(hold.depositAmountCents / 100)}</p>
        <p>Balance: {formatMammalPrice(hold.balanceDueCents / 100)}</p>
        <p>Expires: {new Date(hold.holdExpiresAt).toLocaleString()}</p>
      </div>
      <div className="mt-3 grid gap-1 text-xs font-ui uppercase tracking-kicker text-fg-soft sm:grid-cols-3">
        <p>Full payment: {hold.fullPaymentStatus}</p>
        <p>Deposit payment: {hold.depositPaymentStatus}</p>
        <p>Balance payment: {hold.balancePaymentStatus}</p>
      </div>
      {hold.notes ? <p className="mt-3 border-l-2 border-brass pl-3 text-sm text-muted-foreground">{hold.notes}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {HOLD_STATUSES.filter((status) => status !== hold.status).map((status) => (
          <Button key={status} size="sm" variant="ghost" disabled={busy} onClick={() => update(status)}>
            Mark {status.replace("_", " ")}
          </Button>
        ))}
      </div>
      {error ? <p role="alert" className="mt-2 text-sm text-ember-2">{error}</p> : null}
    </article>
  );
}

function AdminHoldsPage() {
  const initial = Route.useLoaderData();
  const [holds, setHolds] = useState(initial);
  return (
    <SiteShell>
      <main className="py-14 sm:py-20">
        <div className="wrap">
          <Kicker>Harris administration</Kicker>
          <Display as="h1" className="mt-2 text-display">Sugar Glider holds.</Display>
          <p className="mt-4 max-w-2xl text-fg-soft">Authenticated staff can review requests, see Square payment states, and advance the lifecycle. Expired active holds are marked automatically whenever this page or a new request is opened.</p>
          <div className="mt-8 grid gap-4">
            {holds.length ? holds.map((hold) => <HoldRow key={hold.id} hold={hold} onUpdate={(updated) => setHolds((current) => current.map((item) => item.id === updated.id ? updated : item))} />) : <p className="border border-dashed border-border p-6 text-muted-foreground">No holds yet.</p>}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
