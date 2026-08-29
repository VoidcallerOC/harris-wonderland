import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { HoursTicket } from "@/components/hours-ticket";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/visit")({
  component: VisitPage,
  head: () => ({
    meta: [
      { title: "Visit — Harris in Wonderland, Canton CT" },
      {
        name: "description",
        content:
          "Hours, the snake-handle door, birthday programs, and contact for the reptile specialty shop at 364 Albany Turnpike, Canton.",
      },
    ],
  }),
});

function VisitPage() {
  return (
    <SiteShell>
    <main>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="wrap">
          <Kicker>364 Albany Turnpike · Route 44</Kicker>
          <Display as="h1" className="mt-2 text-display">
            Come in through the snake-handle door.
          </Display>
          <Lede className="mt-5">
            Dedicated parking, accessible entry. The collection lives in the room, not on
            this site. Ask at the counter for care sheets.
          </Lede>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="wrap grid items-start gap-6 lg:grid-cols-2">
          <HoursTicket />
          <div className="border border-border bg-card p-6">
            <Kicker>Address</Kicker>
            <Display as="h2" className="mt-2 text-3xl">
              Canton, Connecticut
            </Display>
            <p className="mt-4 text-fg-soft">
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
            </p>
            <p className="mt-4 text-fg-soft">
              Shop{" "}
              <a className="text-brass underline-offset-4 hover:underline" href={SITE.phones.shop.href}>
                {SITE.phones.shop.display}
              </a>
              <br />
              Booking / mobile{" "}
              <a className="text-brass underline-offset-4 hover:underline" href={SITE.phones.booking.href}>
                {SITE.phones.booking.display}
              </a>
            </p>
            <p className="mt-4">
              <a className="text-brass underline-offset-4 hover:underline" href={`mailto:${SITE.emails.adam}`}>
                {SITE.emails.adam}
              </a>
              <br />
              <a className="text-brass underline-offset-4 hover:underline" href={`mailto:${SITE.emails.seth}`}>
                {SITE.emails.seth}
              </a>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={SITE.phones.shop.href}>
                  <Phone />
                  Call the shop
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href={SITE.links.maps} target="_blank" rel="noopener noreferrer">
                  <MapPin />
                  Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <iframe
          title="Map of Harris in Wonderland, 364 Albany Turnpike, Canton CT"
          src={SITE.links.mapsEmbed}
          className="h-72 w-full border-0 grayscale invert-[0.88] lg:h-96"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section className="py-16 sm:py-24">
        <div className="wrap grid items-start gap-10 lg:grid-cols-2">
          <div>
            <Kicker>Programs</Kicker>
            <Display className="mt-2">Birthdays & education</Display>
            <p className="mt-4 max-w-[46ch] text-fg-soft">
              The animals are the event. Call to book. Mention ages, group size, and
              whether anyone is new to reptiles. These fill — the booking line is{" "}
              {SITE.phones.booking.display}.
            </p>
            <div className="mt-6 grid gap-3">
              <article className="border border-border bg-card p-5">
                <h3 className="font-display text-card italic text-ticket">Birthday programs</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Handling, looking, asking questions. Not a bounce-house with a snake in
                  the corner. Book ahead.
                </p>
              </article>
              <article className="border border-border bg-card p-5">
                <h3 className="font-display text-card italic text-ticket">Education visits</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Classrooms and groups. Adam and the collection travel when the calendar
                  allows.
                </p>
              </article>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
    </SiteShell>
  );
}
