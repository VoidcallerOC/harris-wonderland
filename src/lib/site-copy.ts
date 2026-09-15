import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql, type Sql } from "./db.ts";
import { authMiddleware } from "./auth/middleware.ts";
import { recordAudit, requirePermissionForUser } from "./auth/rbac.ts";
import { SITE } from "./site.ts";

export const COPY_FIELDS = [
  { key: "hero_kicker", label: "Home kicker", value: "Connecticut reptile specialty shop" },
  { key: "hero_lede", label: "Home intro", value: "A working herp collection — snakes, lizards, frogs, and feeders — kept by the people who breed them. Come in and we will help you pick the right one for your setup." },
  { key: "site_tagline", label: "Tagline", value: SITE.tagline },
  { key: "site_description", label: "Site description", value: SITE.description },
  { key: "footer_blurb", label: "Footer blurb", value: "Harris in Wonderland is a reptile specialty shop in Canton, Connecticut, with captive-bred snakes, lizards, frogs, tropical fish, and husbandry help for the animals we keep." },
  { key: "address_line", label: "Address", value: SITE.address.line },
  { key: "landmark", label: "Landmark / door", value: SITE.landmark },
  { key: "phone_display", label: "Shop phone", value: SITE.phones.shop.display },
  { key: "email", label: "Shop email", value: SITE.emails.adam },
  { key: "home_exhibits_title", label: "Home · exhibits heading", value: "What is in the cases." },
  { key: "home_exhibits_lede", label: "Home · exhibits intro", value: "Morphs you will not find at a chain, feeders priced for people who actually feed, and staff who will hold an animal until your setup is ready." },
  { key: "home_floor_title", label: "Home · floor heading", value: "Look closer." },
  { key: "home_floor_lede", label: "Home · floor intro", value: "The collection rewards a second glance: color, texture, tiny feet, watchful eyes. These are the animals people come back to stand in front of." },
  { key: "home_beginner_title", label: "Home · beginner heading", value: "The right first animal." },
  { key: "home_beginner_lede", label: "Home · beginner intro", value: "We steer first-timers toward hardy species. Corn or king. Leopard gecko. Red-Footed Tortoises. Ask at the counter before you commit to the showy one." },
  { key: "collection_title", label: "Collection · heading", value: "Find the right animal for your setup." },
  { key: "collection_lede", label: "Collection · intro", value: "Reptiles, mammals, birds, and tropical fish are organized by family below. The live shop page remains connected to Square for current inventory, pricing, pickup, and checkout." },
  { key: "care_title", label: "Care · heading", value: "Care sheets for the animals we keep." },
  { key: "care_lede", label: "Care · intro", value: "Start with the species, then build the enclosure around what it actually needs. These notes are the same conversations we have at the counter." },
  { key: "fish_title", label: "Fish · heading", value: "The wet side of the house." },
  { key: "fish_lede", label: "Fish · intro", value: "Freshwater, marine, and the equipment to keep a living room tank honest." },
  { key: "merch_title", label: "Merch · heading", value: "Wear the shop." },
  { key: "merch_lede", label: "Merch · intro", value: "A small run of Harris in Wonderland goods is coming. Ask at the counter for what is currently in." },
  { key: "rentals_title", label: "Rentals · heading", value: "Bring the animals to you." },
  { key: "rentals_lede", label: "Rentals · intro", value: "Birthday programs, classrooms, libraries, and scouts. We bring a small, well-handled collection and the story behind each animal." },
  { key: "story_title", label: "Story · heading", value: "From a house of tanks to Route 44." },
  { key: "story_lede", label: "Story · intro", value: "Biology, not scripts. A fish-keeper who taught high-school science, a herpetologist with field seasons across the world, and the person who will tell you which animal actually fits your setup." },
  { key: "visit_title", label: "Visit · heading", value: "Come in through the snake-handle door." },
  { key: "visit_lede", label: "Visit · intro", value: "Dedicated parking, accessible entry, and a working reptile shop on Route 44. Snake-handle door toward the right side of the building." },

] as const;

export type CopyField = (typeof COPY_FIELDS)[number];
export type SiteCopyMap = Record<string, string>;

async function ensureCopyTable(sql: Sql): Promise<void> {
  await sql.query(`create table if not exists site_copy (
    key text primary key,
    label text not null,
    value text not null,
    updated_at timestamptz not null default now(),
    updated_by text
  )`);
}

export async function readSiteCopy(sql: Sql): Promise<SiteCopyMap> {
  await ensureCopyTable(sql);
  const rows = await sql.query<{ key: string; value: string }>(`select key, value from site_copy`);
  const map: SiteCopyMap = {};
  for (const field of COPY_FIELDS) map[field.key] = field.value;
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export const getPublicSiteCopy = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return readSiteCopy(sql);
});

export const listSiteCopy = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requirePermissionForUser(sql, context.userId, "content.view");
    const values = await readSiteCopy(sql);
    return COPY_FIELDS.map((field) => ({ ...field, value: values[field.key] ?? field.value }));
  });

const SaveInput = z.object({
  key: z.string().min(1).max(80),
  value: z.string().max(4000),
});

export const saveSiteCopy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(SaveInput)
  .handler(async ({ context, data }) => {
    const field = COPY_FIELDS.find((item) => item.key === data.key);
    if (!field) throw new Error("Unknown copy field.");
    const sql = await getSql();
    await requirePermissionForUser(sql, context.userId, "content.edit");
    await ensureCopyTable(sql);
    const previous = await sql.query<{ value: string }>(`select value from site_copy where key = $1`, [data.key]);
    await sql.query(
      `insert into site_copy (key, label, value, updated_by) values ($1, $2, $3, $4)
       on conflict (key) do update set value = excluded.value, label = excluded.label, updated_at = now(), updated_by = excluded.updated_by`,
      [data.key, field.label, data.value, context.userId],
    );
    await recordAudit(sql, {
      actorUserId: context.userId,
      action: "content_updated",
      resourceType: "site_copy",
      resourceId: data.key,
      previousValue: previous[0]?.value ?? field.value,
      newValue: data.value,
    });
    return { key: data.key, value: data.value };
  });
