import { supabase } from './supabase'

export async function fetchSaint(monthDay) {
  var { data } = await supabase
    .from('saints')
    .select('*')
    .eq('month_day', monthDay)
    .maybeSingle()
  return data
}

export async function fetchReflection(date, lang) {
  var { data } = await supabase
    .from('reflections')
    .select('*')
    .eq('date', date)
    .eq('lang', lang || 'es')
    .eq('status', 'published')
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

export async function fetchDayReadings(date) {
  var { data } = await supabase
    .from('readings')
    .select('*')
    .eq('date', date)
    .maybeSingle()
  return data
}
