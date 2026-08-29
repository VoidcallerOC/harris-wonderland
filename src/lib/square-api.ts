import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import fallbackJson from "./square-catalog.json";
import fallbackSkus from "./feeder-skus.json";
import { withFeederSkus } from "./feeders";
import { SQUARE, isFeeder, stripHtml, type CatalogPayload, type SquareProduct, type SquareSku } from "./square";

type FallbackFile = {
  fetchedAt: string;
  products: SquareProduct[];
  categories: CatalogPayload["categories"];
};

const fallback = fallbackJson as FallbackFile;
const FALLBACK_SKUS = fallbackSkus as Record<string, SquareSku[]>;

type Cache = { at: number; data: CatalogPayload };
let cache: Cache | null = null;
const TTL_MS = 3 * 60 * 1000;

const FALLBACK: CatalogPayload = {
  fetchedAt: fallback.fetchedAt,
  live: false,
  products: withFeederSkus(fallback.products as SquareProduct[]),
  categories: fallback.categories,
};

function thumbUrl(item: Record<string, unknown>): string | null {
  const thumbnail = item.thumbnail as { data?: { absolute_urls?: Record<string, string>; urls?: Record<string, string>; absolute_url?: string; url?: string } } | undefined;
  const data = thumbnail?.data;
  if (!data) return null;
  const urls = data.absolute_urls ?? data.urls ?? {};
  return urls["640"] ?? urls["320"] ?? data.absolute_url ?? data.url ?? null;
}

function money(price: Record<string, unknown> | undefined, key: string) {
  const value = price?.[key];
  return typeof value === "number" ? value : null;
}

function normalizeSku(item: Record<string, unknown>): SquareSku {
  const price = (item.price ?? {}) as Record<string, unknown>;
  const sold = item.sold_out;
  const amount = typeof price.regular === "number" ? price.regular : typeof price.current === "number" ? price.current : 0;
  return {
    id: String(item.id),
    name: String(item.name ?? "Pack"),
    price: amount,
    soldOut: sold === true || sold === 1 || sold === "true",
    sku: item.sku ? String(item.sku) : null,
  };
}

