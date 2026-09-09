create table if not exists app_user_roles (
  user_id text primary key,
  role text not null check (role in ('owner', 'manager', 'animal_manager', 'staff', 'admin_developer')),
  assigned_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_user_roles_role_idx on app_user_roles (role);

create table if not exists app_audit_log (
  id uuid primary key,
  actor_user_id text not null,
  action text not null,
  resource_type text not null,
  resource_id text,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_audit_log_created_idx on app_audit_log (created_at desc);
create index if not exists app_audit_log_actor_idx on app_audit_log (actor_user_id, created_at desc);
create index if not exists app_audit_log_resource_idx on app_audit_log (resource_type, resource_id, created_at desc);
