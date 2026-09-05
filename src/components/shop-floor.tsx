import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeederLocker } from "@/components/feeder-locker";
import { useCart } from "@/lib/cart-store";
import {
  SHOP_FILTERS,
  canBuy,
  defaultSku,
  formatMoney,
  isFeeder,
  matchesFilter,
  packLabel,
  priceLabel,
  productImage,
  skuCartName,
  splitProductName,
  publicDescription,
  type CatalogPayload,
  type ShopFilter,
  type SquareProduct,
} from "@/lib/square";
import { cn } from "@/lib/utils";
import { Display, Kicker, Lede } from "@/components/type";

function ProductCard({
  product,
  focused,
}: {
  product: SquareProduct;
  focused?: boolean;
}) {
  const add = useCart((s) => s.add);
  const buyable = canBuy(product);
  const { kind, title } = splitProductName(product.name);
  const cat = product.categories[0] ?? kind ?? "Harris";
  const packs = (product.skus ?? []).filter((sku) => !sku.soldOut && sku.price > 0);
  const [skuId, setSkuId] = useState(defaultSku(product)?.id ?? packs[0]?.id ?? "");
  const selected = packs.find((pack) => pack.id === skuId) ?? packs[0];
  const price = selected ? formatMoney(selected.price) : priceLabel(product);
  const feeder = isFeeder(product);

  return (
    <article
      id={`sku-${product.id}`}
      className={cn(
        "group flex h-full flex-col border bg-card",
        focused ? "border-brass" : "border-border",
      )}
    >
      <div data-photo className="relative aspect-[4/5] overflow-hidden bg-surface">
        <img
          src={productImage(product)}
          alt={product.name}
          width={640}
          height={800}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-slow ease-out-smooth group-hover:scale-[1.04]"
        />
        <p className="pointer-events-none absolute left-3 top-3 bg-ticket-ink/75 px-2 py-1 font-ui text-kicker font-bold uppercase tracking-kicker text-ticket">
          {buyable ? cat : "Sold"}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {kind ? <Kicker>{kind}</Kicker> : feeder ? <Kicker>Feeder</Kicker> : null}
        <h3 className="mt-1 font-display text-card italic text-ticket">{title}</h3>
        {publicDescription(product) ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{publicDescription(product)}</p>
        ) : null}
        {packs.length > 1 ? (
          <label className="mt-3 grid gap-2">
            <span className="font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground">
              Pack
            </span>
            <select
              value={selected?.id ?? ""}
              onChange={(event) => setSkuId(event.target.value)}
              className="min-h-11 border border-border bg-surface px-3 font-ui text-sm text-ticket"
            >
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {packLabel(product, pack)} — {formatMoney(pack.price)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="font-ui text-sm font-bold uppercase tracking-kicker text-brass">{price}</p>
          <Button
            size="sm"
            variant={buyable ? "brass" : "ghost"}
            disabled={!buyable}
            onClick={() =>
              add({
                id: selected?.id ?? product.id,
                name: selected ? skuCartName(product, selected) : product.name,
                price: selected?.price ?? product.priceLow ?? 0,
                image: productImage(product),
                url: product.url,
                siteProductId: product.siteProductId,
                maxQty: feeder ? 48 : Math.min(product.stock && product.stock > 0 ? product.stock : 4, 4),
                tag: feeder ? "Feeder · Canton pickup" : "Live animal · Canton pickup",
              })
            }
          >
            {buyable ? (
              <>
                <ShoppingBag />
                Add
              </>
            ) : (
              "Ask the shop"
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

function RackRail({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  function measure() {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 12);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 12);
  }

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [children]);

  function jump(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-rack-card]");
    const step = card ? card.offsetWidth + 12 : Math.round(el.clientWidth * 0.75);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="relative mt-8">
      <div
        ref={scroller}
        className="rack-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4"
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-bg-2 to-transparent md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-bg-2 to-transparent md:block" />
      <button
        type="button"
        aria-label="Previous on the rack"
        disabled={!canPrev}
        onClick={() => jump(-1)}
        className={cn(
          "absolute left-0 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center border border-brass bg-ticket-ink text-ticket md:inline-flex",
          !canPrev && "opacity-30",
        )}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next on the rack"
        disabled={!canNext}
        onClick={() => jump(1)}
        className={cn(
          "absolute right-0 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center border border-brass bg-ticket-ink text-ticket md:inline-flex",
          !canNext && "opacity-30",
        )}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

export function ShopFloor({
  catalog,
  heading = "The rack, priced.",
  lede = "Live Square inventory. Animals and feeders ring through Harris’s Square account — pickup at 364 Albany Turnpike.",
  headingAs = "h2",
  focusId,
  tease,
}: {
  catalog: CatalogPayload;
  heading?: string;
  lede?: string;
  headingAs?: "h1" | "h2";
  focusId?: string;
  tease?: number;
}) {
  const [filter, setFilter] = useState<ShopFilter>(focusId ? "all" : "animals");
  const items = useMemo(() => {
    const list = catalog.products.filter((p) => matchesFilter(p, filter));
    const sorted = [...list].sort((a, b) => {
      const aBuy = canBuy(a) ? 0 : 1;
      const bBuy = canBuy(b) ? 0 : 1;
      if (aBuy !== bBuy) return aBuy - bBuy;
      return (a.priceLow ?? 0) - (b.priceLow ?? 0);
    });
    if (tease && !focusId) {
      return sorted.filter(canBuy).slice(0, tease);
    }
    return sorted;
  }, [catalog.products, filter, tease, focusId]);
  const available = items.filter(canBuy).length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (focusId) {
      setFilter("all");
      return;
    }
    if (window.location.pathname === "/shop" && window.location.hash === "#feeders") {
      setFilter("feeders");
    }
  }, [focusId]);

  useEffect(() => {
    if (!focusId) return;
    const node = document.getElementById(`sku-${focusId}`);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [focusId, filter, items]);

  return (
    <section id="rack" className="border-y border-border bg-bg-2 py-16 sm:py-24">
      <div className="wrap">
        <Kicker>{catalog.live ? "Live from Square" : "Square catalog"}</Kicker>
        <Display as={headingAs} className="mt-2">
          {heading}
        </Display>
        <Lede className="mt-4 max-w-2xl">{lede}</Lede>
        <p className="mt-3 font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground">
          {available} in stock{catalog.live ? " · live Square feed" : " · cached Square catalog"}
          {filter === "feeders" ? "" : " · slide the rack"}
        </p>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {SHOP_FILTERS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              className={cn(
                "min-h-11 shrink-0 border px-4 font-ui text-kicker font-bold uppercase tracking-kicker",
                filter === chip.id
                  ? "border-brass bg-brass text-ticket-ink"
                  : "border-border bg-transparent text-fg-soft hover:border-brass hover:text-ticket",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
        {filter === "feeders" ? (
          <FeederLocker catalog={catalog} embedded />
        ) : items.length === 0 ? (
          <p className="mt-10 text-muted-foreground">Nothing in this case right now. Call the shop.</p>
        ) : (
          <RackRail key={filter}>
            {items.map((product) => (
              <div
                key={product.id}
                data-rack-card
                className="w-[min(78vw,18.5rem)] shrink-0 snap-start self-stretch sm:w-[19rem]"
              >
                <ProductCard product={product} focused={product.id === focusId} />
              </div>
            ))}
          </RackRail>
        )}
      </div>
    </section>
  );
}
