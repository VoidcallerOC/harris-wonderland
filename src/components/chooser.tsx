import { Link } from "@tanstack/react-router";
import { CHOOSER } from "@/lib/species";
import { Kicker } from "@/components/type";

export function BeginnerChooser() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CHOOSER.map((card) => (
        <Link
          key={card.id}
          to="/care"
          search={{ id: card.speciesId }}
          className="group block border border-border bg-card p-5 no-underline transition-[border-color,transform] duration-fast ease-out-smooth hover:border-brass"
        >
          <Kicker>{card.role}</Kicker>
          <h3 className="mt-2 font-display text-card font-semibold italic text-ticket">
            {card.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
          <p className="mt-4 font-ui text-kicker font-bold uppercase tracking-kicker text-brass">
            Open the sheet
          </p>
        </Link>
      ))}
    </div>
  );
}
