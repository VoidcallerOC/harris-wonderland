import { MARQUEE } from "@/lib/site";

export function SpeciesMarquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div
      className="max-w-full overflow-x-hidden border-y border-brass/40 bg-bg-2 text-ticket"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max gap-8 py-3">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 whitespace-nowrap font-ui text-sm font-bold uppercase tracking-kicker"
          >
            {item}
            <span className="text-brass">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
