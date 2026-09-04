import { todayKey, addDays, diffDays } from './dates.js'

export const METRICS = ['sleepProper', 'sleepEarly', 'water', 'screen']

const toMin = (t) => {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// bedtimes past midnight (00:00–04:59) count as "+1 day" so 01:30 reads as late
function bedtimeOk(bedtime, limit) {
  const b = toMin(bedtime)
  const l = toMin(limit)
  if (b == null || l == null) return false
  const bAdj = b < 300 ? b + 1440 : b
  const lAdj = l < 300 ? l + 1440 : l
  return bAdj <= lAdj
}

// For a single day's log, returns pass/fail/undefined per metric.
// undefined = "not logged for this metric" (does not extend or break a streak).
export function dayPass(log, goals) {
  const r = { sleepProper: undefined, sleepEarly: undefined, water: undefined, screen: undefined }
  if (!log) return r
  if (typeof log.sleepHours === 'number' && log.sleepHours > 0) {
    r.sleepProper = log.sleepHours >= goals.sleepMinHours
  }
  if (log.bedtime) {
    r.sleepEarly = bedtimeOk(log.bedtime, goals.bedtimeLimit)
  }
  if (typeof log.water === 'number' && log.water > 0) {
    r.water = log.water >= goals.waterTargetGlasses
  }
  if (typeof log.screen === 'number') {
    r.screen = log.screen <= goals.screenLimitHours
  }
  return r
}

// Consecutive passing days ending today (or yesterday if today isn't logged yet).
export function streakFor(metric, logs, goals, span = 180) {
  const t = todayKey()
  const todayVal = dayPass(logs[t], goals)[metric]

  let cursor
  let brokenToday = false
  if (todayVal === true) cursor = t
  else if (todayVal === false) {
    brokenToday = true
    return { current: 0, best: bestStreak(metric, logs, goals), brokenToday, todayVal }
  } else {
    cursor = addDays(t, -1)
  }

  let count = 0
  for (let i = 0; i < span; i++) {
    const v = dayPass(logs[cursor], goals)[metric]
    if (v === true) {
      count++
      cursor = addDays(cursor, -1)
    } else {
      break
    }
  }
  return { current: count, best: Math.max(count, bestStreak(metric, logs, goals)), brokenToday, todayVal }
}

export function bestStreak(metric, logs, goals) {
  const keys = Object.keys(logs).sort()
  let best = 0
  let run = 0
  let prev = null
  for (const k of keys) {
    const v = dayPass(logs[k], goals)[metric]
    if (v !== true) {
      run = 0
      prev = k
      continue
    }
    run = prev && diffDays(k, prev) === 1 ? run + 1 : 1
    best = Math.max(best, run)
    prev = k
  }
  return best
}

export const METRIC_INFO = {
  sleepProper: { label: 'Proper sleep', emoji: '🌙', unit: 'nights' },
  sleepEarly: { label: 'Asleep before 11', emoji: '🛏️', unit: 'nights' },
  water: { label: 'Hydrated', emoji: '💧', unit: 'days' },
  screen: { label: 'Under screen limit', emoji: '📵', unit: 'days' },
}
