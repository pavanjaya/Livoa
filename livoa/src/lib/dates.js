export const pad = (n) => String(n).padStart(2, '0')

export function keyOf(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayKey() {
  return keyOf(new Date())
}

export function parseKey(k) {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(k, n) {
  const d = parseKey(k)
  d.setDate(d.getDate() + n)
  return keyOf(d)
}

// whole days between two day-keys (a - b)
export function diffDays(a, b) {
  return Math.round((parseKey(a) - parseKey(b)) / 86400000)
}

export function daysAgo(k) {
  if (!k) return null
  return diffDays(todayKey(), k)
}

export function niceDate(k) {
  if (!k) return '—'
  return parseKey(k).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function humanAgo(k) {
  if (!k) return 'never'
  const n = daysAgo(k)
  if (n <= 0) return 'today'
  if (n === 1) return 'yesterday'
  if (n < 7) return `${n} days ago`
  if (n < 14) return 'last week'
  if (n < 45) return `${Math.round(n / 7)} weeks ago`
  if (n < 350) return `${Math.round(n / 30)} months ago`
  return `${Math.round(n / 365)}y ago`
}

// days until the next occurrence of a MM-DD taken from a YYYY-MM-DD string
export function daysUntilBirthday(dateStr) {
  if (!dateStr) return null
  const [, m, d] = dateStr.split('-').map(Number)
  if (!m || !d) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  let next = new Date(now.getFullYear(), m - 1, d)
  if (next < now) next = new Date(now.getFullYear() + 1, m - 1, d)
  return Math.round((next - now) / 86400000)
}

export function ageAtNextBirthday(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || y < 1900) return null
  const now = new Date()
  const hadThisYear = new Date(now.getFullYear(), m - 1, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return now.getFullYear() - y + (hadThisYear ? 1 : 0)
}

// ISO-8601 week key like "2026-W36"
export function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function greeting(d = new Date()) {
  const h = d.getHours()
  if (h < 5) return 'Still up'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Winding down'
}
