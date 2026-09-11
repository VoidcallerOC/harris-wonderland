create table if not exists site_copy (
  key text primary key,
  label text not null,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by text
);
