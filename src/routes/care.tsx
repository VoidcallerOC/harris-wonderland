import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { CATEGORIES, SPECIES, filterSpecies, speciesById } from "@/lib/species";
import { essentialsFor } from "@/lib/essentials";
import { Button } from "@/components/ui/button";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Kicker, Display, Lede } from "@/components/type";
import { cn } from "@/lib/utils";
import { getSquareCatalog } from "@/lib/square-api";
import { formatMoney, productByName, productImage, type SquareProduct } from "@/lib/square";

type CareSearch = { id?: string };

export const Route = createFileRoute("/care")({
  validateSearch: (search: Record<string, unknown>): CareSearch => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  loader: () => getSquareCatalog(),
  component: CarePage,
  head: ({ match }) => {
    const id = (match.search as { id?: string }).id;
    const species = speciesById(id);
    if (species) {
      return pageHead({
        title: `${species.name} care sheet — Harris in Wonderland`,
        description: `Husbandry notes for ${species.name} (${species.latin}) at Harris in Wonderland in Canton, CT.`,
        path: `/care?id=${species.id}`,
      });
    }
    return pageHead({
      title: "Care sheets — Harris in Wonderland",
      description:
        "Husbandry notes for the animals Harris in Wonderland actually sells. The sheet matches the animal on the rack.",
      path: "/care",
    });
  },
});
