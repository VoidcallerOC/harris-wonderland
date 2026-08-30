import { useState, type FormEvent } from "react";
import { RENTAL_EVENT_TYPES, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Kicker, Display } from "@/components/type";

const selectClass =
  "h-12 w-full border border-border bg-secondary px-4 text-foreground outline-none focus-visible:border-brass";

export function RentalForm() {
  const [status, setStatus] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const eventType = get("eventType") || "Animal rental";
    const lines = [
      ["Name", get("name")],
      ["Email", get("email")],
      ["Phone", get("phone")],
      ["Event type", eventType],
      ["Preferred date", get("date")],
      ["Time & length", get("time")],
      ["Location / venue", get("location")],
      ["Group size / audience", get("group")],
      ["Animals of interest", get("animals")],
      ["Details", get("message")],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n");
    window.location.href = `mailto:${SITE.emails.adam}?subject=${encodeURIComponent(
      `Harris in Wonderland — rental request (${eventType})`,
    )}&body=${encodeURIComponent(lines)}`;
    setStatus("Opening your email — send it and Adam will be in touch.");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 border border-border bg-card p-5 sm:p-6"
    >
      <div>
        <Kicker>Request a booking</Kicker>
        <Display as="h2" className="mt-2 text-3xl">
          Tell us about the event
        </Display>
        <p className="mt-2 text-sm text-muted-foreground">
          This opens a pre-filled email to Adam. Nothing is booked until he confirms
          animals, price, and any permits by phone or email.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="eventType">Event type</Label>
          <select id="eventType" name="eventType" required defaultValue="" className={selectClass}>
            <option value="" disabled>
              Choose one…
            </option>
            {RENTAL_EVENT_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Preferred date</Label>
          <Input id="date" name="date" type="date" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Time &amp; length</Label>
          <Input id="time" name="time" placeholder="e.g. Sat 2–4 PM, ~2 hours" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location / venue</Label>
          <Input id="location" name="location" placeholder="Town, or address / venue" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="group">Group size / audience</Label>
          <Input id="group" name="group" placeholder="e.g. 15 kids, ages 6–8" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="animals">Animals of interest</Label>
        <Input
          id="animals"
          name="animals"
          placeholder="e.g. ball python, tortoise, tegu — or surprise us"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Details</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Anything that helps Adam plan — indoor/outdoor, power, allergies, budget, deadline."
        />
      </div>
      <Button type="submit">Open email request</Button>
      <p className="min-h-5 text-sm text-moss" role="status">
        {status}
      </p>
      <p className="text-sm text-muted-foreground">
        Prefer to talk it through? Booking line{" "}
        <a
          className="text-brass underline-offset-4 hover:underline"
          href={SITE.phones.booking.href}
        >
          {SITE.phones.booking.display}
        </a>
        .
      </p>
    </form>
  );
}
