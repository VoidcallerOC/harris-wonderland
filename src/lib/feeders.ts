import fallbackSkus from "./feeder-skus.json";
import {
  isFeeder,
  skuAvailable,
  type CatalogPayload,
  type SquareProduct,
  type SquareSku,
} from "./square";

const FALLBACK_SKUS = fallbackSkus as Record<string, SquareSku[]>;

export const FEEDER_META: Record<
  string,
  { title: string; kicker: string; blurb: string; image: string }
> = {
  NCZP6JAR7E7UZE7IQ6ZMV357: {
    title: "Frozen mice",
    kicker: "The freezer",
    blurb: "Pinkie through XL. They stay frozen until you walk in. Size the animal first.",
    image: "/images/feeders/mice.jpg",
  },
  "4KPAKESFYTW3NAYIIFLHERIP": {
    title: "Mealworms",
    kicker: "Live insects",
    blurb: "Singles through a thousand. Regulars grab a cup even when they are not adding an animal.",
    image: "/images/feeders/mealworms.jpg",
  },
  JC7KV4KHP7557QKHATN2DMFL: {
    title: "Dubia roaches",
    kicker: "Live insects",
    blurb: "Small, medium, large. Count the mouths at home before you count the cup.",
    image: "/images/feeders/dubia.jpg",
  },
  OK2OBCBVRRG5M63I5PYZ77BY: {
    title: "Other feeders",
    kicker: "The locker",
    blurb: "Hornworms, silkworms, waxworms, fruit flies, soldier flies, earthworms. The weird stuff.",
    image: "/images/feeders/other.jpg",
  },
  AJZSCHT6YV333TU6HCDOOQBU: {
    title: "Frozen mammals",
    kicker: "The freezer",
    blurb: "Rabbits, guinea pigs, chicks, and quail. Call if the size on the ticket is wrong.",
    image: "/images/feeders/mammals.jpg",
  },
};

const FAMILY_ORDER = [
  "NCZP6JAR7E7UZE7IQ6ZMV357",
  "4KPAKESFYTW3NAYIIFLHERIP",
  "JC7KV4KHP7557QKHATN2DMFL",
  "OK2OBCBVRRG5M63I5PYZ77BY",
  "AJZSCHT6YV333TU6HCDOOQBU",
];

export function withFeederSkus(products: SquareProduct[]): SquareProduct[] {
  return products.map((product) => {
    if (product.skus?.length) return product;
    const fallback = FALLBACK_SKUS[product.id];
    return fallback ? { ...product, skus: fallback } : product;
  });
}

export function feederFamilies(catalog: CatalogPayload): SquareProduct[] {
  const byId = new Map(catalog.products.map((product) => [product.id, product]));
  const ordered = FAMILY_ORDER.map((id) => byId.get(id)).filter((product): product is SquareProduct => Boolean(product));
  const extras = catalog.products.filter(
    (product) => isFeeder(product) && !FAMILY_ORDER.includes(product.id),
  );
  return [...ordered, ...extras].map((product) => {
    const fallback = FALLBACK_SKUS[product.id];
    return product.skus?.length ? product : fallback ? { ...product, skus: fallback } : product;
  });
}

export function familyMeta(product: SquareProduct) {
  return (
    FEEDER_META[product.id] ?? {
      title: product.name,
      kicker: "Feeders",
      blurb: product.description || "Pickup at 364 Albany Turnpike. Nothing ships.",
      image: "/images/feeders/other.jpg",
    }
  );
}

export function availablePacks(product: SquareProduct) {
  return (product.skus ?? []).filter(skuAvailable);
}
