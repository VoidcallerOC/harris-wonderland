import { Link } from "@tanstack/react-router";
import {
  ANIMAL_ROOT_CATEGORIES,
  ANIMAL_TAXONOMY,
  animalCategory,
  speciesForCategory,
  type AnimalCategory,
} from "@/lib/species";
import { SpecimenCard } from "@/components/specimen-card";
import { cn } from "@/lib/utils";

function CategoryLink({
  category,
  active,
}: {
  category: AnimalCategory;
  active: boolean;
}) {
  return (
    <Link
      to="/collection/$category"
      params={{ category: category.slug }}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center border px-4 font-ui text-kicker font-bold uppercase tracking-kicker no-underline transition-colors duration-quick",
        active
          ? "border-brass bg-brass text-ticket-ink"
          : "border-border bg-card text-fg-soft hover:border-brass",
      )}
    >
      {category.name}
    </Link>
  );
}

export function AnimalBrowser({
  selectedSlug,
  selectedCategory,
}: {
  selectedSlug?: string;
  selectedCategory?: AnimalCategory;
}) {
  const selected = selectedCategory ?? animalCategory(selectedSlug);
  const list = speciesForCategory(selected);
  const showingAll = !selected;
  const rootsWithChildren = ANIMAL_ROOT_CATEGORIES.map((root) => ({
    root,
    children: ANIMAL_TAXONOMY.filter((category) => category.parentId === root.id),
  }));

  return (
    <section className="py-12 sm:py-16">
      <div className="wrap">
        <nav aria-label="Available animal categories" className="grid gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Link
              to="/collection"
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center border px-4 font-ui text-kicker font-bold uppercase tracking-kicker no-underline transition-colors duration-quick",
                showingAll
                  ? "border-brass bg-brass text-ticket-ink"
                  : "border-border bg-card text-fg-soft hover:border-brass",
              )}
            >
              All available animals
            </Link>
            {ANIMAL_ROOT_CATEGORIES.map((category) => (
              <CategoryLink key={category.id} category={category} active={selected?.id === category.id} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 border-l-2 border-brass pl-4">
            {rootsWithChildren.flatMap(({ children }) =>
              children.map((category) => (
                <CategoryLink key={category.id} category={category} active={selected?.id === category.id} />
              )),
            )}
          </div>
        </nav>

        {showingAll ? (
          <p className="mt-8 max-w-2xl text-fg-soft">
            Browse the full collection by animal family, then open a category to see the species we keep and recommend.
          </p>
        ) : (
          <div className="mt-8 max-w-2xl">
            <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">{selected.name}</p>
            <p className="mt-2 text-fg-soft">{selected.description}</p>
          </div>
        )}

        {list.length === 0 ? (
          <div className="mt-10 border border-dashed border-border bg-card p-6">
            <h2 className="font-display text-card italic text-ticket">
              {selected ? `${selected.name} are not on the floor right now.` : "The collection is being refreshed."}
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              This category is part of the shop’s planned collection, but there are no profile animals to display yet. Call ahead and we can tell you what is available or what we can order.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((species, index) => (
              <SpecimenCard key={species.id} species={species} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function categoryFromSlug(slug: string | undefined) {
  return animalCategory(slug);
}

export const availableAnimalCategorySlugs = ANIMAL_TAXONOMY.map((category) => category.slug);
