export type MammalAvailability = "available" | "upcoming" | "preorder" | "on-hold" | "sold";

export type MammalListing = {
  id: string;
  category: "sugar-gliders";
  name: string;
  morph: string;
  availability: MammalAvailability;
  fullPrice: number;
  depositPercent?: 50;
  image: string;
  alt: string;
  summary: string;
  careNote: string;
};

export const MAMMAL_AVAILABILITY: Record<MammalAvailability, { label: string; tone: string; action: string }> = {
  available: { label: "Available", tone: "bg-moss text-ticket-ink", action: "Ask about taking home" },
  upcoming: { label: "Upcoming", tone: "bg-brass text-ticket-ink", action: "Call for timing" },
  preorder: { label: "Preorder", tone: "bg-ember text-ticket", action: "Ask about preorder" },
  "on-hold": { label: "On Hold", tone: "bg-ticket-ink/15 text-ticket", action: "Ask about the waitlist" },
  sold: { label: "Sold", tone: "bg-ticket-ink/10 text-muted-foreground", action: "Ask what is next" },
};

export const SUGAR_GLIDERS: MammalListing[] = [
  {
    id: "sugar-glider-available",
    category: "sugar-gliders",
    name: "Sugar glider",
    morph: "Well-started companion",
    availability: "available",
    fullPrice: 495,
    depositPercent: 50,
    image: "/images/sugar-glider.jpg",
    alt: "Sugar glider perched on a natural branch",
    summary: "A social, nocturnal marsupial for a keeper ready to build the habitat first.",
    careNote: "Plan on a compatible companion, a tall enriched enclosure, and a species-appropriate diet before pickup.",
  },
  {
    id: "sugar-glider-upcoming",
    category: "sugar-gliders",
    name: "Sugar glider joey",
    morph: "Upcoming litter",
    availability: "upcoming",
    fullPrice: 595,
    depositPercent: 50,
    image: "/images/sugar-glider.jpg",
    alt: "Sugar glider looking toward the camera",
    summary: "A future youngster; timing and readiness come before a firm pickup date.",
    careNote: "Call the shop for expected timing, pairing guidance, and the enclosure checklist.",
  },
  {
    id: "sugar-glider-preorder",
    category: "sugar-gliders",
    name: "Sugar glider pair",
    morph: "Preorder interest",
    availability: "preorder",
    fullPrice: 895,
    depositPercent: 50,
    image: "/images/sugar-glider.jpg",
    alt: "Sugar glider in warm habitat lighting",
    summary: "Tell us what you are building and we will discuss the right pair and timeline.",
    careNote: "Submit a request with your setup questions; the shop will review the right pair and timeline with you.",
  },
  {
    id: "sugar-glider-hold",
    category: "sugar-gliders",
    name: "Sugar glider",
    morph: "Standard grey",
    availability: "on-hold",
    fullPrice: 495,
    depositPercent: 50,
    image: "/images/sugar-glider.jpg",
    alt: "Sugar glider on a branch in a planted habitat",
    summary: "Currently spoken for while the keeper finishes the setup.",
    careNote: "Call to ask whether the hold changes or to discuss the next available animal.",
  },
  {
    id: "sugar-glider-sold",
    category: "sugar-gliders",
    name: "Sugar glider",
    morph: "Recently placed",
    availability: "sold",
    fullPrice: 495,
    image: "/images/sugar-glider.jpg",
    alt: "Sugar glider resting on a natural branch",
    summary: "Already placed with a prepared keeper; shown here so availability is honest.",
    careNote: "Availability changes. Call before driving for a specific animal.",
  },
];

export function formatMammalPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function mammalDeposit(listing: MammalListing) {
  return listing.depositPercent ? listing.fullPrice * (listing.depositPercent / 100) : null;
}
