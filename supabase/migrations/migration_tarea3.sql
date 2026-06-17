-- =====================================================================
-- Little Claraval — Tarea 3: Entitlements por usuario + gating de journals
-- Proyecto Supabase: rsbhlglnrrivqdbtrzqj
-- Idempotente: se puede correr completo de nuevo sin romper nada.
-- =====================================================================

-- ── 1. Tabla de entitlements ─────────────────────────────────────────
create table if not exists public.user_journal_entitlements (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  journal_slug text not null,
  source       text not null check (source in ('tier','addon','redemption')),
  granted_at   timestamptz not null default now(),
  unique (user_id, journal_slug)   -- una sola entrada por journal, da igual la fuente
);
create index if not exists uje_user_idx
  on public.user_journal_entitlements (user_id);

alter table public.user_journal_entitlements enable row level security;

-- El usuario solo LEE lo suyo; nadie escribe desde el cliente.
-- Todas las concesiones pasan por funciones SECURITY DEFINER o service role.
drop policy if exists uje_select_own on public.user_journal_entitlements;
create policy uje_select_own on public.user_journal_entitlements
  for select to authenticated using (user_id = auth.uid());

-- ── 2. Helpers de tier ───────────────────────────────────────────────
create or replace function public.tier_level(p_tier text)
returns int language sql immutable as $$
  select case p_tier when 'claraval' then 3 when 'discipulo' then 2
                     when 'peregrino' then 1 else 0 end;
$$;

create or replace function public.tier_journal_slots(p_tier text)
returns int language sql immutable as $$
  select case p_tier when 'peregrino' then 1 when 'discipulo' then 3
                     when 'claraval' then 9 else 0 end;
$$;

-- Espejo EXACTO de getEffectiveTier(profile) del frontend:
--   paid  = (subscription_status = 'active') ? subscription_tier : free
--   gift  = (gift_tier && gift_expires_at futuro) ? gift_tier : free
--   empate -> gana paid
create or replace function public.get_effective_tier_db(p_uid uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare r public.profiles%rowtype; v_paid text := 'free'; v_gift text := 'free';
begin
  select * into r from public.profiles where id = p_uid;
  if not found then return 'free'; end if;
  if r.subscription_status = 'active' and r.subscription_tier is not null then
    v_paid := r.subscription_tier;
  end if;
  if r.gift_tier is not null and r.gift_expires_at is not null
     and r.gift_expires_at > now() then
    v_gift := r.gift_tier;
  end if;
  return case when public.tier_level(v_gift) > public.tier_level(v_paid)
              then v_gift else v_paid end;
end; $$;

-- ── 3. Acceso + gating de contenido ──────────────────────────────────
create or replace function public.has_journal_access(p_slug text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.get_effective_tier_db(auth.uid()) = 'claraval'
      or exists (select 1 from public.user_journal_entitlements
                 where user_id = auth.uid() and journal_slug = upper(p_slug));
$$;

alter table public.journal_content enable row level security;
drop policy if exists journal_content_public_read   on public.journal_content;
drop policy if exists journal_content_entitled_read on public.journal_content;
create policy journal_content_entitled_read on public.journal_content
  for select to authenticated
  using (public.has_journal_access(journal_slug));

-- ── 4. Selección de cupos (peregrino/discipulo) ──────────────────────
create or replace function public.claim_journal(p_slug text)
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_tier text; v_slug text := upper(p_slug); v_used int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  v_tier := public.get_effective_tier_db(v_uid);
  if v_tier = 'claraval' then return; end if;                       -- ya tiene todo
  if public.tier_journal_slots(v_tier) = 0 then
    raise exception 'plan sin journals'; end if;
  if not exists (select 1 from journal_metadata
                 where upper(journal_slug)=v_slug and is_active) then
    raise exception 'journal desconocido: %', v_slug; end if;
  if exists (select 1 from user_journal_entitlements
             where user_id=v_uid and journal_slug=v_slug) then return; end if;  -- idempotente
  select count(*) into v_used from user_journal_entitlements
   where user_id=v_uid and source='tier';
  if v_used >= public.tier_journal_slots(v_tier) then
    raise exception 'sin cupos libres'; end if;
  insert into user_journal_entitlements(user_id, journal_slug, source)
  values (v_uid, v_slug, 'tier');
end; $$;

create or replace function public.release_journal(p_slug text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from public.user_journal_entitlements
   where user_id = auth.uid() and journal_slug = upper(p_slug) and source = 'tier';
  -- solo borra source='tier' -> nunca toca add-ons ni canjes
end; $$;

grant execute on function public.claim_journal(text)   to authenticated;
grant execute on function public.release_journal(text) to authenticated;
