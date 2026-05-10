var cache = {}

function formatDateForApi(date) {
  var d = date instanceof Date ? date : new Date(date)
  var year = d.getFullYear()
  var month = String(d.getMonth() + 1).padStart(2, '0')
  var day = String(d.getDate()).padStart(2, '0')
  return year + '/' + month + '-' + day
}

function cacheKey(prefix, date) {
  return prefix + '-' + formatDateForApi(date)
}

export async function fetchDailyReadings(date) {
  var d = date instanceof Date ? date : new Date(date)
  var key = cacheKey('readings', d)
  if (cache[key]) return cache[key]
  try {
    var url = 'https://cpbjr.github.io/catholic-readings-api/readings/' + formatDateForApi(d) + '.json'
    var res = await fetch(url)
    if (!res.ok) return null
    var data = await res.json()
    cache[key] = data
    return data
  } catch (e) {
    return null
  }
}

export async function fetchLiturgicalDay(date) {
  var d = date instanceof Date ? date : new Date(date)
  var key = cacheKey('calendar', d)
  if (cache[key]) return cache[key]
  try {
    var url = 'https://cpbjr.github.io/catholic-readings-api/liturgical-calendar/' + formatDateForApi(d) + '.json'
    var res = await fetch(url)
    if (!res.ok) return null
    var data = await res.json()
    cache[key] = data
    return data
  } catch (e) {
    return null
  }
}
