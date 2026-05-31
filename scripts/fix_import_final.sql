-- ============================================================
-- SUPABASE: Fix definitivo (nuclear) — todos los errores
-- Ejecutar completo en: Supabase Dashboard → SQL Editor
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- A) liturgy_hours — borrar TODOS los CHECK constraints
--    (season_variant_check, lang_check, weekday_check,
--     psalter_week_check, y cualquier otro)
-- ─────────────────────────────────────────────────────────────

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'liturgy_hours'::regclass
    AND contype = 'c'
  LOOP
    EXECUTE 'ALTER TABLE liturgy_hours DROP CONSTRAINT ' || quote_ident(r.conname);
    RAISE NOTICE 'Dropped CHECK: %', r.conname;
  END LOOP;
END $$;


-- ─────────────────────────────────────────────────────────────
-- B) journal_content — borrar TODOS los unique constraints
--    y recrear solo el correcto de 5 columnas
-- ─────────────────────────────────────────────────────────────

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'journal_content'::regclass
    AND contype = 'u'
  LOOP
    EXECUTE 'ALTER TABLE journal_content DROP CONSTRAINT ' || quote_ident(r.conname);
    RAISE NOTICE 'Dropped UNIQUE: %', r.conname;
  END LOOP;
END $$;

-- Asegurar columnas requeridas
ALTER TABLE journal_content ADD COLUMN IF NOT EXISTS question_number integer NOT NULL DEFAULT 1;
ALTER TABLE journal_content ADD COLUMN IF NOT EXISTS section_type text NOT NULL DEFAULT 'question';

-- Recrear constraint correcto
ALTER TABLE journal_content
  ADD CONSTRAINT journal_content_uq
  UNIQUE (journal_slug, day_number, week_number, lang, question_number);


-- ─────────────────────────────────────────────────────────────
-- C) Verificación — ver qué quedó
-- ─────────────────────────────────────────────────────────────

SELECT 'liturgy_hours CHECK constraints restantes:' AS info,
       conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'liturgy_hours'::regclass AND contype = 'c'
UNION ALL
SELECT 'journal_content UNIQUE constraints:',
       conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'journal_content'::regclass AND contype = 'u';
