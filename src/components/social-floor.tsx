import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { FACEBOOK_POSTS, INSTAGRAM_POSTS, type SocialPost } from "@/lib/social-posts";
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
      className="group block min-w-0 overflow-hidden border border-border bg-background no-underline transition-[border-color] duration-fast ease-out-smooth hover:border-brass"
    >
      <SpecimenPhoto src={post.image} alt="" className="aspect-[5/4]" />
      <div className="p-4">
        <Kicker>{dateFmt.format(new Date(`${post.posted}T12:00:00`))}</Kicker>
        <p className="mt-2 line-clamp-4 text-sm text-fg-soft">{post.caption}</p>
        <span className="mt-3 inline-flex items-center gap-1 font-ui text-kicker font-bold uppercase tracking-kicker text-brass">
          Open post
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </a>
  );
}

function FeedColumn({
  kicker,
  href,
  label,
  posts,
}: {
  kicker: string;
  href: string;
  label: string;
  posts: SocialPost[];
}) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden border border-border bg-card">
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <Kicker>{kicker}</Kicker>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 truncate font-ui text-kicker font-bold uppercase tracking-kicker text-brass no-underline hover:text-ember-2"
        >
          <span className="sm:hidden">Open</span>
          <span className="hidden sm:inline">{label}</span>
        </a>
      </div>
      <div className="grid flex-1 gap-3 p-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export function SocialFloor() {
  return (
    <section id="floor-notes" className="border-y border-border bg-bg-2 py-16 sm:py-24">
      <div className="wrap min-w-0">
        <Kicker>Floor notes</Kicker>
        <Display className="mt-2">What they posted this week.</Display>
        <Lede className="mt-4 max-w-2xl">
          Pink-tongues in the shop, tortoise hides back, electric blues. Real posts from
          the accounts they run — tap through to Instagram or Facebook.
        </Lede>
        <div className="mt-10 grid min-w-0 gap-3 lg:grid-cols-2">
          <FeedColumn
            kicker="Instagram"
            href={SITE.links.instagram}
            label="@harris_in_wonderland_pets"
            posts={INSTAGRAM_POSTS}
          />
          <FeedColumn
            kicker="Facebook"
            href={SITE.links.facebookShop}
            label="Harris Wonderland"
            posts={FACEBOOK_POSTS}
          />
        </div>
      </div>
    </section>
  );
}
