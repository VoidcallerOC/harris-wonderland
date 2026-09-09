import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { formatMammalPrice, mammalDeposit, MAMMAL_AVAILABILITY, SUGAR_GLIDERS, type MammalListing } from "@/lib/mammals";
import { Button } from "@/components/ui/button";
import { Kicker, Display, Lede } from "@/components/type";
import { cn } from "@/lib/utils";
import { createSugarGliderHold, type SugarGliderHold } from "@/lib/sugar-glider-holds";
import { HOLD_PAYMENT_MODES, paySugarGliderHold, type HoldPaymentMode } from "@/lib/sugar-glider-holds";
import { getSquarePayConfig } from "@/lib/square-api";
import { SquarePay } from "@/components/square-pay";

function HoldRequestForm({ listing, onComplete }: { listing: MammalListing; onComplete: (hold: SugarGliderHold) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(formData: FormData) {
    setBusy(true);
    setError(null);
    try {
      const result = await createSugarGliderHold({
        data: {
          animalId: listing.id,
          customerName: String(formData.get("customerName") ?? ""),
          customerEmail: String(formData.get("customerEmail") ?? ""),
          customerPhone: String(formData.get("customerPhone") ?? ""),
          notes: String(formData.get("notes") ?? ""),
        },
      });
      onComplete(result.hold);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not save that request. Please call the shop.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form action={submit} className="mt-4 grid gap-2 border-t border-border pt-4">
      <label className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass" htmlFor={`${listing.id}-name`}>Request this animal</label>
      <input id={`${listing.id}-name`} name="customerName" required minLength={2} maxLength={120} placeholder="Your name" className="min-h-10 border border-border bg-bg-2 px-3 text-sm text-ticket outline-none focus:border-brass" />
      <input name="customerEmail" required type="email" maxLength={254} placeholder="Email" className="min-h-10 border border-border bg-bg-2 px-3 text-sm text-ticket outline-none focus:border-brass" />
      <input name="customerPhone" required minLength={7} maxLength={30} placeholder="Phone" className="min-h-10 border border-border bg-bg-2 px-3 text-sm text-ticket outline-none focus:border-brass" />
      <textarea name="notes" maxLength={1000} placeholder="Setup notes or questions (optional)" className="min-h-20 border border-border bg-bg-2 px-3 py-2 text-sm text-ticket outline-none focus:border-brass" />
      <p className="text-xs text-muted-foreground">This creates a request for the shop to review. It does not charge your card or place an automatic hold.</p>
      {error ? <p role="alert" className="text-sm text-ember-2">{error}</p> : null}
      <Button type="submit" size="sm" variant="brass" disabled={busy}>{busy ? "Saving request…" : "Submit hold request"}</Button>
    </form>
  );
}

function HoldPaymentPanel({ hold, onPaid }: { hold: SugarGliderHold; onPaid: (hold: SugarGliderHold) => void }) {
  const [mode, setMode] = useState<HoldPaymentMode>(hold.depositAmountCents > 0 ? "deposit" : "full");
  const [config, setConfig] = useState<{ applicationId: string | null; locationId: string; canCharge: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const storageKey = `hiw-hold-payment:${hold.id}:${mode}`;
  const [idempotencyKey, setIdempotencyKey] = useState(() => {
    if (typeof window === "undefined") return crypto.randomUUID();
    return window.sessionStorage.getItem(storageKey) ?? crypto.randomUUID();
  });
  useEffect(() => { void getSquarePayConfig().then(setConfig); }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(storageKey, idempotencyKey);
  }, [idempotencyKey, storageKey]);
  const amount = mode === "full" ? hold.totalAmountCents : mode === "deposit" ? hold.depositAmountCents : hold.balanceDueCents;
  const alreadyPaid = mode === "full" ? hold.fullPaymentStatus === "succeeded" : mode === "deposit" ? hold.depositPaymentStatus === "succeeded" : hold.balancePaymentStatus === "succeeded";
  if (alreadyPaid) return <p className="mt-4 text-sm text-moss">{mode === "full" ? "Paid in full." : mode === "deposit" ? "Deposit paid." : "Balance paid."}</p>;
  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">Payment options</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {HOLD_PAYMENT_MODES.filter((candidate) => candidate !== "balance" || hold.depositPaymentStatus === "succeeded").map((candidate) => (
          <Button key={candidate} type="button" size="sm" variant={mode === candidate ? "brass" : "ghost"} onClick={() => { setMode(candidate); const nextKey = crypto.randomUUID(); setIdempotencyKey(nextKey); window.sessionStorage.setItem(`hiw-hold-payment:${hold.id}:${candidate}`, nextKey); setError(null); }}>
            {candidate === "full" ? "Pay in full" : candidate === "deposit" ? "Pay 50% deposit" : "Pay remaining balance"}
          </Button>
        ))}
      </div>
      <p className="mt-2 text-sm text-fg-soft">{mode === "full" ? "Full amount" : mode === "deposit" ? "50% deposit" : "Remaining balance"}: {formatMammalPrice(amount / 100)}</p>
      {config?.canCharge && config.applicationId ? (
        <div className="mt-3"><SquarePay applicationId={config.applicationId} locationId={config.locationId} onToken={async (sourceId) => {
          setError(null);
          const result = await paySugarGliderHold({ data: { holdId: hold.id, mode, sourceId, idempotencyKey } });
          window.sessionStorage.removeItem(storageKey);
          onPaid(result.hold ?? hold);
        }} onError={(message) => { setError(message); const nextKey = crypto.randomUUID(); setIdempotencyKey(nextKey); window.sessionStorage.setItem(storageKey, nextKey); }} /></div>
      ) : <p className="mt-3 text-sm text-muted-foreground">Square card payments are not configured in this preview. Call the shop to arrange payment.</p>}
      {error ? <p role="alert" className="mt-2 text-sm text-ember-2">{error}</p> : null}
    </div>
  );
}

