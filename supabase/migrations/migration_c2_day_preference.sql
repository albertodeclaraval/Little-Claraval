-- =====================================================================
-- Little Claraval — C2: preferencia editorial feria/fiesta por día
-- Proyecto Supabase: rsbhlglnrrivqdbtrzqj
-- Idempotente: se puede correr completo de nuevo sin romper nada.
-- =====================================================================

create table if not exists public.reflection_day_preference (
  date       date primary key,
  use_feast  boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.reflection_day_preference enable row level security;

-- Lectura pública: el cliente anon (app/lib/content.js, usado tanto en la
-- app pública como en /admin) necesita leer el toggle para resolver el
-- feast_key efectivo del día. La escritura solo pasa por el route de admin
-- (service role, bypassa RLS) — no hay policy de insert/update para
-- anon/authenticated.
drop policy if exists rdp_select_all on public.reflection_day_preference;
create policy rdp_select_all on public.reflection_day_preference
  for select to anon, authenticated using (true);
