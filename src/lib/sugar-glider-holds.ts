import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { SUGAR_GLIDERS, mammalDeposit, type MammalAvailability } from "@/lib/mammals";
import { chargeSquareCard, refundSquarePayment } from "@/lib/square-api";

export const HOLD_STATUSES = ["requested", "deposit_pending", "held", "ready", "completed", "cancelled", "expired"] as const;
export type HoldStatus = (typeof HOLD_STATUSES)[number];
export const HOLD_PAYMENT_MODES = ["full", "deposit", "balance"] as const;
export type HoldPaymentMode = (typeof HOLD_PAYMENT_MODES)[number];
export type PaymentStatus = "unpaid" | "processing" | "succeeded" | "failed";

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
  fullPaymentStatus: PaymentStatus;
  fullPaymentId: string | null;
  fullPaymentAt: string | null;
  depositPaymentStatus: PaymentStatus;
  depositPaymentId: string | null;
  depositPaymentAt: string | null;
  balancePaymentStatus: PaymentStatus;
  balancePaymentId: string | null;
  balancePaymentAt: string | null;
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
  full_payment_status: PaymentStatus;
  full_payment_id: string | null;
  full_payment_at: string | null;
  deposit_payment_status: PaymentStatus;
  deposit_payment_id: string | null;
  deposit_payment_at: string | null;
  balance_payment_status: PaymentStatus;
  balance_payment_id: string | null;
  balance_payment_at: string | null;
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
const HoldPaymentInput = z.object({
  holdId: z.string().uuid(),
  mode: z.enum(HOLD_PAYMENT_MODES),
  sourceId: z.string().min(1).max(500),
  idempotencyKey: z.string().uuid(),
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
    fullPaymentStatus: row.full_payment_status,
    fullPaymentId: row.full_payment_id,
    fullPaymentAt: row.full_payment_at ? new Date(row.full_payment_at).toISOString() : null,
    depositPaymentStatus: row.deposit_payment_status,
    depositPaymentId: row.deposit_payment_id,
    depositPaymentAt: row.deposit_payment_at ? new Date(row.deposit_payment_at).toISOString() : null,
    balancePaymentStatus: row.balance_payment_status,
    balancePaymentId: row.balance_payment_id,
    balancePaymentAt: row.balance_payment_at ? new Date(row.balance_payment_at).toISOString() : null,
  };
}

