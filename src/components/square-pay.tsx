import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type SquarePayments = {
  card: () => Promise<{
    attach: (selector: string) => Promise<void>;
    tokenize: () => Promise<{ status: string; token?: string }>;
    destroy?: () => Promise<void>;
  }>;
};

declare global {
  interface Window {
    Square?: {
      payments: (applicationId: string, locationId: string) => Promise<SquarePayments>;
    };
  }
}

function loadSdk() {
  if (window.Square) return Promise.resolve(window.Square);
  return new Promise<NonNullable<Window["Square"]>>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-square-sdk]");
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.Square) resolve(window.Square);
        else reject(new Error("Square SDK missing"));
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://web.squarecdn.com/v1/square.js";
    script.async = true;
    script.dataset.squareSdk = "true";
    script.onload = () => {
      if (window.Square) resolve(window.Square);
      else reject(new Error("Square SDK missing"));
    };
    script.onerror = () => reject(new Error("Square SDK failed to load"));
    document.head.appendChild(script);
  });
}

export function SquarePay({
  applicationId,
  locationId,
  onToken,
  onError,
}: {
  applicationId: string;
  locationId: string;
  onToken: (sourceId: string) => Promise<void>;
  onError: (message: string) => void;
}) {
  const cardRef = useRef<{ tokenize: () => Promise<{ status: string; token?: string }>; destroy?: () => Promise<void> } | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let dead = false;
    void (async () => {
      try {
        const Square = await loadSdk();
        const payments = await Square.payments(applicationId, locationId);
        const card = await payments.card();
        if (dead) {
          await card.destroy?.();
          return;
        }
        await card.attach("#square-card");
        cardRef.current = card;
        setReady(true);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Square card form failed.");
      }
    })();
    return () => {
      dead = true;
      void cardRef.current?.destroy?.();
    };
  }, [applicationId, locationId, onError]);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!cardRef.current) return;
        setBusy(true);
        try {
          const result = await cardRef.current.tokenize();
          if (result.status !== "OK" || !result.token) {
            onError("Card was not accepted. Try another card.");
            return;
          }
          await onToken(result.token);
        } catch (err) {
          onError(err instanceof Error ? err.message : "Payment failed.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div id="square-card" className="min-h-24 border border-border bg-secondary p-3" />
      <Button type="submit" disabled={!ready || busy} className="w-full">
        {busy ? "Charging Square…" : ready ? "Pay on this page" : "Loading Square…"}
      </Button>
    </form>
  );
}