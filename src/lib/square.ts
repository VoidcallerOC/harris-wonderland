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

export function isAnimal(product: SquareProduct) {
  const blob = `${product.name} ${product.categories.join(" ")}`.toLowerCase();
  return ANIMAL_CATS.some((c) => blob.includes(c));
}

export function matchesFilter(product: SquareProduct, filter: ShopFilter) {
  if (filter === "all") return true;
  const cats = product.categories.join(" ").toLowerCase();
  const name = product.name.toLowerCase();
  if (filter === "animals") return isAnimal(product);
  if (filter === "pythons") {
    return cats.includes("python") || name.includes("python") || cats.includes("boa") || name.startsWith("boa");
  }
  if (filter === "colubrids") {
    return (
      cats.includes("corn") ||
      cats.includes("king") ||
      cats.includes("milk") ||
      cats.includes("hognose") ||
      name.includes("corn") ||
      name.includes("hognose") ||
      name.includes("king") ||
      name.includes("milk")
    );
  }
  if (filter === "feeders") {
    return cats.includes("feeder") || name.includes("mealworm") || name.includes("dubia") || name.includes("mice") || name.includes("feeder");
  }
  return !isAnimal(product) && !cats.includes("feeder");
}

export function canBuy(product: SquareProduct) {
  return !product.soldOut && (product.priceLow ?? 0) > 0;
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

export function productImage(product: SquareProduct) {
  if (product.image) return product.image;
  const blob = `${product.name} ${product.categories.join(" ")}`.toLowerCase();
  if (blob.includes("hognose")) return "/images/hognose.jpg";
  if (blob.includes("corn")) return "/images/corn-snake.jpg";
  if (blob.includes("gecko") || blob.includes("lizard")) return "/images/case-lizards.jpg";
  if (blob.includes("frog") || blob.includes("amphib")) return "/images/case-amphibians.jpg";
  if (blob.includes("python") || blob.includes("boa") || blob.includes("snake") || blob.includes("king") || blob.includes("milk")) {
    return "/images/case-snakes.jpg";
  }
  if (blob.includes("feeder") || blob.includes("mice") || blob.includes("mealworm")) return "/images/case-snakes.jpg";
  return "/images/hero.jpg";
}

export const SQUARE = {
  merchantId: "DS6T9M4TDWYFT",
  locationId: "3DKC91D1D0V6X",
  siteUserId: "131021369",
  siteId: "345841343946242319",
  origin: "https://my-hiwsite-6573.square.site",
} as const;
