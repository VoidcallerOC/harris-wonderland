import { useState, type FormEvent } from "react";
import { CONTACT_TOPICS, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Kicker, Display } from "@/components/type";

export function ContactForm() {
  const [status, setStatus] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const topic = String(data.get("topic") ?? "General question");
    const message = String(data.get("message") ?? "");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nTopic: ${topic}\n\n${message}`,
    );
    window.location.href = `mailto:${SITE.emails.adam}?subject=${encodeURIComponent(`Harris in Wonderland — ${topic}`)}&body=${body}`;
    setStatus("Opening your email…");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 border border-border bg-card p-5 sm:p-6"
    >
      <div>
        <Kicker>Write first</Kicker>
        <Display as="h2" className="mt-2 text-3xl">
          Send a note
        </Display>
      </div>
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
        <Label htmlFor="topic">Topic</Label>
        <select
          id="topic"
          name="topic"
          className="h-12 w-full border border-border bg-secondary px-4 text-foreground outline-none focus-visible:border-brass"
        >
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={5} />
      </div>
      <Button type="submit">Open email draft</Button>
      <p className="min-h-5 text-sm text-moss" role="status">
        {status}
      </p>
    </form>
  );
}
