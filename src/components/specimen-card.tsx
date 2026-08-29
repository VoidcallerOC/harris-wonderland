import { Link } from "@tanstack/react-router";
import type { Species } from "@/lib/species";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Kicker } from "@/components/type";

export function SpecimenCard({
  species,
  index,
}: {
  species: Species;
  index?: number;
}) {
  return (
    <Link
      to="/care"
      search={{ id: species.id }}
      className="group block border border-border bg-card no-underline transition-[border-color,box-shadow] duration-fast ease-out-smooth hover:border-brass hover:shadow-[8px_8px_0_0_color-mix(in_oklab,var(--color-brass)_40%,transparent)]"
    >
      <SpecimenPhoto
        src={species.image}
        alt={species.alt}
        caption={species.floor ? `${species.name} · on the floor` : species.name}
        className="aspect-[4/3]"
      />
      <div className="p-4">
        <Kicker>
          {index != null ? `Case ${String(index + 1).padStart(2, "0")} · ` : null}
          {species.category}
          {species.beginner ? " · first animal" : null}
        </Kicker>
        <h3 className="mt-1 font-display text-card font-semibold italic text-ticket">
          {species.name}
        </h3>
        <p className="mt-1 font-display text-sm italic text-muted-foreground">{species.latin}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{species.blurb}</p>
      </div>
    </Link>
  );
}
