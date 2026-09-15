import { hashPassword } from "better-auth/crypto";
import type { PGlite } from "@electric-sql/pglite";
import { REVIEW_ADAM } from "./review-env";

/**
 * Synthetic review records only. Never copies production customers, payments,
 * or credentials. Idempotent so every PGlite cold start is reviewable.
 */
export async function seedReviewDatabase(pg: PGlite): Promise<void> {
  const passwordHash = await hashPassword(REVIEW_ADAM.password);

  await pg.query(
    `insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
     values ($1, $2, $3, true, now(), now())
     on conflict (id) do update set name = excluded.name, email = excluded.email, "updatedAt" = now()`,
    [REVIEW_ADAM.userId, REVIEW_ADAM.name, REVIEW_ADAM.email],
  );

  await pg.query(
    `insert into "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
     values ($1, $2, 'credential', $3, $4, now(), now())
     on conflict (id) do update set password = excluded.password, "updatedAt" = now()`,
    [REVIEW_ADAM.accountId, REVIEW_ADAM.email, REVIEW_ADAM.userId, passwordHash],
  );

  await pg.query(
    `insert into app_user_roles (user_id, role, assigned_by)
     values ($1, $2, $1)
     on conflict (user_id) do update set role = excluded.role, updated_at = now()`,
    [REVIEW_ADAM.userId, REVIEW_ADAM.role],
  );

  await pg.query(
    `insert into sugar_glider_holds
      (id, customer_name, customer_email, customer_phone, animal_id, animal_description, status,
       total_amount_cents, deposit_amount_cents, balance_due_cents, hold_expires_at, notes,
       deposit_payment_status, deposit_payment_id, deposit_payment_at)
     values
      ('11111111-1111-4111-8111-111111111111', 'Demo Customer One', 'demo-one@example.invalid', '555-010-0101',
       'sugar-glider-available', 'Demo Sugar Glider · Well-started companion', 'requested',
       49500, 24750, 24750, now() + interval '48 hours',
       'Synthetic review record — not a real customer.',
       'unpaid', null, null),
      ('22222222-2222-4222-8222-222222222222', 'Demo Customer Two', 'demo-two@example.invalid', '555-010-0102',
       'sugar-glider-upcoming', 'Demo Sugar Glider joey · Upcoming litter', 'held',
       59500, 29750, 29750, now() + interval '72 hours',
       'Synthetic review record — not a real customer. Deposit marked succeeded for review only.',
       'succeeded', 'demo-square-pay-deposit-001', now() - interval '6 hours'),
      ('33333333-3333-4333-8333-333333333333', 'Demo Customer Three', 'demo-three@example.invalid', '555-010-0103',
       'demo-sugar-glider-completed', 'Demo Sugar Glider pair · Completed pickup', 'completed',
       89500, 44750, 44750, now() - interval '5 days',
       'Synthetic completed hold — not a real customer.',
       'succeeded', 'demo-square-pay-deposit-002', now() - interval '10 days')
     on conflict (id) do nothing`,
  );

  await pg.query(
    `insert into sugar_glider_payment_attempts
      (id, hold_id, payment_mode, idempotency_key, amount_cents, status, square_payment_id, square_order_id, error_message, created_at, completed_at)
     values
      ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222', 'deposit',
       'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 29750, 'succeeded', 'demo-square-pay-deposit-001', 'demo-square-order-001',
       null, now() - interval '6 hours', now() - interval '6 hours'),
      ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '33333333-3333-4333-8333-333333333333', 'deposit',
       'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 44750, 'succeeded', 'demo-square-pay-deposit-002', 'demo-square-order-002',
       null, now() - interval '10 days', now() - interval '10 days')
     on conflict (id) do nothing`,
  );

  await pg.query(
    `insert into site_copy (key, label, value, updated_at, updated_by)
     values ('footer_blurb', 'Footer blurb',
       'REVIEW DEMO COPY — not production. Harris in Wonderland is a reptile specialty shop in Canton, Connecticut.',
       now(), $1)
     on conflict (key) do nothing`,
    [REVIEW_ADAM.userId],
  );

  await pg.query(
    `insert into app_audit_log (id, actor_user_id, action, resource_type, resource_id, previous_value, new_value)
     values ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', $1, 'role_created', 'user_role', $1,
       null, '{"role":"manager","review":true}'::jsonb)
     on conflict (id) do nothing`,
    [REVIEW_ADAM.userId],
  );
}
