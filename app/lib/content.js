import { supabase } from './supabase'
import { fetchLiturgicalDay } from './liturgical-api'

// ---- Liturgical position helpers ----

function normalizeSeason(apiSeason) {
  if (!apiSeason) return 'ordinary'
  var s = apiSeason.toLowerCase()
  if (s.includes('advent')) return 'advent'
  if (s.includes('christmas')) return 'christmas'
  if (s.includes('lent') || s.includes('holy week')) return 'lent'
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

// Hardcoded post-Pentecost ordinary time resume dates for known years.
// start = first Monday of resumed OT; week = OT week number of that Monday.
var RESUMED_ORDINARY_TIME = {
  2025: { start: new Date(2025, 5,  9), week: 9 },  // Mon Jun 9
  2026: { start: new Date(2026, 4, 25), week: 8 },  // Mon May 25
}

function ordinaryTimeWeek(date) {
  var d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  var entry = RESUMED_ORDINARY_TIME[date.getFullYear()]
  if (entry && d >= entry.start) {
    return entry.week + Math.floor((d - entry.start) / (7 * 86400000))
  }
  // Dynamic fallback: count back from Christ the King (last Sunday before Advent)
  var year = d.getFullYear()
  var DAY = 86400000
  var advStart = adventStart(year)
  var christKingMs = advStart.getTime() - 7 * DAY
  var dow = d.getDay()
  var nextSunMs = d.getTime() + (dow === 0 ? 0 : (7 - dow)) * DAY
  if (nextSunMs > christKingMs) return null
  return 34 - Math.round((christKingMs - nextSunMs) / (7 * DAY))
}

// Internal liturgical calendar fallback — used when the external API has no data for a year.
// Returns a structure compatible with the external API response format.
function computeLiturgicalDay(date) {
  var year = date.getFullYear()
  var DAY = 86400000
  // Normalize to midnight (local) so timestamp comparisons work regardless of time component
  var dNorm = new Date(year, date.getMonth(), date.getDate())
  var dMs = dNorm.getTime()

  var easter = easterSunday(year)
  var eMs = easter.getTime()
  var ashWedMs  = eMs - 46 * DAY
  var palmSunMs = eMs - 7 * DAY
  var ascMs     = eMs + 39 * DAY   // Ascension Thursday
  var pentMs    = eMs + 49 * DAY   // Pentecost Sunday
  var trinMs    = eMs + 56 * DAY   // Trinity Sunday
  var corpMs    = eMs + 63 * DAY   // Corpus Christi (transferred to Sunday in US)
  var shMs      = eMs + 68 * DAY   // Sacred Heart Friday

  var advStart = adventStart(year)
  var advMs = advStart.getTime()
  var christKingMs = advMs - 7 * DAY

  // Baptism of Lord = Sunday after Jan 6
  var jan6 = new Date(year, 0, 6)
  var jan6dow = jan6.getDay()
  var baptismMs = jan6.getTime() + (jan6dow === 0 ? 7 : 7 - jan6dow) * DAY

  var xmasMs = new Date(year, 11, 25).getTime()

  var season, week = null, celebName = null

  if (dMs >= advMs && dMs < xmasMs) {
    // Advent
    season = 'Advent'
    week = Math.floor((dMs - advMs) / (7 * DAY)) + 1
    if (week > 4) week = 4
  } else if (dMs >= xmasMs) {
    // Christmas (Dec 25 onward in same calendar year)
    season = 'Christmas'
    week = 0
    if (dMs === xmasMs) celebName = 'Nativity of the Lord'
  } else if (dMs <= baptismMs) {
    // Christmas season: Jan 1 through Baptism of Lord
    season = 'Christmas'
    week = 0
    if (dNorm.getMonth() === 0 && dNorm.getDate() === 1) celebName = 'Mary, Mother of God'
    else if (dNorm.getMonth() === 0 && dNorm.getDate() === 6) celebName = 'Epiphany of the Lord'
  } else if (dMs > baptismMs && dMs < ashWedMs) {
    // Ordinary Time before Lent
    season = 'Ordinary Time'
    var dowPre = dNorm.getDay()
    var prevSunMs = dMs - dowPre * DAY
    week = Math.round((prevSunMs - baptismMs) / (7 * DAY)) + 1
    if (week < 1) week = 1
  } else if (dMs >= ashWedMs && dMs < eMs) {
    // Lent and Holy Week
    if (dMs === ashWedMs) {
      season = 'Lent'; celebName = 'Ash Wednesday'; week = 0
    } else if (dMs >= palmSunMs) {
      season = 'Holy Week'
      if (dMs === palmSunMs) celebName = 'Palm Sunday'
      week = 6
    } else {
      season = 'Lent'
      var firstLentSunMs = ashWedMs + 4 * DAY  // Ash Wed (Wed) + 4 days = Sunday
      week = dMs < firstLentSunMs ? 0 : Math.floor((dMs - firstLentSunMs) / (7 * DAY)) + 1
    }
  } else if (dMs >= eMs && dMs <= pentMs) {
    // Easter season
    season = 'Easter'
    week = Math.floor((dMs - eMs) / (7 * DAY)) + 1
    if (dMs === ascMs) celebName = 'Ascension of the Lord'
    else if (dMs === pentMs) celebName = 'Pentecost Sunday'
  } else {
    // Ordinary Time after Pentecost (covers Trinity, Corpus Christi, etc.)
    season = 'Ordinary Time'
    var dowPost = dNorm.getDay()
    var nextSunMs = dMs + (dowPost === 0 ? 0 : (7 - dowPost)) * DAY
    week = 34 - Math.round((christKingMs - nextSunMs) / (7 * DAY))
    if (week < 1) week = 1
    if (week > 34) week = 34
    if (dMs === trinMs)        celebName = 'Most Holy Trinity'
    else if (dMs === corpMs)   celebName = 'Most Holy Body and Blood of Christ'
    else if (dMs === shMs)     celebName = 'Sacred Heart of Jesus'
    else if (dMs === christKingMs) celebName = 'Christ the King'
    else if (dNorm.getMonth() === 7 && dNorm.getDate() === 15) celebName = 'Assumption of the Blessed Virgin Mary'
    else if (dNorm.getMonth() === 10 && dNorm.getDate() === 1) celebName = 'All Saints'
    else if (dNorm.getMonth() === 11 && dNorm.getDate() === 8) celebName = 'Immaculate Conception'
  }

  return {
    season: season,
    week: week,
    celebration: celebName ? { name: celebName } : null,
  }
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
  ash_wednesday:         ['ash wednesday'],
  palm_sunday:           ['palm sunday'],
  ascension:             ['ascension of the lord'],
  pentecost:             ['pentecost sunday'],
  trinity:               ['most holy trinity', 'trinity sunday'],
  corpus_christi:        ['most holy body and blood', 'corpus christi'],
  sacred_heart:          ['sacred heart of jesus'],
  assumption:            ['assumption of the blessed virgin mary'],
  all_saints:            ['all saints'],
  immaculate_conception: ['immaculate conception'],
  christ_king:           ['christ the king', 'christ, king of the universe'],
}

// C2: memorias/fiestas cuyo uso depende del toggle feria/fiesta en /admin.
// Para sumar una: agregar key + patrones (minúsculas, matching por .includes).
var OPTIONAL_FEAST_KEY_MAP = {
  our_lady_mount_carmel: ['our lady of mount carmel'],
}

// Keys que SIEMPRE usan su liturgia propia (ignoran reflection_day_preference)
var ALWAYS_FEAST_KEYS = Object.keys(FEAST_KEY_MAP)

function matchFeastKey(name, map) {
  for (var key in map) {
    var patterns = map[key]
    for (var i = 0; i < patterns.length; i++) {
      if (name.includes(patterns[i])) return key
    }
  }
  return null
}

function getFeastKey(litDay) {
  if (!litDay || !litDay.celebration) return null
  var name = (litDay.celebration.name || '').toLowerCase()
  return matchFeastKey(name, FEAST_KEY_MAP) || matchFeastKey(name, OPTIONAL_FEAST_KEY_MAP)
}

// Fecha calendario LOCAL YYYY-MM-DD. No usar toISOString(): en zonas UTC+
// (un usuario en Europa/Asia) daría el día equivocado.
function localDateStr(d) {
  var y = d.getFullYear()
  var m = ('0' + (d.getMonth() + 1)).slice(-2)
  var day = ('0' + d.getDate()).slice(-2)
  return y + '-' + m + '-' + day
}

// C2: resuelve el feast_key efectivo según reflection_day_preference.
// - ALWAYS_FEAST_KEYS: siempre su key, sin toggle
// - memorias opcionales: key solo si use_feast=true; default feria
// - sin fila o error: feria (fail-safe)
async function resolveEffectiveFeastKey(d, rawFeastKey) {
  if (!rawFeastKey) {
    return { effective: null, rawFeastKey: null, useFeast: false, toggleable: false }
  }
  if (ALWAYS_FEAST_KEYS.indexOf(rawFeastKey) !== -1) {
    return { effective: rawFeastKey, rawFeastKey: rawFeastKey, useFeast: true, toggleable: false }
  }
  try {
    var { data } = await supabase
      .from('reflection_day_preference')
      .select('use_feast')
      .eq('date', localDateStr(d))
      .maybeSingle()
    var useFeast = !!(data && data.use_feast)
    return { effective: useFeast ? rawFeastKey : null, rawFeastKey: rawFeastKey, useFeast: useFeast, toggleable: true }
  } catch (e) {
    return { effective: null, rawFeastKey: rawFeastKey, useFeast: false, toggleable: true }
  }
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
  var { data, error } = await q.maybeSingle()
  if (error) console.warn('[queryByPosition] error', { table, lang, season, feastKey, cycle, week, code: error.code, msg: error.message })
  return data || null
}

// ---- Public fetch functions ----

export async function fetchDayReadings(date, lang) {
  try {
    var d = date instanceof Date ? date : new Date(date + 'T12:00:00')
    var litDay = await fetchLiturgicalDay(d)
    if (!litDay) litDay = computeLiturgicalDay(d)
    if (!litDay) return null

    var weekday = d.getDay()
    var season  = normalizeSeason(litDay.season)
    var feastKey = getFeastKey(litDay)
    var week = extractWeek(litDay.celebration && litDay.celebration.name)
    if (week === null) week = litDay.week || (litDay.celebration && litDay.celebration.week) || null
    if (week === null && season === 'easter') week = easterWeek(d)
    if (week === null && season === 'ordinary') week = ordinaryTimeWeek(d)

    // Annual solemnities use liturgical-year cycle (A/B/C) regardless of weekday;
    // ordinary ferial days use weekday cycle (I/II).
    var cycle = (feastKey || weekday === 0) ? sundayCycle(d) : weekdayCycle(d)
    var ferialCycle = weekday === 0 ? cycle : weekdayCycle(d)
    var lg = lang || 'es'

    var data = await queryByPosition('lectionary', lg, season, feastKey, cycle, weekday, week, true)
    // Some feasts are stored cycle='FIXED' (same reading every year — Nativity, Epiphany, etc.)
    if (!data && feastKey) {
      data = await queryByPosition('lectionary', lg, season, feastKey, 'FIXED', weekday, week, true)
    }
    if (!data && feastKey) {
      data = await queryByPosition('lectionary', lg, season, null, ferialCycle, weekday, week, true)
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
    if (!litDay) litDay = computeLiturgicalDay(d)
    if (!litDay) return null

    var weekday = d.getDay()
    var season  = normalizeSeason(litDay.season)
    var rawFeastKey = getFeastKey(litDay)
    var resolved = await resolveEffectiveFeastKey(d, rawFeastKey)
    var feastKey = resolved.effective
    var week = extractWeek(litDay.celebration && litDay.celebration.name)
    if (week === null) week = litDay.week || (litDay.celebration && litDay.celebration.week) || null
    if (week === null && season === 'easter') week = easterWeek(d)
    if (week === null && season === 'ordinary') week = ordinaryTimeWeek(d)

    var cycle = (feastKey || weekday === 0) ? sundayCycle(d) : weekdayCycle(d)
    var ferialCycle = weekday === 0 ? cycle : weekdayCycle(d)
    var lg = lang || 'es'

    console.log('[fetchDayReflection] query', { date: d.toISOString().slice(0,10), feastKey, cycle, season, weekday, week, lang: lg })

    var data = await queryByPosition('lectionary_reflections', lg, season, feastKey, cycle, weekday, week, true)
    if (!data && feastKey) {
      data = await queryByPosition('lectionary_reflections', lg, season, feastKey, 'FIXED', weekday, week, true)
    }
    if (!data && feastKey) {
      data = await queryByPosition('lectionary_reflections', lg, season, null, ferialCycle, weekday, week, true)
    }

    // EN fallback: if the EN row has no text content, fall back to ES so users
    // see a reflection rather than "in preparation" while EN content is being written.
    if (lg === 'en') {
      var hasContent = data && (data.reflexion || data.silence || data.meditative_phrase || data.inner_question || data.brief_prayer)
      if (!hasContent) {
        var esData = await queryByPosition('lectionary_reflections', 'es', season, feastKey, cycle, weekday, week, true)
        if (!esData && feastKey) {
          esData = await queryByPosition('lectionary_reflections', 'es', season, feastKey, 'FIXED', weekday, week, true)
        }
        if (!esData && feastKey) {
          esData = await queryByPosition('lectionary_reflections', 'es', season, null, ferialCycle, weekday, week, true)
        }
        if (esData) data = esData
      }
    }

    console.log('[fetchDayReflection] result', { lang: lg, found: !!data, hasReflexion: !!(data && data.reflexion) })
    return data
  } catch (e) {
    console.error('[fetchDayReflection] unexpected error', e)
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
    if (!litDay) litDay = computeLiturgicalDay(d)
    if (!litDay) return null

    var weekday = d.getDay()
    var season = normalizeSeason(litDay.season)
    var rawFeastKey = getFeastKey(litDay)
    var resolved = await resolveEffectiveFeastKey(d, rawFeastKey)
    var feastKey = resolved.effective || ''
    var week = extractWeek(litDay.celebration && litDay.celebration.name)
    if (week === null) week = litDay.week || (litDay.celebration && litDay.celebration.week) || null
    if (week === null && season === 'easter') week = easterWeek(d)
    if (week === null && season === 'ordinary') week = ordinaryTimeWeek(d)
    var cycle = (feastKey || weekday === 0) ? sundayCycle(d) : weekdayCycle(d)

    return {
      season, feastKey, cycle,
      week: week !== null ? week : null,
      weekday,
      celebrationName: litDay.celebration && litDay.celebration.name,
      litSeason: litDay.season,
      // C2
      rawFeastKey: resolved.rawFeastKey,
      useFeast: resolved.useFeast,
      toggleable: resolved.toggleable,
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
