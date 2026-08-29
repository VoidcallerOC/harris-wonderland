import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import {
  SHOP_FILTERS,
  canBuy,
  matchesFilter,
  priceLabel,
  productImage,
  splitProductName,
  type CatalogPayload,
  type ShopFilter,
  type SquareProduct,
} from "@/lib/square";
import { cn } from "@/lib/utils";
import { Display, Kicker, Lede } from "@/components/type";

function ProductCard({ product }: { product: SquareProduct }) {
  const add = useCart((s) => s.add);
  const buyable = canBuy(product);
  const { kind, title } = splitProductName(product.name);
  const cat = product.categories[0] ?? kind ?? "Harris";

  return (
    <article className="group flex flex-col border border-border bg-card">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
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
        {kind ? <Kicker>{kind}</Kicker> : null}
        <h3 className="mt-1 font-display text-card italic text-ticket">{title}</h3>
        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="font-ui text-sm font-bold uppercase tracking-kicker text-brass">
            {priceLabel(product)}
          </p>
          <Button
            size="sm"
            variant={buyable ? "brass" : "ghost"}
            disabled={!buyable}
            onClick={() =>
              add({
                id: product.id,
                name: product.name,
                price: product.priceLow ?? 0,
                image: productImage(product),
                url: product.url,
                siteProductId: product.siteProductId,
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

export function ShopFloor({
  catalog,
  heading = "The rack, priced.",
  lede = "Live Square inventory. Animals and feeders ring through Harris’s Square account — pickup at 364 Albany Turnpike.",
}: {
  catalog: CatalogPayload;
  heading?: string;
  lede?: string;
}) {
  const [filter, setFilter] = useState<ShopFilter>("animals");
  const items = useMemo(() => {
    const list = catalog.products.filter((p) => matchesFilter(p, filter));
    return [...list].sort((a, b) => {
      const aBuy = canBuy(a) ? 0 : 1;
      const bBuy = canBuy(b) ? 0 : 1;
      if (aBuy !== bBuy) return aBuy - bBuy;
      return (a.priceLow ?? 0) - (b.priceLow ?? 0);
    });
  }, [catalog.products, filter]);
  const available = items.filter(canBuy).length;

  return (
    <section id="rack" className="border-y border-border bg-bg-2 py-16 sm:py-24">
      <div className="wrap">
        <Kicker>{catalog.live ? "Live from Square" : "Square catalog"}</Kicker>
        <Display className="mt-2">{heading}</Display>
        <Lede className="mt-4 max-w-2xl">{lede}</Lede>
        <p className="mt-3 font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground">
          {available} in stock{catalog.live ? " · live Square feed" : " · cached Square catalog"}
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
        {items.length === 0 ? (
          <p className="mt-10 text-muted-foreground">Nothing in this case right now. Call the shop.</p>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}