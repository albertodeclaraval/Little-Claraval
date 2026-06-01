import { supabase } from './supabase'
import { fetchLiturgicalDay } from './liturgical-api'

// ---- Liturgical position helpers ----

function normalizeSeason(apiSeason) {
  if (!apiSeason) return 'ordinary'
  var s = apiSeason.toLowerCase()
  if (s.includes('advent')) return 'advent'
  if (s.includes('christmas')) return 'christmas'
  if (s.includes('lent')) return 'lent'
  if (s.includes('easter') || s.includes('eastertide')) return 'easter'
  return 'ordinary'
}

// Extract ordinal week number from celebration name
// "7th Sunday of Easter" → 7, "Wednesday of the 18th Week in Ordinary Time" → 18
function extractWeek(name) {
  if (!name) return null
  var m = name.match(/\b(\d+)(st|nd|rd|th)\b/i)
  return m ? parseInt(m[1]) : null
}

// Easter Sunday for a given year (Meeus/Jones/Butcher algorithm)
function easterSunday(year) {
  var a = year % 19, b = Math.floor(year / 100), c = year % 100
  var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
  var g = Math.floor((b - f + 1) / 3)
  var h = (19 * a + b - d - g + 15) % 30
  var i = Math.floor(c / 4), k = c % 4
  var l = (32 + 2 * e + 2 * i - h - k) % 7
  var m2 = Math.floor((a + 11 * h + 22 * l) / 451)
  var mo = Math.floor((h + l - 7 * m2 + 114) / 31)
  var dy = ((h + l - 7 * m2 + 114) % 31) + 1
  return new Date(year, mo - 1, dy)
}

// Week within Easter season (1 = Easter Sunday's week)
function easterWeek(date) {
  var d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  var e = easterSunday(date.getFullYear())
  var eDay = new Date(e.getFullYear(), e.getMonth(), e.getDate())
  var days = Math.round((d - eDay) / 86400000)
  return Math.floor(days / 7) + 1
}

// First Sunday of Advent for a calendar year (nearest Sunday to Nov 30, range Nov 27–Dec 3)
function adventStart(year) {
  var nov30 = new Date(year, 10, 30)
  var dow = nov30.getDay()
  var offset = dow <= 3 ? -dow : (7 - dow)
  return new Date(year, 10, 30 + offset)
}

// Calendar year when Advent begins for this liturgical year
function litYear(date) {
  var y = date.getFullYear()
  return date >= adventStart(y) ? y : y - 1
}

// Sunday lectionary cycle A/B/C (litYear % 3: 0→A, 1→B, 2→C)
function sundayCycle(date) {
  return ['A', 'B', 'C'][litYear(date) % 3]
}

// Weekday lectionary cycle I/II (even calendar year → II, odd → I)
function weekdayCycle(date) {
  return date.getFullYear() % 2 === 0 ? 'II' : 'I'
}

// Map common fixed feast names (from external API) to feast_key values
var FEAST_KEY_MAP = {
  nativity:              ['nativity of the lord', 'christmas day'],
  epiphany:              ['epiphany of the lord'],
  holy_family:           ['holy family'],
  mary_mother:           ['mary, mother of god', 'solemnity of mary'],
  ascension:             ['ascension of the lord'],
  pentecost:             ['pentecost sunday'],
  trinity:               ['most holy trinity', 'trinity sunday'],
  corpus_christi:        ['most holy body and blood', 'corpus christi'],
  sacred_heart:          ['sacred heart of jesus'],
  assumption:            ['assumption of the blessed virgin mary'],
  all_saints:            ['all saints'],
  immaculate_conception: ['immaculate conception'],
}

function getFeastKey(litDay) {
  if (!litDay || !litDay.celebration) return null
  var name = (litDay.celebration.name || '').toLowerCase()
  for (var key in FEAST_KEY_MAP) {
    var patterns = FEAST_KEY_MAP[key]
    for (var i = 0; i < patterns.length; i++) {
      if (name.includes(patterns[i])) return key
    }
  }
  return null
}

// Execute a query against `table` using the given liturgical parameters.
// `includeWeekday` is false for lectionary_reflections (no weekday column).
async function queryByPosition(table, lang, season, feastKey, cycle, weekday, week, includeWeekday) {
  var q = supabase.from(table).select('*').eq('lang', lang).eq('season', season)
  if (feastKey) {
    q = q.eq('cycle', cycle).eq('feast_key', feastKey)
  } else {
    q = q.eq('cycle', cycle).eq('feast_key', '')
    if (includeWeekday) q = q.eq('weekday', weekday)
    if (week !== null && week !== undefined) q = q.eq('week', week)
  }
  var { data } = await q.maybeSingle()
  return data || null
}

// ---- Public fetch functions ----

export async function fetchDayReadings(date, lang) {
  try {
    var d = date instanceof Date ? date : new Date(date + 'T12:00:00')
    var litDay = await fetchLiturgicalDay(d)
    if (!litDay) return null

    var weekday = d.getDay()
    var season  = normalizeSeason(litDay.season)
    var feastKey = getFeastKey(litDay)
    var week = extractWeek(litDay.celebration && litDay.celebration.name)
    if (week === null && season === 'easter') week = easterWeek(d)

    var cycle = weekday === 0 ? sundayCycle(d) : weekdayCycle(d)
    var lg = lang || 'es'

    var data = await queryByPosition('lectionary', lg, season, feastKey, cycle, weekday, week, true)

    // If known fixed feast has no row, fall back to the weekday reading
    if (!data && feastKey) {
      data = await queryByPosition('lectionary', lg, season, null, cycle, weekday, week, true)
    }

    return data
  } catch (e) {
    return null
  }
}

