drop index if exists sugar_glider_payment_attempts_active_phase_idx;

create unique index if not exists sugar_glider_payment_attempts_one_pending_hold_idx
  on sugar_glider_payment_attempts (hold_id)
  where status = 'pending';
