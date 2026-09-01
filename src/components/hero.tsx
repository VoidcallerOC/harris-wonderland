import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kicker, Lede } from "@/components/type";
import { speciesById } from "@/lib/species";
import { cn } from "@/lib/utils";

type HeroFrame = {
  src: string;
  alt: string;
  caption: string;
  /** object-position override; the day gecko is framed off-center on the crop */
  position?: string;
};

// The looking glass fades between the animals on the floor. Day gecko first —
// it stays the poster — then a rotating cast of what Harris actually keeps.
const HERO_FRAMES: HeroFrame[] = [
  {
    src: "/images/hero.jpg",
    alt: speciesById("giant-day-gecko")!.alt,
    caption: "Giant day gecko · looking glass · Route 44",
    position: "object-[28%_48%] md:object-center",
  },
  {
    src: "/images/ball-python.jpg",
    alt: speciesById("ball-python")!.alt,
    caption: "Ball python · captive-bred · Route 44",
  },
  {
    src: "/images/case-lizards.jpg",
    alt: speciesById("frilled-lizard")!.alt,
    caption: "Frilled lizard · on the floor · Route 44",
    // Portrait shot, head up top-left — pull the crop up so the desktop
    // (wide) frame keeps the head instead of centering on the body.
    position: "object-[42%_18%]",
  },
  {
    src: "/images/redfoot.jpg",
    alt: speciesById("red-foot")!.alt,
    caption: "Red-foot tortoise · captive-bred · Route 44",
  },
  {
    src: "/images/case-amphibians.jpg",
    alt: speciesById("red-eyed")!.alt,
    caption: "Red-eyed tree frog · damp room · Route 44",
  },
];

const INTERVAL_MS = 6000;

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (HERO_FRAMES.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % HERO_FRAMES.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-bg md:min-h-[100svh]">
      <div className="relative h-[42svh] overflow-hidden sm:h-[50svh] md:absolute md:inset-0 md:h-full">
        {HERO_FRAMES.map((frame, i) => (
          <img
            key={frame.src}
            src={frame.src}
            alt={frame.alt}
            width={1600}
            height={1200}
            className={cn(
              "hero-ken absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-out-smooth motion-reduce:transition-none",
              frame.position ?? "object-center",
              i === active ? "opacity-100" : "opacity-0",
            )}
            fetchPriority={i === 0 ? "high" : "low"}
            loading={i === 0 ? "eager" : "lazy"}
            aria-hidden={i === active ? undefined : true}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,10,9,0.2)_0%,rgba(11,10,9,0.08)_40%,rgba(11,10,9,1)_100%)] md:bg-[linear-gradient(180deg,rgba(11,10,9,0.28)_0%,rgba(11,10,9,0.55)_42%,rgba(11,10,9,0.92)_100%)]" />
      </div>
      <div className="relative wrap flex flex-col justify-end gap-7 pb-12 pt-8 md:min-h-[100svh] md:gap-8 md:pb-16 md:pt-28">
        <div className="max-w-3xl">
          <Kicker>Connecticut reptile specialty shop</Kicker>
          <h1 className="mt-3 font-display text-display font-semibold italic leading-[0.88] tracking-display text-ticket">
            Harris
            <br />
            in <em className="text-brass">Wonderland</em>
          </h1>
          <p className="mt-4 font-ui text-kicker font-bold uppercase tracking-kicker text-fg-soft">
            Snakes, lizards, frogs · Canton, Connecticut
          </p>
          <Lede className="mt-5">
            Not a pet aisle. A working herp collection — snakes, lizards, frogs, and
            feeders — run by people who breed the animals and will talk you out of the
            wrong one.
          </Lede>
          <div className="mt-7 flex max-w-full flex-wrap gap-3">
            <Button asChild>
              <a href="#rack">
                <span className="sm:hidden">Shop the rack</span>
                <span className="hidden sm:inline">Shop the live rack</span>
                <ArrowRight className="hidden sm:block" />
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="#feeders">Shop feeders</a>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/visit">Visit the shop</Link>
            </Button>
          </div>
        </div>
        <p
          className="font-ui text-kicker font-bold uppercase tracking-kicker text-ticket/80 transition-opacity duration-500"
          aria-live="off"
        >
          {HERO_FRAMES[active].caption}
        </p>
      </div>
    </section>
  );
}