function paymentColumn(mode: HoldPaymentMode) {
  return {
    full: { status: "full_payment_status", id: "full_payment_id", at: "full_payment_at" },
    deposit: { status: "deposit_payment_status", id: "deposit_payment_id", at: "deposit_payment_at" },
    balance: { status: "balance_payment_status", id: "balance_payment_id", at: "balance_payment_at" },
  }[mode];
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

export const paySugarGliderHold = createServerFn({ method: "POST" })
  .validator(HoldPaymentInput)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await expireStaleHolds(sql);
    const rows = await sql.query<HoldDbRow>(`select * from sugar_glider_holds where id = $1`, [data.holdId]);
    const hold = rows[0];
    if (!hold) throw new Error("Hold not found.");
    if (["cancelled", "expired", "completed"].includes(hold.status)) throw new Error("This hold can no longer accept payment.");
    const column = paymentColumn(data.mode);
    const amountCents = data.mode === "full" ? Number(hold.total_amount_cents) : data.mode === "deposit" ? Number(hold.deposit_amount_cents) : Number(hold.balance_due_cents);
    if (amountCents <= 0) throw new Error("There is no balance due for this payment.");
    if (hold[column.status as keyof HoldDbRow] === "succeeded") throw new Error("This payment has already been completed.");
    if (data.mode === "full" && hold.deposit_payment_status === "succeeded") throw new Error("A deposit is already recorded. Pay the remaining balance instead.");
    if (data.mode === "deposit" && hold.full_payment_status === "succeeded") throw new Error("This hold is already paid in full.");
    if (data.mode === "balance" && hold.deposit_payment_status !== "succeeded") throw new Error("The deposit must be completed before the balance can be paid.");

    const existing = await sql.query<{ id: string; amount_cents: number; payment_mode: HoldPaymentMode; status: "pending" | "succeeded" | "failed"; square_payment_id: string | null }>(
      `select id, amount_cents, payment_mode, status, square_payment_id from sugar_glider_payment_attempts where idempotency_key = $1`,
      [data.idempotencyKey],
    );
    let attemptId: string;
    if (existing[0]) {
      const attempt = existing[0];
      if (attempt.payment_mode !== data.mode || Number(attempt.amount_cents) !== amountCents) throw new Error("This payment retry does not match the original amount.");
      if (attempt.status === "succeeded") return { ok: true as const, paymentId: attempt.square_payment_id };
      if (attempt.status === "failed") throw new Error("This payment attempt failed. Start a new attempt.");
      attemptId = attempt.id;
    } else {
      attemptId = crypto.randomUUID();
      try {
        await sql.query(
          `insert into sugar_glider_payment_attempts (id, hold_id, payment_mode, idempotency_key, amount_cents)
           values ($1, $2, $3, $4, $5)`,
          [attemptId, data.holdId, data.mode, data.idempotencyKey, amountCents],
        );
      } catch {
        throw new Error("This payment is already being processed. Refresh before trying again.");
      }
    }

    try {
      const payment = await chargeSquareCard({
        sourceId: data.sourceId,
        amountCents,
        idempotencyKey: data.idempotencyKey,
        buyerEmail: hold.customer_email,
        note: `Harris hold ${hold.id} · ${data.mode} · ${hold.animal_description}`,
      });
      const updated = await sql.query<HoldDbRow>(
        `update sugar_glider_holds
         set ${column.status} = 'succeeded', ${column.id} = $2, ${column.at} = now(), updated_at = now()
         where id = $1 and status in ('requested', 'deposit_pending', 'held', 'ready') and ${column.status} <> 'succeeded'
         returning *`,
        [data.holdId, payment.paymentId],
      );
      if (!updated[0]) {
        await refundSquarePayment(payment.paymentId, amountCents, `hold-${data.holdId}-${data.mode}-reconcile`);
        throw new Error("The hold changed before payment could be recorded. The Square payment was refunded.");
      }
      await sql.query(
        `update sugar_glider_payment_attempts set status = 'succeeded', square_payment_id = $2, square_order_id = $3, completed_at = now() where id = $1`,
        [attemptId, payment.paymentId, payment.orderId],
      );
      return { ok: true as const, paymentId: payment.paymentId, hold: toHold(updated[0]) };
    } catch (error) {
      await sql.query(
        `update sugar_glider_payment_attempts set status = 'failed', error_message = $2, completed_at = now() where id = $1`,
        [attemptId, error instanceof Error ? error.message.slice(0, 500) : "Square payment failed."],
      );
      await sql.query(`update sugar_glider_holds set ${column.status} = 'failed', updated_at = now() where id = $1 and ${column.status} = 'unpaid'`, [data.holdId]);
      throw error;
    }
  });

export const listSugarGliderHolds = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await expireStaleHolds(sql);
    const rows = await sql.query<HoldDbRow>(`select * from sugar_glider_holds order by created_at desc limit 200`);
    return rows.map(toHold);
  });

export const updateSugarGliderHold = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(AdminStatusInput)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await expireStaleHolds(sql);
    const current = await sql.query<Pick<HoldDbRow, "status">>(`select status from sugar_glider_holds where id = $1`, [data.holdId]);
    if (!current[0]) throw new Error("Hold not found.");
    if (!canTransitionHold(current[0].status, data.status)) throw new Error(`A ${current[0].status.replace("_", " ")} hold cannot be marked ${data.status.replace("_", " ")}.`);
    const rows = await sql.query<HoldDbRow>(
      `update sugar_glider_holds set status = $2, notes = coalesce($3, notes), updated_at = now() where id = $1 and status = $4 returning *`,
      [data.holdId, data.status, data.notes?.trim() || null, current[0].status],
    );
    if (!rows[0]) throw new Error("That hold changed in another request. Refresh and try again.");
    return toHold(rows[0]);
  });
