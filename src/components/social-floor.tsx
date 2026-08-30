import { SITE } from "@/lib/site";
import { Display, Kicker, Lede } from "@/components/type";

const FACEBOOK_PLUGIN =
  "https://www.facebook.com/plugins/page.php?" +
  new URLSearchParams({
    href: "https://www.facebook.com/people/Harris-in-Wonderland-Pets/100063473713270/",
    tabs: "timeline",
    width: "500",
    height: "720",
    small_header: "true",
    adapt_container_width: "true",
    hide_cover: "false",
    show_facepile: "false",
  }).toString();

const INSTAGRAM_EMBED = "https://www.instagram.com/harris_in_wonderland_pets/embed/";

function FeedFrame({
  kicker,
  href,
  label,
  src,
  title,
}: {
  kicker: string;
  href: string;
  label: string;
  src: string;
  title: string;
}) {
  return (
    <article className="flex min-h-0 flex-col border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <Kicker>{kicker}</Kicker>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass no-underline hover:text-ember-2"
        >
          {label}
        </a>
      </div>
      <div className="min-h-[36rem] flex-1 bg-white sm:min-h-[42rem]" style={{ colorScheme: "light" }}>
        <iframe
          title={title}
          src={src}
          loading="lazy"
          width={500}
          height={720}
          referrerPolicy="no-referrer-when-downgrade"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          className="h-full min-h-[36rem] w-full border-0 sm:min-h-[42rem]"
        />
      </div>
    </article>
  );
}

export function SocialFloor() {
  return (
    <section id="floor-notes" className="border-y border-border bg-bg-2 py-16 sm:py-24">
      <div className="wrap">
        <Kicker>Floor notes</Kicker>
        <Display className="mt-2">What they posted this week.</Display>
        <Lede className="mt-4 max-w-2xl">
          Live from the shop Instagram and Facebook — arrivals, sales, and the animals on
          the rack. Opens in their accounts, not Square.
        </Lede>
        <div className="mt-10 grid gap-3 lg:grid-cols-2">
          <FeedFrame
            kicker="Instagram"
            href={SITE.links.instagram}
            label="@harris_in_wonderland_pets"
            src={INSTAGRAM_EMBED}
            title="Harris in Wonderland on Instagram"
          />
          <FeedFrame
            kicker="Facebook"
            href={SITE.links.facebook}
            label="Harris in Wonderland Pets"
            src={FACEBOOK_PLUGIN}
            title="Harris in Wonderland on Facebook"
          />
        </div>
      </div>
    </section>
  );
}
