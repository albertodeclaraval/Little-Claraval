-- ============================================================
-- SUPABASE: Fix constraints para Little Claraval
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- PASO 0: Diagnóstico — ver constraints actuales
-- SELECT conname, pg_get_constraintdef(oid)
--   FROM pg_constraint
--   WHERE conrelid = 'journal_content'::regclass AND contype = 'u';

-- PASO 1: Añadir columnas si no existen en journal_content
ALTER TABLE journal_content ADD COLUMN IF NOT EXISTS question_number integer NOT NULL DEFAULT 1;
ALTER TABLE journal_content ADD COLUMN IF NOT EXISTS section_type text NOT NULL DEFAULT 'question';

-- PASO 2: Borrar constraint anterior en journal_content (cualquier variante de nombre)
ALTER TABLE journal_content DROP CONSTRAINT IF EXISTS journal_content_journal_slug_day_number_week_number_lang_key;
ALTER TABLE journal_content DROP CONSTRAINT IF EXISTS journal_content_unique;
ALTER TABLE journal_content DROP CONSTRAINT IF EXISTS uq_journal_content;

-- PASO 3: Crear constraint correcto de 5 columnas
ALTER TABLE journal_content
  ADD CONSTRAINT journal_content_unique
  UNIQUE (journal_slug, day_number, week_number, lang, question_number);

-- PASO 4: Verificar constraint en lectionary_reflections
ALTER TABLE lectionary_reflections DROP CONSTRAINT IF EXISTS lectionary_reflections_unique;
ALTER TABLE lectionary_reflections
  ADD CONSTRAINT lectionary_reflections_unique
  UNIQUE (cycle, season, week, feast_key, lang);
