import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Hero } from "@/components/hero";
import { ArrowRight, Phone } from "lucide-react";
import { SITE, KEEPERS, TIMELINE } from "@/lib/site";
import { SPECIES } from "@/lib/species";
import { Button } from "@/components/ui/button";
import { BeginnerChooser } from "@/components/chooser";
import { HoursTicket } from "@/components/hours-ticket";
import { SpeciesMarquee } from "@/components/marquee";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { ShopFloor } from "@/components/shop-floor";
import { FeederLocker } from "@/components/feeder-locker";
import { getSquareCatalog } from "@/lib/square-api";
import { pageHead } from "@/lib/seo";
import { Kicker, Display, Lede } from "@/components/type";
import { SocialFloor } from "@/components/social-floor";

export const Route = createFileRoute("/")({
  loader: () => getSquareCatalog(),
  component: Home,
  head: () =>
    pageHead({
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      path: "/",
    }),
});
