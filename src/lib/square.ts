export type SquareSku = {
  id: string;
  name: string;
  price: number;
  soldOut: boolean;
  sku: string | null;
};

export type SquareProduct = {
  id: string;
  siteProductId: string;
  name: string;
  description: string;
  priceLow: number | null;
  priceHigh: number | null;
  soldOut: boolean;
  stock: number | null;
  url: string;
  image: string | null;
  categories: string[];
  skus?: SquareSku[];
};

export type SquareCategory = {
  id: string;
  siteCategoryId: string;
  name: string;
};

export type CatalogPayload = {
  fetchedAt: string;
  live: boolean;
  products: SquareProduct[];
  categories: SquareCategory[];
};

import { ANIMAL_ROOT_CATEGORIES, ANIMAL_TAXONOMY, type AnimalCategoryId } from "@/lib/species";

export type ShopFilter =
  "animals" | "pythons" | "colubrids" | "feeders" | "supplies" | "all" | AnimalCategoryId;

export const SHOP_FILTERS: { id: ShopFilter; label: string }[] = [
  { id: "animals", label: "Available animals" },
  ...ANIMAL_ROOT_CATEGORIES.map((category) => ({ id: category.id, label: category.name })),
  { id: "pythons", label: "Pythons" },
  { id: "colubrids", label: "Colubrids (Snakes)" },
  { id: "feeders", label: "Feeders" },
  { id: "supplies", label: "Husbandry" },
  { id: "all", label: "Everything" },
];

export function displayCategoryName(name: string) {
  if (name.toLowerCase() === "other colubrids") return "Other Colubrids (Snakes)";
  if (name.toLowerCase() === "colubrids") return "Colubrids (Snakes)";
  return name;
}

function blobOf(product: SquareProduct) {
  return `${product.name} ${product.categories.join(" ")}`.toLowerCase();
}

function hasWord(haystack: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, "i").test(haystack);
}

export function isAnimal(product: SquareProduct) {
  return Boolean(inventoryCategory(product));
}

export function isFeeder(product: SquareProduct) {
  const blob = blobOf(product);
  if (blob.includes("rat snake") || blob.includes("texas rat")) return false;
  return (
    blob.includes("feeder") ||
    blob.includes("mealworm") ||
    blob.includes("dubia") ||
    blob.includes("frozen mice") ||
    blob.includes("rabbits/guineas") ||
    blob.includes("waxworm") ||
    blob.includes("hornworm") ||
    blob.includes("silkworm") ||
    blob.includes("cricket")
  );
}

export function isColubrid(product: SquareProduct) {
  if (!isAnimal(product)) return false;
  const blob = blobOf(product);
  if (blob.includes("python") || hasWord(blob, "boa") || blob.includes("gecko")) return false;
  return (
    blob.includes("corn") ||
    blob.includes("kingsnake") ||
    blob.includes("king snake") ||
    blob.includes("milksnake") ||
    blob.includes("milk snake") ||
    hasWord(blob, "milk") ||
    blob.includes("hognose") ||
    blob.includes("colubrid") ||
    blob.includes("rat snake")
  );
}

function categoryDepth(category: AnimalCategoryId) {
  let depth = 0;
  let current = ANIMAL_TAXONOMY.find((item) => item.id === category);
  while (current?.parentId) {
    depth += 1;
    current = ANIMAL_TAXONOMY.find((item) => item.id === current?.parentId);
  }
  return depth;
}

export function inventoryCategory(product: SquareProduct): AnimalCategoryId | undefined {
  if (isFeeder(product)) return undefined;
  const blob = blobOf(product);
  if (
    blob.includes("diet") ||
    blob.includes("pangea") ||
    blob.includes("repashy") ||
    blob.includes("vitamin") ||
    blob.includes("supplement")
  ) {
    return undefined;
  }
  return ANIMAL_TAXONOMY.filter((category) =>
    category.inventoryKeywords?.some((keyword) => blob.includes(keyword)),
  ).sort((a, b) => categoryDepth(b.id) - categoryDepth(a.id))[0]?.id;
}

function belongsToCategory(product: SquareProduct, categoryId: AnimalCategoryId) {
  const matched = inventoryCategory(product);
  if (!matched) return false;
  let current = ANIMAL_TAXONOMY.find((category) => category.id === matched);
  while (current) {
    if (current.id === categoryId) return true;
    current = current.parentId
      ? ANIMAL_TAXONOMY.find((category) => category.id === current?.parentId)
      : undefined;
  }
  return false;
}

export function isPlaceholderName(name: string) {
  const n = name.trim();
  return !n || /^\d+$/.test(n) || /^sku[:\s-]/i.test(n);
}

