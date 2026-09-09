create table if not exists sugar_glider_holds (
  id uuid primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  animal_id text not null,
  animal_description text not null,
  status text not null default 'requested' check (status in ('requested', 'deposit_pending', 'held', 'ready', 'completed', 'cancelled', 'expired')),
  total_amount_cents integer not null check (total_amount_cents > 0),
  deposit_amount_cents integer not null check (deposit_amount_cents >= 0 and deposit_amount_cents <= total_amount_cents),
  balance_due_cents integer not null check (balance_due_cents = total_amount_cents - deposit_amount_cents),
  created_at timestamptz not null default now(),
  hold_expires_at timestamptz not null,
  notes text,
  updated_at timestamptz not null default now()
);

create index if not exists sugar_glider_holds_status_idx on sugar_glider_holds (status, created_at desc);
create index if not exists sugar_glider_holds_customer_email_idx on sugar_glider_holds (lower(customer_email));
create unique index if not exists sugar_glider_holds_active_animal_idx
  on sugar_glider_holds (animal_id)
  where status in ('requested', 'deposit_pending', 'held', 'ready');
