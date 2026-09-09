import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { SUGAR_GLIDERS, mammalDeposit, type MammalAvailability } from "@/lib/mammals";

export const HOLD_STATUSES = ["requested", "deposit_pending", "held", "ready", "completed", "cancelled", "expired"] as const;
export type HoldStatus = (typeof HOLD_STATUSES)[number];

const HOLD_TRANSITIONS: Record<HoldStatus, readonly HoldStatus[]> = {
  requested: ["deposit_pending", "cancelled", "expired"],
  deposit_pending: ["held", "cancelled", "expired"],
  held: ["ready", "cancelled", "expired"],
  ready: ["completed", "cancelled", "expired"],
  completed: [],
  cancelled: [],
  expired: [],
};

export function canTransitionHold(from: HoldStatus, to: HoldStatus) {
  return from === to || HOLD_TRANSITIONS[from].includes(to);
}

export type SugarGliderHold = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  animalId: string;
  animalDescription: string;
  status: HoldStatus;
  totalAmountCents: number;
  depositAmountCents: number;
  balanceDueCents: number;
  createdAt: string;
  holdExpiresAt: string;
  notes: string | null;
  updatedAt: string;
};

type HoldDbRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  animal_id: string;
  animal_description: string;
  status: HoldStatus;
  total_amount_cents: number;
  deposit_amount_cents: number;
  balance_due_cents: number;
  created_at: string;
  hold_expires_at: string;
  notes: string | null;
  updated_at: string;
};

const CustomerHoldInput = z.object({
  animalId: z.string().trim().min(1).max(120),
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().trim().email().max(254),
  customerPhone: z.string().trim().regex(/^[+()\d\s.-]{7,30}$/),
  notes: z.string().trim().max(1000).optional(),
});
const AdminStatusInput = z.object({
  holdId: z.string().uuid(),
  status: z.enum(HOLD_STATUSES),
  notes: z.string().trim().max(1000).optional(),
});

function toHold(row: HoldDbRow): SugarGliderHold {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    animalId: row.animal_id,
    animalDescription: row.animal_description,
    status: row.status,
    totalAmountCents: Number(row.total_amount_cents),
    depositAmountCents: Number(row.deposit_amount_cents),
    balanceDueCents: Number(row.balance_due_cents),
    createdAt: new Date(row.created_at).toISOString(),
    holdExpiresAt: new Date(row.hold_expires_at).toISOString(),
    notes: row.notes,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function adminUserIds() {
  return (process.env.ADMIN_USER_IDS ?? "").split(",").map((id) => id.trim()).filter(Boolean);
}
async function requireAdmin(userId: string) {
  if (!adminUserIds().includes(userId)) throw new Error("Administrator access is required.");
}

function listingForHold(animalId: string) {
  const listing = SUGAR_GLIDERS.find((item) => item.id === animalId);
  if (!listing) throw new Error("That animal is no longer available for a hold.");
  if (!["available", "upcoming", "preorder"].includes(listing.availability as MammalAvailability)) {
    throw new Error("That animal is not currently eligible for a hold.");
  }
  return listing;
}

async function expireStaleHolds(sql: Awaited<ReturnType<typeof getSql>>) {
  await sql.query(
    `update sugar_glider_holds
     set status = 'expired', updated_at = now()
     where status in ('requested', 'deposit_pending', 'held', 'ready')
       and hold_expires_at <= now()`,
  );
}

export const createSugarGliderHold = createServerFn({ method: "POST" })
  .validator(CustomerHoldInput)
  .handler(async ({ data }) => {
    const listing = listingForHold(data.animalId);
    const totalAmountCents = Math.round(listing.fullPrice * 100);
    const depositAmountCents = Math.round((mammalDeposit(listing) ?? 0) * 100);
    const balanceDueCents = totalAmountCents - depositAmountCents;
    const holdExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const sql = await getSql();
    await expireStaleHolds(sql);
    try {
      const rows = await sql.query<HoldDbRow>(
        `insert into sugar_glider_holds
          (id, customer_name, customer_email, customer_phone, animal_id, animal_description, status,
           total_amount_cents, deposit_amount_cents, balance_due_cents, hold_expires_at, notes)
         values ($1, $2, $3, $4, $5, $6, 'requested', $7, $8, $9, $10, $11)
         returning *`,
        [crypto.randomUUID(), data.customerName, data.customerEmail.toLowerCase(), data.customerPhone, listing.id, `${listing.name} · ${listing.morph}`, totalAmountCents, depositAmountCents, balanceDueCents, holdExpiresAt.toISOString(), data.notes?.trim() || null],
      );
      return { ok: true as const, hold: toHold(rows[0]) };
    } catch (error) {
      if (String(error).toLowerCase().includes("sugar_glider_holds_active_animal_idx") || String(error).toLowerCase().includes("duplicate key")) {
        throw new Error("That animal is already requested or held. Please call the shop for the next available animal.");
      }
      throw error;
    }
  });

export const listSugarGliderHolds = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await expireStaleHolds(sql);
    const rows = await sql.query<HoldDbRow>(
      `select * from sugar_glider_holds order by created_at desc limit 200`,
    );
    return rows.map(toHold);
  });

export const updateSugarGliderHold = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(AdminStatusInput)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await expireStaleHolds(sql);
    const current = await sql.query<Pick<HoldDbRow, "status">>(
      `select status from sugar_glider_holds where id = $1`,
      [data.holdId],
    );
    if (!current[0]) throw new Error("Hold not found.");
    if (!canTransitionHold(current[0].status, data.status)) {
      throw new Error(`A ${current[0].status.replace("_", " ")} hold cannot be marked ${data.status.replace("_", " ")}.`);
    }
    const rows = await sql.query<HoldDbRow>(
      `update sugar_glider_holds
       set status = $2, notes = coalesce($3, notes), updated_at = now()
       where id = $1 and status = $4
       returning *`,
      [data.holdId, data.status, data.notes?.trim() || null, current[0].status],
    );
    if (!rows[0]) throw new Error("That hold changed in another request. Refresh and try again.");
    return toHold(rows[0]);
  });
