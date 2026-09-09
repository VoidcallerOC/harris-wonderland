alter table sugar_glider_holds
  add column if not exists full_payment_status text not null default 'unpaid' check (full_payment_status in ('unpaid', 'processing', 'succeeded', 'failed')),
  add column if not exists full_payment_id text,
  add column if not exists full_payment_at timestamptz,
  add column if not exists deposit_payment_status text not null default 'unpaid' check (deposit_payment_status in ('unpaid', 'processing', 'succeeded', 'failed')),
  add column if not exists deposit_payment_id text,
  add column if not exists deposit_payment_at timestamptz,
  add column if not exists balance_payment_status text not null default 'unpaid' check (balance_payment_status in ('unpaid', 'processing', 'succeeded', 'failed')),
  add column if not exists balance_payment_id text,
  add column if not exists balance_payment_at timestamptz;

create table if not exists sugar_glider_payment_attempts (
  id uuid primary key,
  hold_id uuid not null references sugar_glider_holds(id) on delete restrict,
  payment_mode text not null check (payment_mode in ('full', 'deposit', 'balance')),
  idempotency_key text not null unique,
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed')),
  square_payment_id text,
  square_order_id text,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists sugar_glider_payment_attempts_hold_idx
  on sugar_glider_payment_attempts (hold_id, created_at desc);

create unique index if not exists sugar_glider_payment_attempts_active_phase_idx
  on sugar_glider_payment_attempts (hold_id, payment_mode)
  where status = 'pending';
