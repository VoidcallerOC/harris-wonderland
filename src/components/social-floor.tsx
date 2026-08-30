import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { INSTAGRAM_POSTS, type SocialPost } from "@/lib/social-posts";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Display, Kicker, Lede } from "@/components/type";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: SITE.timezone,
});

function PostCard({ post }: { post: SocialPost }) {
  return (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block min-w-0 overflow-hidden border border-border bg-card no-underline transition-[border-color] duration-fast ease-out-smooth hover:border-brass"
    >
      <SpecimenPhoto src={post.image} alt="" className="aspect-[5/4]" />
      <div className="p-4">
        <Kicker>{dateFmt.format(new Date(`${post.posted}T12:00:00`))}</Kicker>
        <p className="mt-2 line-clamp-4 text-sm text-fg-soft">{post.caption}</p>
        <span className="mt-3 inline-flex items-center gap-1 font-ui text-kicker font-bold uppercase tracking-kicker text-brass">
          Open on Instagram
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </a>
  );
}

export function SocialFloor() {
  return (
    <section id="floor-notes" className="border-y border-border bg-bg-2 py-16 sm:py-24">
      <div className="wrap min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <Kicker>Floor notes</Kicker>
            <Display className="mt-2">What they posted this week.</Display>
            <Lede className="mt-4 max-w-2xl">
              Live from the shop Instagram — pink-tongues in, tortoise hides back,
              electric blues.
            </Lede>
          </div>
          <a
            href={SITE.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass no-underline hover:text-ember-2"
          >
            @harris_in_wonderland_pets
          </a>
        </div>
        <div className="mt-10 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INSTAGRAM_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
