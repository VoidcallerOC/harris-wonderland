import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/site-shell";
import { MapPin, Phone } from "lucide-react";
import { DIRECTIONS, PROGRAMS, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { HoursTicket } from "@/components/hours-ticket";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/visit")({
  component: VisitPage,
  head: () =>
    pageHead({
      title: "Visit — Harris in Wonderland, Canton CT",
      description:
        "Hours, directions, the snake-handle door, birthday programs, and contact for the reptile specialty shop at 364 Albany Turnpike, Canton.",
      path: "/visit",
    }),
});
