-- ============================================================
-- SUPABASE: Fix 3 errores de importación
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- ERROR 1: liturgy_hours — CHECK constraints demasiado restrictivos
-- El Excel tiene 47 valores de season_variant (feast-specific)
-- que la tabla no acepta. Se eliminan los CHECK constraints.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE liturgy_hours DROP CONSTRAINT IF EXISTS liturgy_hours_season_variant_check;
ALTER TABLE liturgy_hours DROP CONSTRAINT IF EXISTS liturgy_hours_lang_check;

-- Opcional: recrear lang_check solo con los 2 valores usados
-- ALTER TABLE liturgy_hours ADD CONSTRAINT liturgy_hours_lang_check
--   CHECK (lang IN ('es', 'en'));


-- ─────────────────────────────────────────────────────────────
-- ERROR 2: journal_content — constraint viejo de 4 cols no eliminado
-- El script anterior no conocía el nombre exacto.
-- Eliminar CUALQUIER constraint único sobre journal_content
-- y dejar solo el de 5 columnas.
-- ─────────────────────────────────────────────────────────────

-- Primero: ver todos los constraints actuales (diagnóstico):
-- SELECT conname, pg_get_constraintdef(oid)
--   FROM pg_constraint
--   WHERE conrelid = 'journal_content'::regclass AND contype IN ('u','p');

-- Eliminar el constraint viejo de 4 cols (nombre reportado en el error):
ALTER TABLE journal_content DROP CONSTRAINT IF EXISTS journal_content_unique_question;

-- Eliminar también variantes por si existen:
ALTER TABLE journal_content DROP CONSTRAINT IF EXISTS journal_content_journal_slug_day_number_week_number_lang_key;
ALTER TABLE journal_content DROP CONSTRAINT IF EXISTS uq_journal_content;

-- Asegurar que el constraint de 5 cols existe (idempotente):
ALTER TABLE journal_content DROP CONSTRAINT IF EXISTS journal_content_unique;
ALTER TABLE journal_content
  ADD CONSTRAINT journal_content_unique
  UNIQUE (journal_slug, day_number, week_number, lang, question_number);


-- ─────────────────────────────────────────────────────────────
-- ERROR 3: lecturas/reflexiones — duplicados en Excel
-- Corregido en route.js con deduplicación por seen-map.
-- No requiere cambios en Supabase.
-- ─────────────────────────────────────────────────────────────