export async function fetchDayReflection(date, lang) {
  try {
    var d = date instanceof Date ? date : new Date(date + 'T12:00:00')
    var litDay = await fetchLiturgicalDay(d)
    if (!litDay) return null

    var weekday = d.getDay()
    var season  = normalizeSeason(litDay.season)
    var feastKey = getFeastKey(litDay)
    var week = extractWeek(litDay.celebration && litDay.celebration.name)
    if (week === null && season === 'easter') week = easterWeek(d)

    var cycle = weekday === 0 ? sundayCycle(d) : weekdayCycle(d)
    var lg = lang || 'es'

    console.log('[fetchDayReflection]', { dateStr: d.toISOString().slice(0,10), feastKey, cycle, season, weekday, week, lang: lg })

    // lectionary_reflections has no weekday column — reflections are per-week
    var data = await queryByPosition('lectionary_reflections', lg, season, feastKey, cycle, weekday, week, false)

    if (!data && feastKey) {
      data = await queryByPosition('lectionary_reflections', lg, season, null, cycle, weekday, week, false)
    }

    return data
  } catch (e) {
    return null
  }
}

export async function fetchSaint(monthDay) {
  var { data } = await supabase
    .from('saints')
    .select('*')
    .eq('month_day', monthDay)
    .maybeSingle()
  return data
}

export async function fetchLiturgyHour(hourType, psalterWeek, weekday, seasonVariant, lang) {
  var query = supabase
    .from('liturgy_hours')
    .select('*')
    .eq('hour_type', hourType)
    .eq('lang', lang || 'es')
  if (weekday !== null && weekday !== undefined) {
    query = query.eq('weekday', weekday)
  }
  if (psalterWeek) {
    query = query.eq('psalter_week', psalterWeek)
  }
  if (seasonVariant) {
    query = query.eq('season_variant', seasonVariant)
  }
  var { data } = await query.limit(1)
  return data && data.length > 0 ? data[0] : null
}

export async function fetchRosary(weekday, lang) {
  var { data, error } = await supabase
    .from('rosary_mysteries')
    .select('*')
    .contains('weekdays', [weekday])
    .eq('lang', lang || 'es')
    .maybeSingle()
  console.log('[fetchRosary] weekday=%d lang=%s data=%o error=%o', weekday, lang || 'es', data, error)
  return data
}

export async function fetchChaplet(lang) {
  var { data } = await supabase
    .from('divine_mercy_chaplet')
    .select('*')
    .eq('lang', lang || 'es')
    .maybeSingle()
  return data
}

export async function fetchAppLinks() {
  var { data } = await supabase
    .from('app_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data || []
}

export async function getJournalEntries(userId, journalSlug, dayNumber, lang) {
  var { data } = await supabase
    .from('journal_entries')
    .select('question_number, response_text')
    .eq('user_id', userId)
    .eq('journal_slug', journalSlug)
    .eq('day_number', dayNumber)
    .eq('lang', lang || 'es')
    .order('question_number')
  return data || []
}

export async function saveJournalEntries(userId, journalSlug, dayNumber, lang, entries) {
  var lg = lang || 'es'
  var records = entries.map(function(e) {
    return {
      user_id: userId,
      journal_slug: journalSlug,
      day_number: dayNumber,
      lang: lg,
      question_number: e.question_number,
      response_text: e.response_text,
      updated_at: new Date().toISOString()
    }
  })
  var { error } = await supabase
    .from('journal_entries')
    .upsert(records, { onConflict: 'user_id,journal_slug,day_number,question_number,lang' })
  return error
}

export async function getLiturgicalPosition(date) {
  try {
    var d = date instanceof Date ? date : new Date(date + 'T12:00:00')
    var litDay = await fetchLiturgicalDay(d)
    if (!litDay) return null

    var weekday = d.getDay()
    var season = normalizeSeason(litDay.season)
    var feastKey = getFeastKey(litDay) || ''
    var week = extractWeek(litDay.celebration && litDay.celebration.name)
    if (week === null && season === 'easter') week = easterWeek(d)
    var cycle = weekday === 0 ? sundayCycle(d) : weekdayCycle(d)

    return {
      season, feastKey, cycle,
      week: week !== null ? week : null,
      weekday,
      celebrationName: litDay.celebration && litDay.celebration.name,
      litSeason: litDay.season,
    }
  } catch(e) {
    return null
  }
}

export async function getJournalDay(journalSlug, unitNumber, lang, isWeekly) {
  var lg = lang || 'es'
  var contentQuery = supabase
    .from('journal_content')
    .select('title, content, question_number')
    .eq('journal_slug', journalSlug)
    .eq('section_type', 'question')
    .eq('lang', lg)
    .order('question_number')
  if (isWeekly) contentQuery = contentQuery.eq('week_number', unitNumber)
  else contentQuery = contentQuery.eq('day_number', unitNumber)

  var [metaRes, questionsRes] = await Promise.all([
    supabase.from('journal_metadata').select('description, opening_prayer, closing_prayer').eq('journal_slug', journalSlug).eq('lang', lg).maybeSingle(),
    contentQuery
  ])

  return {
    metadata: metaRes.data || null,
    questions: questionsRes.data || []
  }
}
