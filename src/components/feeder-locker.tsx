import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { availablePacks, familyMeta, feederFamilies } from "@/lib/feeders";
import {
  defaultSku,
  formatMoney,
  packLabel,
  skuCartName,
  type CatalogPayload,
  type SquareProduct,
  type SquareSku,
} from "@/lib/square";
import { cn } from "@/lib/utils";
import { Display, Kicker, Lede } from "@/components/type";
import { SpecimenPhoto } from "@/components/specimen-photo";

function FeederCard({ product, eager }: { product: SquareProduct; eager?: boolean }) {
  const add = useCart((s) => s.add);
  const meta = familyMeta(product);
  const packs = useMemo(() => availablePacks(product), [product]);
  const [skuId, setSkuId] = useState(defaultSku(product)?.id ?? packs[0]?.id ?? "");
  const selected: SquareSku | undefined = packs.find((pack) => pack.id === skuId) ?? packs[0];
  const useSelect = packs.length > 8;

  if (!selected) {
    return (
      <article className="flex min-w-0 w-full flex-col overflow-hidden border border-border bg-card">
        <SpecimenPhoto src={meta.image} alt={meta.title} caption="Call the shop" className="aspect-[16/10]" />
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <Kicker>{meta.kicker}</Kicker>
          <h3 className="mt-1 font-display text-card italic text-ticket">{meta.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{meta.blurb}</p>
          <p className="mt-auto pt-4 text-sm text-muted-foreground">Nothing in this cup right now.</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex min-w-0 w-full flex-col overflow-hidden border border-border bg-card">
      <SpecimenPhoto
        src={meta.image}
        alt={meta.title}
        caption={`${packs.length} packs`}
        className="aspect-[16/10]"
        eager={eager}
      />
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <Kicker>{meta.kicker}</Kicker>
        <h3 className="mt-1 font-display text-card italic text-ticket">{meta.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{meta.blurb}</p>
        {useSelect ? (
          <label className="mt-4 grid min-w-0 gap-2">
            <span className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground">
              Pack
            </span>
            <select
              value={selected.id}
              onChange={(event) => setSkuId(event.target.value)}
              className="min-h-11 min-w-0 border border-border bg-surface px-3 font-ui text-sm text-ticket"
            >
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {packLabel(product, pack)} — {formatMoney(pack.price)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="mt-4 grid min-w-0 grid-cols-3 gap-2">
            {packs.map((pack) => {
              const active = pack.id === selected.id;
              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setSkuId(pack.id)}
                  className={cn(
                    "inline-flex min-h-12 min-w-0 items-center justify-center border px-1 text-center font-ui text-[0.62rem] font-bold uppercase leading-none tracking-[0.12em] sm:text-kicker sm:tracking-kicker",
                    active
                      ? "border-brass bg-brass text-ticket-ink"
                      : "border-border bg-transparent text-fg-soft hover:border-brass hover:text-ticket",
                  )}
                >
                  {packLabel(product, pack)}
                </button>
              );
            })}
          </div>
        )}
        <div className="mt-auto flex flex-col items-center gap-3 pt-4">
          <p className="font-ui text-sm font-bold uppercase tracking-kicker text-brass">
            {formatMoney(selected.price)}
          </p>
          <Button
            size="sm"
            variant="brass"
            className="w-full"
            onClick={() =>
              add({
                id: selected.id,
                name: skuCartName(product, selected),
                price: selected.price,
                image: meta.image,
                url: product.url,
                siteProductId: product.siteProductId,
                maxQty: 48,
                tag: "Feeder · Canton pickup",
              })
            }
          >
            <ShoppingBag />
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}

export function FeederLocker({
  catalog,
  embedded = false,
}: {
  catalog: CatalogPayload;
  embedded?: boolean;
}) {
  const families = useMemo(() => feederFamilies(catalog), [catalog]);

  useEffect(() => {
    if (embedded) return;
    if (typeof window === "undefined") return;
    if (window.location.hash === "#feeders") {
      document.getElementById("feeders")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [embedded]);

  return (
    <section
      id={embedded ? "rack-feeders" : "feeders"}
      className={cn(
        embedded ? "pt-2" : "scroll-mt-20 border-y border-border bg-background py-16 sm:py-24",
      )}
    >
      <div className={embedded ? undefined : "wrap"}>
        {embedded ? null : (
          <>
            <Kicker>Pickup feeders</Kicker>
            <Display className="mt-2">The locker, priced.</Display>
            <Lede className="mt-4">
              They raise their own feeders for the animals on the rack and sell the surplus.
              Frozen mice, dubia, mealworms, and the odd cup regulars drive for. Pickup at
              364 Albany Turnpike — nothing ships.
            </Lede>
          </>
        )}
        <div className={cn("grid min-w-0 gap-3 md:grid-cols-2", embedded ? "mt-6" : "mt-10")}>
          {families.map((product, index) => (
            <FeederCard key={product.id} product={product} eager={index === 0 && !embedded} />
          ))}
        </div>
        <p className="mt-6 font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground">
          Frozen stays frozen until you walk in · live cups go home the same day
        </p>
      </div>
    </section>
  );
}
