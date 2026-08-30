import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Phone } from "lucide-react";
import { RENTAL_EVENTS, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { RentalForm } from "@/components/rental-form";
import { Kicker, Display, Lede } from "@/components/type";

export const Route = createFileRoute("/rentals")({
  component: RentalsPage,
  head: () => ({
    meta: [
      { title: "Animal Rentals — Harris in Wonderland, Canton CT" },
      {
        name: "description",
        content:
          "Rent Harris in Wonderland animals for birthday parties, photoshoots, film and TV productions, and educational programs across Connecticut. Keeper-handled. Request an event and a date.",
      },
    ],
  }),
});

const STEPS = [
  {
    n: "1",
    title: "Send the request",
    body: "Pick the event type, a date, and where it is. The form opens a pre-filled email to Adam — nothing is booked yet.",
  },
  {
    n: "2",
    title: "Adam confirms",
    body: "He replies with the animals that fit, the fee, travel, and any venue or permit needs.",
  },
  {
    n: "3",
    title: "Lock the date",
    body: "Deposit and details are handled directly. Popular dates and holiday weekends fill early.",
  },
];

function RentalsPage() {
  return (
    <SiteShell>
    <main>
      <section className="border-b border-border py-14 sm:py-20">
        <div className="wrap">
          <Kicker>Bring the animals to you</Kicker>
          <Display as="h1" className="mt-2 text-display">
            Animal rentals &amp; appearances
          </Display>
          <Lede className="mt-5">
            Adam brings live reptiles — handled by keepers, staged for the room — to
            parties, sets, and classrooms. Tell us the kind of event and the date; he
            confirms animals, price, and permits himself.
          </Lede>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#request">Request a booking</a>
            </Button>
            <Button asChild variant="ghost">
              <a href={SITE.phones.booking.href}>
                <Phone />
                Booking line {SITE.phones.booking.display}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="wrap">
          <Kicker>What we book</Kicker>
          <Display className="mt-2">Five kinds of event.</Display>
          <Lede className="mt-4 mb-8">
            Every booking is keeper-handled. Species depend on the date, the audience,
            and where it is happening. Ask early for a specific animal.
          </Lede>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {RENTAL_EVENTS.map((event) => (
              <article key={event.title} className="border border-border bg-card p-5">
                <Kicker>{event.role}</Kicker>
                <h3 className="mt-1 font-display text-card italic text-ticket">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{event.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="border-t border-border bg-bg-2 py-16 sm:py-24">
        <div className="wrap grid items-start gap-10 lg:grid-cols-2">
          <div>
            <Kicker>How it works</Kicker>
            <Display className="mt-2">Request first. Adam confirms.</Display>
            <ol className="mt-8 grid gap-5">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center bg-brass font-ui text-sm font-extrabold text-background">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl italic text-ticket">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-[46ch] text-sm text-muted-foreground">
              Travels from Canton across Connecticut and nearby. Farther out is possible
              for film and production — say so in the details.
            </p>
          </div>
          <RentalForm />
        </div>
      </section>
    </main>
    </SiteShell>
  );
}
