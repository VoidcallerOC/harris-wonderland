import { SITE } from "./site";

export type HoursRow = {
  day: number;
  name: string;
  label: string;
  open: number;
  close: number;
  closed?: boolean;
};

export const HOURS: HoursRow[] = [
  { day: 0, name: "Sunday", label: "12:00 PM – 4:00 PM", open: 12, close: 16 },
  { day: 1, name: "Monday", label: "Closed", open: 0, close: 0, closed: true },
  { day: 2, name: "Tuesday", label: "10:00 AM – 7:30 PM", open: 10, close: 19.5 },
  { day: 3, name: "Wednesday", label: "10:00 AM – 7:30 PM", open: 10, close: 19.5 },
  { day: 4, name: "Thursday", label: "10:00 AM – 7:30 PM", open: 10, close: 19.5 },
  { day: 5, name: "Friday", label: "10:00 AM – 7:00 PM", open: 10, close: 19 },
  { day: 6, name: "Saturday", label: "10:00 AM – 6:00 PM", open: 10, close: 18 },
];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getNyClock(now = new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE.timezone,
    weekday: "long",
  }).format(now);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: SITE.timezone,
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const day = WEEKDAYS.indexOf(weekday);
  const hour = Number(parts.hour ?? 0) + Number(parts.minute ?? 0) / 60;
  return { day: day >= 0 ? day : 0, hour };
}

export function getShopStatus(now = new Date()) {
  const { day, hour } = getNyClock(now);
  const today = HOURS.find((row) => row.day === day) ?? HOURS[1];
  const isOpen = Boolean(today && !today.closed && hour >= today.open && hour < today.close);

  let nextLabel = "See ticket";
  if (!isOpen) {
    if (today && !today.closed && hour < today.open) {
      nextLabel = `Opens today ${formatHour(today.open)}`;
    } else {
      for (let i = 1; i <= 7; i += 1) {
        const row = HOURS.find((h) => h.day === (day + i) % 7);
        if (row && !row.closed) {
          nextLabel =
            i === 1
              ? `Opens tomorrow ${formatHour(row.open)}`
              : `Opens ${row.name} ${formatHour(row.open)}`;
          break;
        }
      }
    }
  }

  return {
    today,
    isOpen,
    badge: isOpen ? "Open now" : today?.closed ? "Closed Monday" : "Closed",
    nextLabel,
  };
}

function formatHour(value: number) {
  const h = Math.floor(value);
  const m = Math.round((value - h) * 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}
