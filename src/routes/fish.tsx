import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { SpecimenPhoto } from "@/components/specimen-photo";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/fish")({
  component: FishPage,
  head: () =>
    pageHead({
      title: "Fish room & ponds — Harris in Wonderland",
      description:
        "Freshwater and marine tanks, a dedicated reef room, limited garden-pond installs, and sugar gliders when they have them. Harris in Wonderland, Canton CT.",
      path: "/fish",
    }),
});
