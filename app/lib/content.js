import { supabase } from './supabase'

var ROSARY_SETS = {
  0: 'gloriosos', 1: 'gozosos', 2: 'dolorosos',
  3: 'gloriosos', 4: 'luminosos', 5: 'dolorosos', 6: 'gozosos'
}

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

export async function fetchLiturgyHour(hourType, psalterWeek, weekday, season, lang) {
  var query = supabase
    .from('liturgy_hours')
    .select('*')
    .eq('hour_type', hourType)
    .eq('lang', lang || 'es')
  var { data } = await query.limit(1)
  return data && data.length > 0 ? data[0] : null
}

export async function fetchRosary(weekday, lang) {
  var mysterySet = ROSARY_SETS[weekday] || 'gozosos'
  var { data } = await supabase
    .from('rosary_mysteries')
    .select('*')
    .eq('mystery_set', mysterySet)
    .eq('lang', lang || 'es')
    .maybeSingle()
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