function normalize(
  items: Record<string, unknown>[],
  categories: { id: string; site_category_id?: string | number; name: string }[],
): SquareProduct[] {
  const byId = new Map<string, string>();
  for (const category of categories) {
    byId.set(category.id, category.name);
    if (category.site_category_id != null) byId.set(String(category.site_category_id), category.name);
  }
  return items.map((item) => {
    const price = (item.price ?? {}) as Record<string, unknown>;
    const inventory = (item.inventory ?? {}) as Record<string, unknown>;
    const ids = (item.categoryIds as Array<string | number> | undefined) ?? [];
    const names: string[] = [];
    for (const id of ids) {
      const name = byId.get(String(id));
      if (name && !names.includes(name)) names.push(name);
    }
    const siteLink = String(item.absolute_site_link ?? "");
    const relative = String(item.site_link ?? "").replace(/^\//, "");
    return {
      id: String(item.id),
      siteProductId: String(item.site_product_id ?? ""),
      name: String(item.name ?? "Untitled"),
      description: stripHtml(String(item.short_description ?? item.seo_page_description ?? "")),
      priceLow: money(price, "low"),
      priceHigh: money(price, "high"),
      soldOut: Boolean(inventory.all_variations_sold_out),
      stock: typeof inventory.total === "number" ? inventory.total : null,
      url: siteLink || `${SQUARE.origin}/${relative}`,
      image: thumbUrl(item),
      categories: names,
    };
  });
}

async function squareGet(path: string) {
  const url = `${SQUARE.origin}/app/store/api/v28/editor/users/${SQUARE.siteUserId}/sites/${SQUARE.siteId}${path}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "HarrisInWonderland/1.0" },
  });
  if (!response.ok) throw new Error(`Square catalog ${response.status}`);
  return response.json() as Promise<{ data: unknown[]; meta?: { pagination?: { total_pages?: number } } }>;
}

async function loadSkus(productId: string): Promise<SquareSku[]> {
  const skus: SquareSku[] = [];
  for (let page = 1; page <= 4; page += 1) {
    const json = await squareGet(`/products/${productId}/skus?per_page=50&page=${page}`);
    for (const row of json.data ?? []) {
      skus.push(normalizeSku(row as Record<string, unknown>));
    }
    const pages = json.meta?.pagination?.total_pages ?? page;
    if (page >= pages) break;
  }
  return skus;
}

async function attachSkus(products: SquareProduct[]): Promise<SquareProduct[]> {
  const targets = products.filter(isFeeder);
  const loaded = await Promise.all(
    targets.map(async (product) => {
      try {
        const skus = await loadSkus(product.id);
        return [product.id, skus.length ? skus : (FALLBACK_SKUS[product.id] ?? [])] as const;
      } catch {
        return [product.id, FALLBACK_SKUS[product.id] ?? []] as const;
      }
    }),
  );
  const byId = new Map(loaded);
  return products.map((product) => {
    const skus = byId.get(product.id) ?? FALLBACK_SKUS[product.id];
    return skus?.length ? { ...product, skus } : product;
  });
}

async function loadLiveCatalog(): Promise<CatalogPayload> {
  const products: Record<string, unknown>[] = [];
  const categories: Array<{ id: string; site_category_id?: string | number; name: string }> = [];
  for (let page = 1; page <= 8; page += 1) {
    const json = await squareGet(`/products?per_page=100&page=${page}`);
    products.push(...((json.data ?? []) as Record<string, unknown>[]));
    const pages = json.meta?.pagination?.total_pages ?? page;
    if (page >= pages) break;
  }
  for (let page = 1; page <= 4; page += 1) {
    const json = await squareGet(`/categories?per_page=100&page=${page}`);
    categories.push(...((json.data ?? []) as typeof categories));
    const pages = json.meta?.pagination?.total_pages ?? page;
    if (page >= pages) break;
  }
  const normalized = normalize(products, categories);
  return {
    fetchedAt: new Date().toISOString(),
    live: true,
    products: await attachSkus(normalized),
    categories: categories.map((c) => ({
      id: c.id,
      siteCategoryId: String(c.site_category_id ?? ""),
      name: c.name,
    })),
  };
}

export const getSquareCatalog = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  try {
    const data = await loadLiveCatalog();
    cache = { at: Date.now(), data };
    return data;
  } catch {
    return FALLBACK;
  }
});

export const getSquarePayConfig = createServerFn({ method: "GET" }).handler(async () => {
  const applicationId = process.env.VITE_SQUARE_APPLICATION_ID ?? process.env.SQUARE_APPLICATION_ID ?? "";
  return {
    applicationId: applicationId || null,
    locationId: process.env.SQUARE_LOCATION_ID || SQUARE.locationId,
    canCharge: Boolean(process.env.SQUARE_ACCESS_TOKEN && applicationId),
    canLink: Boolean(process.env.SQUARE_ACCESS_TOKEN),
  };
});

const CheckoutInput = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      qty: z.number().int().positive(),
      url: z.string(),
      siteProductId: z.string(),
    }),
  ).min(1),
  buyer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
    note: z.string().optional(),
  }),
  returnUrl: z.string().url(),
  sourceId: z.string().optional(),
});

function cents(amount: number) {
  return Math.round(amount * 100);
}

export const startSquareCheckout = createServerFn({ method: "POST" })
  .validator(CheckoutInput)
  .handler(async ({ data }) => {
    const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const token = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID || SQUARE.locationId;
    const note = [
      `Pickup · Harris in Wonderland · ${data.buyer.name} · ${data.buyer.phone}`,
      data.buyer.note?.trim(),
      ...data.items.map((item) => `${item.qty}× ${item.name}`),
    ]
      .filter(Boolean)
      .join(" · ");

    if (token && data.sourceId) {
      const payment = await fetch("https://connect.squareup.com/v2/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Square-Version": "2025-01-23",
        },
        body: JSON.stringify({
          source_id: data.sourceId,
          idempotency_key: crypto.randomUUID(),
          amount_money: { amount: cents(total), currency: "USD" },
          location_id: locationId,
          buyer_email_address: data.buyer.email,
          note,
          autocomplete: true,
        }),
      });
      const json = (await payment.json()) as { payment?: { id?: string }; errors?: Array<{ detail?: string }> };
      if (!payment.ok) {
        throw new Error(json.errors?.[0]?.detail || "Square declined the card.");
      }
      return { mode: "charged" as const, paymentId: json.payment?.id ?? "ok", total };
    }

    if (token) {
      const link = await fetch("https://connect.squareup.com/v2/online-checkout/payment-links", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Square-Version": "2025-01-23",
        },
        body: JSON.stringify({
          idempotency_key: crypto.randomUUID(),
          order: {
            location_id: locationId,
            line_items: data.items.map((item) => ({
              name: item.name.slice(0, 120),
              quantity: String(item.qty),
              base_price_money: { amount: cents(item.price), currency: "USD" },
              note: "Canton pickup",
            })),
          },
          checkout_options: {
            redirect_url: data.returnUrl,
            ask_for_shipping_address: false,
          },
          pre_populate_data: {
            buyer_email: data.buyer.email,
          },
          description: note.slice(0, 500),
        }),
      });
      const json = (await link.json()) as {
        payment_link?: { url?: string; id?: string };
        errors?: Array<{ detail?: string }>;
      };
      if (!link.ok || !json.payment_link?.url) {
        throw new Error(json.errors?.[0]?.detail || "Square checkout could not start.");
      }
      return { mode: "payment-link" as const, url: json.payment_link.url, total };
    }

    return {
      mode: "square-online" as const,
      total,
      urls: data.items.map((item) => item.url),
    };
  });
