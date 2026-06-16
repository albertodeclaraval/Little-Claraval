-- Fix 1: has_journal_access — entitlements de tier solo cuentan si el tier sigue activo.
-- Antes: un regalo vencido dejaba acceso real al contenido (fila en user_journal_entitlements
--        sobrevive a la expiración del gift porque no hay webhook time-based que la limpie).
create or replace function public.has_journal_access(p_slug text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_tier text := public.get_effective_tier_db(auth.uid());
begin
  if v_tier = 'claraval' then return true; end if;
  return exists (
    select 1 from public.user_journal_entitlements
    where user_id   = auth.uid()
      and journal_slug = upper(p_slug)
      and (source != 'tier' or v_tier != 'free')
  );
end; $$;

-- Fix 2: claim_journal — advisory lock por usuario previene la race condition TOCTOU
-- (dos requests simultáneos podían ambos pasar el SELECT COUNT y generar 2 inserts
--  cuando el slot era 1).
create or replace function public.claim_journal(p_slug text)
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_tier text; v_slug text := upper(p_slug); v_used int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  -- Lock por usuario: serializa claims concurrentes del mismo user
  perform pg_advisory_xact_lock(hashtext(v_uid::text));
  v_tier := public.get_effective_tier_db(v_uid);
  if v_tier = 'claraval' then return; end if;
  if public.tier_journal_slots(v_tier) = 0 then
    raise exception 'plan sin journals'; end if;
  if not exists (select 1 from journal_metadata
                 where upper(journal_slug)=v_slug and is_active) then
    raise exception 'journal desconocido: %', v_slug; end if;
  if exists (select 1 from user_journal_entitlements
             where user_id=v_uid and journal_slug=v_slug) then return; end if;
  select count(*) into v_used from user_journal_entitlements
   where user_id=v_uid and source='tier';
  if v_used >= public.tier_journal_slots(v_tier) then
    raise exception 'sin cupos libres'; end if;
  insert into user_journal_entitlements(user_id, journal_slug, source)
  values (v_uid, v_slug, 'tier');
end; $$;
