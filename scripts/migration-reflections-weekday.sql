-- Migration: add weekday to lectionary_reflections
-- Run this in the Supabase Dashboard → SQL Editor (once), then run migrate-reflections-weekday.mjs

-- 1. Add weekday column (integer, nullable — NULL allowed for feast days)
ALTER TABLE lectionary_reflections ADD COLUMN IF NOT EXISTS weekday integer;

-- 2. Drop all old unique constraints that do not include weekday
ALTER TABLE lectionary_reflections
  DROP CONSTRAINT IF EXISTS lectionary_reflections_cycle_season_week_feast_key_lang_key;
ALTER TABLE lectionary_reflections
  DROP CONSTRAINT IF EXISTS lectionary_reflections_unique;

-- 3. Add new unique constraint that includes weekday
ALTER TABLE lectionary_reflections
  ADD CONSTRAINT lectionary_reflections_cycle_season_week_weekday_feast_key_lang_key
  UNIQUE (cycle, season, week, weekday, feast_key, lang);