function HoldConfirmation({ hold, onPaid }: { hold: SugarGliderHold; onPaid: (hold: SugarGliderHold) => void }) {
  return (
    <div role="status" className="mt-4 border border-moss bg-moss/10 p-4">
      <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-moss">Request received</p>
      <h4 className="mt-1 font-display text-xl italic text-ticket">Reference {hold.id.slice(0, 8).toUpperCase()}</h4>
      <p className="mt-2 text-sm text-fg-soft">We saved your request for {hold.animalDescription}. The shop will contact you at {hold.customerEmail} to review the animal, deposit, and next steps.</p>
      <p className="mt-2 text-xs text-muted-foreground">This request expires {new Date(hold.holdExpiresAt).toLocaleString()} if the shop does not confirm it.</p>
      <HoldPaymentPanel hold={hold} onPaid={onPaid} />
    </div>
  );
}

function SugarGliderCard({ listing }: { listing: MammalListing }) {
  const [requesting, setRequesting] = useState(false);
  const [confirmation, setConfirmation] = useState<SugarGliderHold | null>(null);
  const status = MAMMAL_AVAILABILITY[listing.availability];
  const deposit = mammalDeposit(listing);
  return (
    <article className="flex flex-col overflow-hidden border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <img src={listing.image} alt={listing.alt} className="h-full w-full object-cover" loading="lazy" />
        <span className={cn("absolute left-3 top-3 px-2 py-1 font-ui text-kicker font-bold uppercase tracking-kicker", status.tone)}>
          {status.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Kicker>{listing.morph}</Kicker>
        <h3 className="mt-1 font-display text-card italic text-ticket">{listing.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{listing.summary}</p>
        <div className="mt-4 border-t border-border pt-4">
          <p className="font-ui text-sm font-bold uppercase tracking-kicker text-brass">
            Full price · {formatMammalPrice(listing.fullPrice)}
          </p>
          {deposit ? (
            <p className="mt-1 text-sm text-muted-foreground">
              50% deposit, when applicable · {formatMammalPrice(deposit)}
            </p>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-fg-soft">{listing.careNote}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <Button asChild size="sm" variant={listing.availability === "available" ? "brass" : "ghost"}>
            <a href={SITE.phones.shop.href}>
              <Phone />
              {status.action}
            </a>
          </Button>
          {listing.availability === "available" ? (
            <Button asChild size="sm" variant="ghost">
              <Link to="/shop">View current inventory <ArrowRight /></Link>
            </Button>
          ) : null}
          {["available", "upcoming", "preorder"].includes(listing.availability) && !confirmation ? (
            <Button type="button" size="sm" variant="ghost" onClick={() => setRequesting((value) => !value)}>
              {requesting ? "Close request" : "Request this animal"}
            </Button>
          ) : null}
        </div>
        {confirmation ? <HoldConfirmation hold={confirmation} onPaid={setConfirmation} /> : requesting ? <HoldRequestForm listing={listing} onComplete={setConfirmation} /> : null}
      </div>
    </article>
  );
}

export function MammalsSection({ sugarGlidersOnly = false }: { sugarGlidersOnly?: boolean }) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-bg-2">
        <div className="wrap grid items-end gap-8 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
          <div>
            <Kicker>Our mammals</Kicker>
            <Display as="h1" className="mt-2 text-display">Small animals. Serious care.</Display>
            <Lede className="mt-5 max-w-xl">
              Sugar gliders are social, nocturnal marsupials. We talk habitat, companionship, diet, and the real commitment before we talk about taking one home.
            </Lede>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild><a href={SITE.phones.shop.href}><Phone /> Call the shop</a></Button>
              <Button asChild variant="ghost"><Link to="/collection/$category" params={{ category: "mammals" }}>Our Mammals</Link></Button>
            </div>
          </div>
          <div className="relative overflow-hidden border border-border bg-card">
            <img src="/images/sugar-glider.jpg" alt="Sugar glider perched on a natural branch" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>{sugarGlidersOnly ? "Sugar gliders" : "Mammals · Sugar Gliders"}</Kicker>
              <Display className="mt-2">Current and upcoming animals.</Display>
              <p className="mt-4 max-w-2xl text-fg-soft">
                Availability is stated plainly: available, upcoming, preorder interest, on hold, or sold. Pricing shows the full amount and the informational 50% deposit; submitting a request does not charge your card or confirm a hold.
              </p>
            </div>
            <Link to="/collection/$category" params={{ category: "sugar-gliders" }} className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass no-underline hover:text-ember-2">
              Sugar Gliders <ArrowRight className="ml-1 inline size-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SUGAR_GLIDERS.map((listing) => <SugarGliderCard key={listing.id} listing={listing} />)}
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-bg-2 py-12 sm:py-16">
        <div className="wrap grid gap-8 lg:grid-cols-3">
          <div><Kicker>Before you call</Kicker><h2 className="mt-2 font-display text-card italic text-ticket">Build the habitat first.</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tall enclosure, safe exercise space, enrichment, and a plan for a compatible companion.</p></div>
          <div><Kicker>Night shift</Kicker><h2 className="mt-2 font-display text-card italic text-ticket">They wake when you wind down.</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Expect nocturnal activity, regular feeding, and patient socialization rather than a daytime display pet.</p></div>
          <div><Kicker>Ask the shop</Kicker><h2 className="mt-2 font-display text-card italic text-ticket">A request starts the conversation.</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">We review the animal, setup, deposit, and timing with you. Payment mechanics come later.</p></div>
        </div>
      </section>
    </>
  );
}
