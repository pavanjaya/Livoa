import { todayKey, addDays, daysAgo } from './dates.js'
import { streakFor } from './streaks.js'

// Livoa AI: warm, tiny, human observations from recent habit data.
// No percentages, no charts — just "here's what I'm noticing" + one small nudge.

const toMin = (t) => {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const bedAdj = (t) => {
  const b = toMin(t)
  return b == null ? null : b < 300 ? b + 1440 : b
}

// most recent `count` logged values for a field, walking back from yesterday
function series(logs, field, count, offset = 0) {
  const out = []
  for (let i = 0; i < count; i++) {
    const k = addDays(todayKey(), -(1 + offset + i))
    const v = logs[k] ? logs[k][field] : undefined
    if (v == null || v === '') continue
    if (typeof v === 'number' && v === 0 && field !== 'screen') continue
    out.push(v)
  }
  return out
}
const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null)

export function getInsights(state) {
  const { logs, goals, people } = state
  const loggedDays = Object.keys(logs).length
  const out = []

  const sleepA = series(logs, 'sleepHours', 4)
  const sleepB = series(logs, 'sleepHours', 4, 4)
  const beds = series(logs, 'bedtime', 5).map(bedAdj).filter((x) => x != null)
  const water = series(logs, 'water', 3)
  const screen = series(logs, 'screen', 3)
  const limit = bedAdj(goals.bedtimeLimit)

  if (beds.length >= 3 && limit != null) {
    const late = beds.filter((b) => b > limit + 5).length
    if (late >= Math.ceil(beds.length * 0.6)) {
      const lines = ["You've been sleeping late lately."]
      if (avg(sleepA) != null && avg(sleepA) < goals.sleepMinHours) lines.push('Your energy is also kinda down.')
      out.push({
        id: 'late', tone: 'notice', emoji: '👀', lines,
        suggestion: 'Try sleeping 30 mins earlier tonight. 🌙',
      })
    }
  }

  if (sleepA.length >= 2 && sleepB.length >= 2 && avg(sleepB) - avg(sleepA) >= 0.6) {
    out.push({
      id: 'sleepdrop', tone: 'notice', emoji: '🌙',
      lines: ["Your sleep's been a little shorter this week.", 'Tiny changes add up here.'],
      suggestion: 'A slow wind-down tonight — dim lights, no scrolling. 🫧',
    })
  }

  if (water.length >= 2 && avg(water) < goals.waterTargetGlasses * 0.6) {
    out.push({
      id: 'water', tone: 'notice', emoji: '💧',
      lines: ["You've been a bit under on water.", 'Easy one to turn around.'],
      suggestion: 'Keep a full glass where you can see it today. 💧',
    })
  }

  if (screen.length >= 2 && avg(screen) > goals.screenLimitHours + 0.5) {
    out.push({
      id: 'screen', tone: 'notice', emoji: '📵',
      lines: ['Screen time crept up the last few days.', 'Your eyes have been working overtime.'],
      suggestion: 'Park the phone 30 mins before bed tonight. 🌙',
    })
  }

  const overdue = (people || [])
    .filter((p) => p.lastHangout && daysAgo(p.lastHangout) >= 14)
    .sort((a, b) => daysAgo(b.lastHangout) - daysAgo(a.lastHangout))
  if (overdue.length) {
    const n = overdue[0]
    out.push({
      id: 'people', tone: 'notice', emoji: '💌',
      lines: [`It's been a while since you saw ${n.name}.`, 'No pressure — just noticing.'],
      suggestion: `Send ${n.name} a quick “thinking of you”. 💌`,
    })
  }

  const streaks = ['sleepProper', 'sleepEarly', 'water', 'screen'].map((m) => streakFor(m, logs, goals).current)
  if (out.length === 0 && streaks.filter((s) => s >= 4).length >= 2) {
    out.push({
      id: 'steady', tone: 'cheer', emoji: '🌤️',
      lines: ["You've been really steady lately.", "Whatever you're doing — it's working."],
    })
  }

  if (loggedDays < 3) {
    out.push({
      id: 'learn', tone: 'cheer', emoji: '🌱',
      lines: ["Log a few more days and I'll start spotting your patterns.", 'I get more useful the more you check in.'],
    })
  }

  if (out.length === 0) {
    out.push({
      id: 'calm', tone: 'cheer', emoji: '✨',
      lines: ["Nothing's jumping out at me today.", "That's usually a good sign."],
    })
  }

  return out
}

export function topNotice(state) {
  return getInsights(state).find((i) => i.tone === 'notice') || null
}
