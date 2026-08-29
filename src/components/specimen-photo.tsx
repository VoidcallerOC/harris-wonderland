import { cn } from "@/lib/utils";

export function SpecimenPhoto({
  src,
  alt,
  caption,
  className,
  imgClassName,
  eager = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  return (
    <figure className={cn("relative overflow-hidden bg-surface", className)}>
      <img
        src={src}
        alt={alt}
        width={1600}
        height={1200}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className={cn(
          "h-full w-full object-cover transition-transform duration-slow ease-out-smooth group-hover:scale-[1.04]",
          imgClassName,
        )}
      />
      {caption ? (
        <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 bg-ticket-ink/70 px-3 py-1.5 font-ui text-kicker font-bold uppercase tracking-kicker text-ticket">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