export function isUnavailableAnimal(product: SquareProduct) {
  return /\bdragons?\b|white['’]s\b/i.test(`${product.name} ${product.description} ${product.categories.join(" ")}`);
}

export function isListableProduct(product: SquareProduct) {
  if (isUnavailableAnimal(product)) return false;
  if (isPlaceholderName(product.name)) return false;
  return true;
}

export function matchesFilter(product: SquareProduct, filter: ShopFilter) {
  if (!isListableProduct(product)) return false;
  if (filter === "all") return true;
  const cats = product.categories.join(" ").toLowerCase();
  const name = product.name.toLowerCase();
  if (filter === "animals") return isAnimal(product);
  if (filter === "pythons") {
    if (!isAnimal(product)) return false;
    return (
      cats.includes("python") ||
      name.includes("python") ||
      cats.includes("boa") ||
      name.startsWith("boa")
    );
  }
  if (filter === "colubrids") return isColubrid(product);
  if (filter === "feeders") return isFeeder(product);
  if (ANIMAL_TAXONOMY.some((category) => category.id === filter))
    return belongsToCategory(product, filter as AnimalCategoryId);
  return !isAnimal(product) && !isFeeder(product);
}

export function skuAvailable(sku: SquareSku) {
  return !sku.soldOut && sku.price > 0;
}

export function canBuy(product: SquareProduct) {
  if (product.skus?.length) return product.skus.some(skuAvailable);
  return !product.soldOut && (product.priceLow ?? 0) > 0;
}

export function defaultSku(product: SquareProduct): SquareSku | undefined {
  const available = (product.skus ?? []).filter(skuAvailable);
  const mid = available.find((sku) => sku.price >= 2 && sku.price <= 8);
  if (mid) return mid;
  return [...available].sort((a, b) => a.price - b.price)[0];
}

export function formatMoney(amount: number | null | undefined) {
  if (amount == null || Number.isNaN(amount)) return "Ask the shop";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function priceLabel(product: SquareProduct) {
  const low = product.priceLow ?? 0;
  const high = product.priceHigh ?? low;
  if (low <= 0 && high <= 0) return "Ask the shop";
  if (high > low + 0.009) return `From ${formatMoney(low)}`;
  return formatMoney(low);
}

export function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/"/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function publicDescription(product: SquareProduct) {
  const raw = stripHtml(product.description);
  if (!raw) return "";
  const title = product.name.toLowerCase();
  const titleMale = /\bmale\b/.test(title);
  const titleFemale = /\bfemale\b/.test(title);
  if (titleMale && /\bfemale\b/.test(raw.toLowerCase()) && !titleFemale) {
    return raw.replace(/\bfemale\b/gi, "male");
  }
  if (titleFemale && /\bmale\b/.test(raw.toLowerCase()) && !titleMale) {
    return raw.replace(/\bmale\b/gi, "female");
  }
  return raw;
}

export function splitProductName(name: string) {
  const match = name.match(
    /^(Ball [Pp]ython|Burmese Python|Corn Snake|Rat Snake|Kingsnake|Milk Snake|Milksnake|Hognose|Boa|Gargoyle Gecko)\s*[-–]\s*(.*)$/,
  );
  if (!match) return { kind: null as string | null, title: name };
  const rest = match[2].replace(/^\d+\s*/, "").trim() || match[2].trim();
  return { kind: match[1], title: rest };
}

export function packLabel(product: SquareProduct, sku: SquareSku) {
  const n = sku.name.trim();
  if (/^\d+$/.test(n)) return `${n} count`;
  if (product.name === "Rabbits/Guineas" && /^\d/.test(n)) return `Rabbit ${n}`;
  if (/^single mealworm$/i.test(n)) return "Single";
  const mouse = n.match(/^Frozen Mouse\s+(.+)/i);
  if (mouse) return mouse[1];
  const dubia = n.match(/^(\d+)\s+(Small|Medium|Large)\s+Dubia/i);
  if (dubia) return `${dubia[1]} ${dubia[2].toLowerCase()}`;
  return n;
}

export function skuCartName(product: SquareProduct, sku: SquareSku) {
  const n = sku.name.trim();
  if (/^\d+$/.test(n)) return `${product.name} · ${n} count`;
  if (product.name === "Rabbits/Guineas" && /^\d/.test(n)) return `Frozen rabbit ${n}`;
  if (n.toLowerCase().includes(product.name.split(/[\s/]/)[0]!.toLowerCase())) return n;
  if (n.length <= 12) return `${product.name} · ${n}`;
  return n;
}

function supplyImage(product: SquareProduct) {
  const blob = blobOf(product);
  if (blob.includes("vine")) return "/images/supplies/enclosure.jpg";
  if (blob.includes("jungle dawn") || (blob.includes("led") && blob.includes("bar"))) {
    return "/images/supplies/jungle-dawn.jpg";
  }
  if (blob.includes("powersun") || blob.includes("mercury")) return "/images/supplies/powersun.jpg";
  if (blob.includes("hood")) return "/images/supplies/t5-hood.jpg";
  if (blob.includes("basking")) return "/images/supplies/basking.jpg";
  if (blob.includes("daylight")) return "/images/supplies/daylight-blue.jpg";
  if (blob.includes("t5") && blob.includes("5.0")) return "/images/supplies/t5-5.jpg";
  if (blob.includes("t8") || (blob.includes("10.0") && blob.includes("uvb")))
    return "/images/supplies/t8-10.jpg";
  if (blob.includes("ceramic") || blob.includes("emitter")) return "/images/supplies/ceramic.jpg";
  if (blob.includes("heat mat") || blob.includes("heat pad"))
    return "/images/supplies/heat-mat.jpg";
  if (blob.includes("thermostat")) return "/images/supplies/heat.jpg";
  if (
    blob.includes("uvb") ||
    blob.includes("bulb") ||
    blob.includes("lamp") ||
    blob.includes("halogen") ||
    blob.includes("led") ||
    blob.includes("sun")
  ) {
    return "/images/supplies/basking.jpg";
  }
  if (blob.includes("heat")) return "/images/supplies/heat.jpg";
  if (blob.includes("reptibark") || (blob.includes("bark") && !blob.includes("forest"))) {
    return "/images/supplies/reptibark.jpg";
  }
  if (blob.includes("aspen")) return "/images/supplies/aspen.jpg";
  if (blob.includes("eco earth") || /\bearth\b/.test(blob)) return "/images/supplies/eco-earth.jpg";
  if (blob.includes("frog moss")) return "/images/supplies/frog-moss.jpg";
  if (blob.includes("sphagnum") || blob.includes("moss")) return "/images/supplies/sphagnum.jpg";
  if (blob.includes("soil")) return "/images/supplies/reptisoil.jpg";
  if (blob.includes("husk") || blob.includes("coco")) return "/images/supplies/coco-husk.jpg";
  if (
    blob.includes("forest") ||
    blob.includes("cypress") ||
    blob.includes("bedding") ||
    blob.includes("substrate")
  ) {
    return "/images/supplies/forest-floor.jpg";
  }
  if (
    blob.includes("diet") ||
    blob.includes("hpw") ||
    blob.includes("pangea") ||
    blob.includes("repashy") ||
    blob.includes("vitamin") ||
    blob.includes("supplement")
  ) {
    return "/images/supplies/diet.jpg";
  }
  if (blob.includes("terrarium") || blob.includes("equipment")) {
    return "/images/supplies/enclosure.jpg";
  }
  return "/images/supplies/enclosure.jpg";
}

const REPTIBARK_STOCK = "G4MYJQAAS2TX5NRSUGF7L5HQ";
export const STOCK_ANIMAL_PLACEHOLDER = "/images/animal-image-placeholder.png";

function isHusbandryProduct(product: SquareProduct) {
  const blob = blobOf(product);
  return [
    "bedding",
    "substrate",
    "diet",
    "bulb",
    "lamp",
    "terrarium",
    "cage",
    "equipment",
    "moss",
    "aspen",
    "heat mat",
    "thermostat",
  ].some((term) => blob.includes(term));
}

function hasUsableSquareImage(product: SquareProduct) {
  return (
    Boolean(product.image) &&
    !(product.image?.includes(REPTIBARK_STOCK) && !product.name.toLowerCase().includes("reptibark"))
  );
}

export function usesStockAnimalPlaceholder(product: SquareProduct) {
  return !hasUsableSquareImage(product) && isAnimal(product) && !isHusbandryProduct(product);
}

export function productImage(product: SquareProduct) {
  if (isFeeder(product)) {
    const blob = product.name.toLowerCase();
    if (blob.includes("mealworm")) return "/images/feeders/mealworms.jpg";
    if (blob.includes("dubia")) return "/images/feeders/dubia.jpg";
    if (blob.includes("mice")) return "/images/feeders/mice.jpg";
    if (blob.includes("rabbit") || blob.includes("guinea")) return "/images/feeders/mammals.jpg";
    return "/images/feeders/other.jpg";
  }
  if (hasUsableSquareImage(product)) return product.image!;
  if (usesStockAnimalPlaceholder(product)) return STOCK_ANIMAL_PLACEHOLDER;
  return supplyImage(product);
}

export function productByName(products: SquareProduct[], name: string) {
  const needle = name.toLowerCase();
  return products.find((product) => product.name.toLowerCase() === needle);
}

export const SQUARE = {
  merchantId: "DS6T9M4TDWYFT",
  locationId: "3DKC91D1D0V6X",
  siteUserId: "131021369",
  siteId: "345841343946242319",
  origin: "https://my-hiwsite-6573.square.site",
} as const;
