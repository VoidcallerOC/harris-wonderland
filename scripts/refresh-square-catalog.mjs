#!/usr/bin/env node
// Refresh src/lib/square-catalog.json — the offline fallback the shop falls back
// to when the live Square storefront API is unreachable. Mirrors the normalizer
// in src/lib/square-api.ts so the fallback and the live payload stay identical.
//
//   node scripts/refresh-square-catalog.mjs
//   node scripts/refresh-square-catalog.mjs --from-dir ./dump
//
// --from-dir reads products-page-N.json / categories-page-N.json saved earlier,
// for machines that cannot reach my-hiwsite-6573.square.site directly.
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const SQUARE = {
  siteUserId: "131021369",
  siteId: "345841343946242319",
  origin: "https://my-hiwsite-6573.square.site",
};

const OUT = resolve(process.cwd(), "src/lib/square-catalog.json");
const args = process.argv.slice(2);
const fromDir = args.includes("--from-dir") ? args[args.indexOf("--from-dir") + 1] : null;

async function load(kind, page) {
  if (fromDir) {
    const path = resolve(fromDir, `${kind}-page-${page}.json`);
    try {
      return JSON.parse(await readFile(path, "utf8"));
    } catch (error) {
      if (page === 1) throw error;
      return { data: [], meta: { pagination: { total_pages: page - 1 } } };
    }
  }
  const url = `${SQUARE.origin}/app/store/api/v28/editor/users/${SQUARE.siteUserId}/sites/${SQUARE.siteId}/${kind}?per_page=100&page=${page}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "HarrisInWonderland/1.0" },
  });
  if (!response.ok) throw new Error(`Square ${kind} page ${page}: ${response.status}`);
  return response.json();
}

async function loadAll(kind, maxPages) {
  const rows = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const json = await load(kind, page);
    rows.push(...(json.data ?? []));
    const pages = json.meta?.pagination?.total_pages ?? page;
    if (page >= pages) break;
  }
  return rows;
}

function stripHtml(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function thumbUrl(item) {
  const data = item.thumbnail?.data;
  if (!data) return null;
  const urls = data.absolute_urls ?? data.urls ?? {};
  return urls["640"] ?? urls["320"] ?? data.absolute_url ?? data.url ?? null;
}

function money(price, key) {
  const value = price?.[key];
  return typeof value === "number" ? value : null;
}

function normalize(items, categories) {
  const byId = new Map();
  for (const category of categories) {
    byId.set(category.id, category.name);
    if (category.site_category_id != null) byId.set(String(category.site_category_id), category.name);
  }
  return items.map((item) => {
    const names = [];
    for (const id of item.categoryIds ?? []) {
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
      priceLow: money(item.price, "low"),
      priceHigh: money(item.price, "high"),
      soldOut: Boolean(item.inventory?.all_variations_sold_out),
      stock: typeof item.inventory?.total === "number" ? item.inventory.total : null,
      url: siteLink || `${SQUARE.origin}/${relative}`,
      image: thumbUrl(item),
      categories: names,
    };
  });
}

const rawProducts = await loadAll("products", 8);
const rawCategories = await loadAll("categories", 4);
const products = normalize(rawProducts, rawCategories);
const categories = rawCategories.map((category) => ({
  id: category.id,
  siteCategoryId: String(category.site_category_id ?? ""),
  name: category.name,
}));

const previous = JSON.parse(await readFile(OUT, "utf8"));
const before = new Map(previous.products.map((product) => [product.id, product]));
const newPhotos = products.filter((product) => product.image && product.image !== before.get(product.id)?.image);
const lostPhotos = products.filter((product) => !product.image && before.get(product.id)?.image);

await writeFile(OUT, `${JSON.stringify({ fetchedAt: new Date().toISOString(), products, categories })}\n`);

console.log(`products ${products.length} (was ${previous.products.length})`);
console.log(`with a Square photo ${products.filter((p) => p.image).length}`);
console.log(`new or changed photos ${newPhotos.length}`);
for (const product of newPhotos) console.log(`  + ${product.name}`);
for (const product of lostPhotos) console.log(`  - ${product.name} (photo removed upstream)`);
