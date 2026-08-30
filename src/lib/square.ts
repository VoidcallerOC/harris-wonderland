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

export type ShopFilter =
  | "animals"
  | "pythons"
  | "colubrids"
  | "feeders"
  | "supplies"
  | "all";

export const SHOP_FILTERS: { id: ShopFilter; label: string }[] = [
  { id: "animals", label: "On the rack" },
  { id: "pythons", label: "Pythons" },
  { id: "colubrids", label: "Colubrids" },
  { id: "feeders", label: "Feeders" },
  { id: "supplies", label: "Husbandry" },
  { id: "all", label: "Everything" },
];

const ANIMAL_CATS = [
  "available animals",
  "ball pythons",
  "burmese pythons",
  "boas",
  "hognose",
  "geckos",
  "corn and rat snakes",
  "kingsnakes",
  "milksnakes",
  "colubrids",
];

function blobOf(product: SquareProduct) {
  return `${product.name} ${product.categories.join(" ")}`.toLowerCase();
}

function hasWord(haystack: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, "i").test(haystack);
}

export function isAnimal(product: SquareProduct) {
  const blob = blobOf(product);
  if (ANIMAL_CATS.some((c) => blob.includes(c))) return true;
  const n = product.name.toLowerCase();
  return (
    n.includes("ball python") ||
    n.includes("burmese") ||
    hasWord(n, "boa") ||
    n.includes("hognose") ||
    n.includes("kingsnake") ||
    n.includes("milksnake") ||
    n.includes("milk snake") ||
    n.includes("corn snake") ||
    n.includes("rat snake") ||
    n.includes("gecko")
  );
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

export function matchesFilter(product: SquareProduct, filter: ShopFilter) {
  if (filter === "all") return true;
  const cats = product.categories.join(" ").toLowerCase();
  const name = product.name.toLowerCase();
  if (filter === "animals") return isAnimal(product);
  if (filter === "pythons") {
    if (!isAnimal(product)) return false;
    return cats.includes("python") || name.includes("python") || cats.includes("boa") || name.startsWith("boa");
  }
  if (filter === "colubrids") return isColubrid(product);
  if (filter === "feeders") return isFeeder(product);
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

const BALL_PYTHON_MORPH_PHOTOS: { test: RegExp; src: string }[] = [
  { test: /banana.*enchi.*pied|banana.*pied/i, src: "/images/morphs/banana-enchi-pied.jpg" },
  { test: /pastel.*clown.*super\s*enchi|super\s*enchi.*clown/i, src: "/images/morphs/pastel-clown-super-enchi.jpg" },
  { test: /coral\s*glow/i, src: "/images/morphs/coral-glow-specter-yb.jpg" },
  { test: /leopard.*pinstripe|pinstripe.*leopard/i, src: "/images/morphs/leopard-pinstripe-clean.jpg" },
  { test: /blackhead|black\s*head/i, src: "/images/morphs/blackhead-mojave.jpg" },
  { test: /fire.*calico|calico.*fire/i, src: "/images/morphs/fire-calico.jpg" },
  { test: /fire.*yellow\s*belly|yellow\s*belly.*fire/i, src: "/images/morphs/fire-yellowbelly.jpg" },
  { test: /orange\s*dream.*enchi|enchi.*orange\s*dream/i, src: "/images/morphs/orange-dream-enchi.jpg" },
  { test: /mojave.*yellow\s*belly|yellow\s*belly.*mojave/i, src: "/images/morphs/mojave-yellowbelly.jpg" },
  { test: /\bpastel\b/i, src: "/images/morphs/pastel.jpg" },
];

function ballPythonMorphPhoto(name: string) {
  const rest = name.replace(/^ball\s*python\s*[-–]\s*\d+\s*/i, "").trim();
  if (!rest) return null;
  for (const row of BALL_PYTHON_MORPH_PHOTOS) {
    if (row.test.test(rest)) return row.src;
  }
  return null;
}

function pickBurmesePhoto(text: string) {
  if (/(?<!(?:het|heterozygous)(?:\s+for)?\s+)\balbino\b/.test(text) || /\bpearl\b/.test(text)) {
    return "/images/morphs/burmese-albino.jpg";
  }
  if (/\bhypo\b/.test(text)) return "/images/morphs/burmese-hypo.jpg";
  if (/\bnormal\b/.test(text)) return "/images/morphs/burmese-normal.jpg";
  return null;
}

function burmeseMorphPhoto(product: SquareProduct) {
  const named = product.name.replace(/^burmese\s*python\s*[-–]\s*\d+\s*/i, "").trim().toLowerCase();
  return (
    pickBurmesePhoto(named) ??
    pickBurmesePhoto(stripHtml(product.description).toLowerCase()) ??
    "/images/morphs/burmese-normal.jpg"
  );
}

function supplyImage(product: SquareProduct) {
  const blob = blobOf(product);
  if (blob.includes("vine")) return "/images/supplies/enclosure.jpg";
  if (
    blob.includes("uvb") ||
    blob.includes("bulb") ||
    blob.includes("lamp") ||
    blob.includes("halogen") ||
    blob.includes("led") ||
    blob.includes("hood") ||
    blob.includes("basking") ||
    blob.includes("sun")
  ) {
    return "/images/supplies/bulbs.jpg";
  }
  if (blob.includes("heat") || blob.includes("ceramic") || blob.includes("emitter") || blob.includes("thermostat")) {
    return "/images/supplies/heat.jpg";
  }
  if (blob.includes("reptibark") || (blob.includes("bark") && !blob.includes("forest"))) {
    return "/images/supplies/reptibark.jpg";
  }
  if (blob.includes("aspen")) return "/images/supplies/aspen.jpg";
  if (blob.includes("eco earth") || /\bearth\b/.test(blob)) return "/images/supplies/eco-earth.jpg";
  if (blob.includes("frog moss")) return "/images/supplies/frog-moss.jpg";
  if (blob.includes("sphagnum") || blob.includes("moss")) return "/images/supplies/sphagnum.jpg";
  if (blob.includes("soil")) return "/images/supplies/reptisoil.jpg";
  if (blob.includes("husk") || blob.includes("coco")) return "/images/supplies/coco-husk.jpg";
  if (blob.includes("forest") || blob.includes("cypress") || blob.includes("bedding") || blob.includes("substrate")) {
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

export function productImage(product: SquareProduct) {
  if (isFeeder(product)) {
    const blob = product.name.toLowerCase();
    if (blob.includes("mealworm")) return "/images/feeders/mealworms.jpg";
    if (blob.includes("dubia")) return "/images/feeders/dubia.jpg";
    if (blob.includes("mice")) return "/images/feeders/mice.jpg";
    if (blob.includes("rabbit") || blob.includes("guinea")) return "/images/feeders/mammals.jpg";
    return "/images/feeders/other.jpg";
  }
  const raw = product.image;
  const reptibarkOnWrongSku =
    Boolean(raw?.includes(REPTIBARK_STOCK)) && !product.name.toLowerCase().includes("reptibark");
  if (raw && !reptibarkOnWrongSku) return raw;
  if (!isAnimal(product)) return supplyImage(product);
  const morph = ballPythonMorphPhoto(product.name);
  if (morph) return morph;
  const blob = blobOf(product);
  if (blob.includes("hognose")) return "/images/hognose.jpg";
  if (blob.includes("corn") || blob.includes("rat snake")) return "/images/corn-snake.jpg";
  if (blob.includes("gecko")) return "/images/hero.jpg";
  if (blob.includes("lizard")) return "/images/case-lizards.jpg";
  if (blob.includes("frog") || blob.includes("amphib")) return "/images/case-amphibians.jpg";
  if (blob.includes("milk")) return "/images/milk-snake.jpg";
  if (blob.includes("kingsnake") || blob.includes("king snake")) return "/images/kingsnake.jpg";
  if (blob.includes("burmese") || (blob.includes("python") && !blob.includes("ball"))) {
    return burmeseMorphPhoto(product);
  }
  if (blob.includes("dumeril")) return "/images/dumerils-boa.jpg";
  if (hasWord(blob, "boa")) return "/images/boa.jpg";
  if (blob.includes("ball python")) return "/images/ball-python.jpg";
  if (blob.includes("snake")) return "/images/corn-snake.jpg";
  return "/images/ball-python.jpg";
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
