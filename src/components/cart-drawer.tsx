import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartTotal, useCart } from "@/lib/cart-store";
import { formatMoney } from "@/lib/square";
import { getSquarePayConfig, startSquareCheckout } from "@/lib/square-api";
import { SquarePay } from "@/components/square-pay";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<"cart" | "pay" | "done">("cart");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<{
    applicationId: string | null;
    locationId: string;
    canCharge: boolean;
    canLink: boolean;
  } | null>(null);

  const total = cartTotal(items);

  useEffect(() => {
    if (!open) {
      setStep("cart");
      setError(null);
      setFrameUrl(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    void getSquarePayConfig().then(setConfig);
  }, [open]);

  async function beginPay() {
    setError(null);
    if (!name.trim() || !email.trim() || phone.trim().length < 7) {
      setError("Name, email, and phone — they will call if the animal or the cup is a bad fit.");
      return;
    }
    if (!items.length) return;
    setPending(true);
    try {
      const result = await startSquareCheckout({
        data: {
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            url: item.url,
            siteProductId: item.siteProductId,
          })),
          buyer: { name: name.trim(), email: email.trim(), phone: phone.trim(), note: note.trim() },
          returnUrl: `${window.location.origin}/shop?paid=1`,
        },
      });
      if (result.mode === "charged") {
        clear();
        setStep("done");
        return;
      }
      if (result.mode === "payment-link") {
        setFrameUrl(result.url);
        setStep("pay");
        return;
      }
      setFrameUrl(result.urls[0] ?? null);
      setStep("pay");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Square could not start checkout.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(28rem,100%)] flex-col border-l border-brass bg-card shadow-none">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Dialog.Title className="font-display text-2xl italic text-ticket">
              {step === "done" ? "Ticket in" : step === "pay" ? "Pay with Square" : "Cart"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="inline-flex size-11 items-center justify-center text-ticket" aria-label="Close cart">
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          {step === "cart" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <p className="text-muted-foreground">
                    The cart is empty. Pull something off the rack, or a pack from the feeder locker.
                  </p>
                ) : (
                  <ul className="grid gap-4">
                    {items.map((item) => (
                      <li key={item.id} className="grid grid-cols-[4.5rem_1fr] gap-3">
                        <img src={item.image} alt="" className="size-[4.5rem] object-cover" />
                        <div>
                          {item.tag ? (
                            <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">
                              {item.tag}
                            </p>
                          ) : null}
                          <p className="font-display text-lg italic leading-tight text-ticket">{item.name}</p>
                          <p className="mt-1 font-ui text-kicker font-bold uppercase tracking-kicker text-brass">
                            {formatMoney(item.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              className="inline-flex size-9 items-center justify-center border border-border text-ticket"
                              onClick={() => setQty(item.id, item.qty - 1)}
                              aria-label="Decrease"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="min-w-6 text-center text-sm">{item.qty}</span>
                            <button
                              className="inline-flex size-9 items-center justify-center border border-border text-ticket"
                              onClick={() => setQty(item.id, item.qty + 1)}
                              aria-label="Increase"
                            >
                              <Plus className="size-3.5" />
                            </button>
                            <button
                              className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-ember"
                              onClick={() => remove(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 grid gap-3">
                  <div>
                    <Label htmlFor="cart-name">Name</Label>
                    <Input id="cart-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </div>
                  <div>
                    <Label htmlFor="cart-email">Email</Label>
                    <Input id="cart-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                  </div>
                  <div>
                    <Label htmlFor="cart-phone">Phone</Label>
                    <Input id="cart-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
                  </div>
                  <div>
                    <Label htmlFor="cart-note">Pickup note</Label>
                    <Input
                      id="cart-note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Setup questions, hold until Saturday…"
                    />
                  </div>
                </div>
                {error ? <p className="mt-3 text-sm text-ember">{error}</p> : null}
              </div>
              <div className="border-t border-border p-5">
                <p className="flex justify-between font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft">
                  Canton pickup
                  <span className="text-ticket">{formatMoney(total)}</span>
                </p>
                <Button className="mt-4 w-full" disabled={!items.length || pending} onClick={() => void beginPay()}>
                  {pending ? "Talking to Square…" : "Pay with Square"}
                </Button>
              </div>
            </div>
          ) : null}

          {step === "pay" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm text-muted-foreground">
                  Square takes the card. Pickup at 364 Albany Turnpike. The money never sits on this site.
                </p>
                <p className="mt-2 font-ui text-kicker font-bold uppercase tracking-kicker text-brass">
                  {formatMoney(total)} · Canton pickup
                </p>
              </div>
              {config?.canCharge && config.applicationId ? (
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                  <SquarePay
                    applicationId={config.applicationId}
                    locationId={config.locationId}
                    onToken={async (sourceId) => {
                      const result = await startSquareCheckout({
                        data: {
                          items: items.map((item) => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            qty: item.qty,
                            url: item.url,
                            siteProductId: item.siteProductId,
                          })),
                          buyer: { name, email, phone, note },
                          returnUrl: `${window.location.origin}/shop?paid=1`,
                          sourceId,
                        },
                      });
                      if (result.mode === "charged") {
                        clear();
                        setStep("done");
                      }
                    }}
                    onError={setError}
                  />
                  {error ? <p className="mt-3 text-sm text-ember">{error}</p> : null}
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col">
                  <iframe
                    title="Square checkout"
                    src={frameUrl ?? undefined}
                    className="min-h-0 w-full flex-1 border-0 bg-ticket"
                    allow="payment"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {items.length > 1 ? (
                    <div className="grid max-h-40 gap-1 overflow-y-auto border-t border-border p-3">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="flex min-h-11 items-center justify-between gap-2 px-2 text-left font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft hover:text-ticket"
                          onClick={() => setFrameUrl(item.url)}
                        >
                          <span className="truncate">{item.name}</span>
                          <span className="text-brass">{formatMoney(item.price * item.qty)}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}

          {step === "done" ? (
            <div className="px-5 py-8">
              <p className="font-display text-3xl italic text-ticket">Paid through Square.</p>
              <p className="mt-3 text-muted-foreground">
                They will pull the ticket when you come through the snake-handle door. Frozen stays
                frozen. Live cups go home the same day.
              </p>
              <Button className="mt-6" onClick={() => setOpen(false)}>
                Back to the rack
              </Button>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
