import { todayKey, daysAgo, daysUntilBirthday, isoWeekKey } from './dates.js'
import { streakFor, METRICS } from './streaks.js'
import { topNotice } from './ai.js'

export const HANGOUT_THRESHOLD = 14

const WINS = {
  sleepProper: (n) => `${n} days of proper sleep. Your body says thank you 💤`,
  sleepEarly: (n) => `${n} nights asleep before 11. Future you is glowing ✨`,
  water: (n) => `${n} days hydrated. Keep sipping 💧`,
  screen: (n) => `${n} days under your screen limit. Eyes rested 📵`,
}
const WIN_EMOJI = { sleepProper: '🌙', sleepEarly: '🛏️', water: '💧', screen: '📵' }

// Pure: derives any *new* notifications + updated bookkeeping from current state.
export function derive(state) {
  const meta = JSON.parse(JSON.stringify(state.notifMeta || {}))
  const existing = new Set(state.notifications.map((n) => n.id))
  const out = []
  const add = (n) => {
    if (!existing.has(n.id)) out.push({ read: false, ts: Date.now(), ...n })
  }

  // --- streaks ---
  for (const key of METRICS) {
    const { current } = streakFor(key, state.logs, state.goals)
    const m = meta[key] || { milestone: 0, last: 0 }
    const milestone = Math.floor(current / 7) * 7

    if (milestone >= 7 && milestone > (m.milestone || 0)) {
      add({
        id: `streak:${key}:${milestone}`,
        kind: 'win',
        emoji: WIN_EMOJI[key],
        title: 'Streak unlocked',
        body: WINS[key](milestone),
      })
      m.milestone = milestone
    }

    // a real streak (7+) just collapsed to zero -> gentle nudge, never a scolding
    if ((m.last || 0) >= 7 && current === 0) {
      add({
        id: `break:${key}:${todayKey()}`,
        kind: 'soft',
        emoji: '🤍',
        title: 'Streak ended',
        body: 'Life happens. Start again?',
      })
      m.milestone = 0
    }

    m.last = current
    meta[key] = m
  }

  // --- people ---
  for (const p of state.people || []) {
    if (p.lastHangout) {
      const n = daysAgo(p.lastHangout)
      if (n >= HANGOUT_THRESHOLD) {
        add({
          id: `hangout:${p.id}:${p.lastHangout}`,
          kind: 'nudge',
          emoji: '👀',
          title: 'Miss them?',
          body: `You haven't hung out with ${p.name} in ${n} days 👀`,
          personId: p.id,
        })
      }
    }
    const bd = daysUntilBirthday(p.birthday)
    if (bd !== null && bd <= 3) {
      add({
        id: `bday:${p.id}:${new Date().getFullYear()}`,
        kind: 'nudge',
        emoji: '🎂',
        title: 'Birthday coming up',
        body:
          bd === 0
            ? `It's ${p.name}'s birthday today 🎂`
            : `${p.name}'s birthday is in ${bd} day${bd > 1 ? 's' : ''} 🎂`,
        personId: p.id,
      })
    }
  }

  // --- Livoa AI: one gentle "noticed" note per day, when something's worth saying ---
  const notice = topNotice(state)
  if (notice) {
    add({
      id: `ai:${todayKey()}:${notice.id}`,
      kind: 'ai',
      emoji: notice.emoji,
      title: 'Livoa noticed 👀',
      body: notice.lines.join(' ') + (notice.suggestion ? `\nTiny suggestion: ${notice.suggestion}` : ''),
    })
  }

  // --- weekly check-in ---
  const wk = isoWeekKey()
  const wmeta = meta.weekly || {}
  const hasHistory = Object.keys(state.logs).length > 0 || (state.people || []).length > 0
  if (hasHistory && wmeta.lastWeek !== wk) {
    const name = (state.profile && state.profile.name) || 'friend'
    const lines = [
      `Great ${name}! You've changed a lot this week — keep going!`,
      `${name}, this week looked good on you. Onward. 🌤️`,
      `A whole week, ${name}. Quiet progress still counts. 🌱`,
      `You showed up this week, ${name}. That's the whole thing. ✨`,
    ]
    const wn = parseInt(wk.slice(-2), 10) || 0
    add({ id: `weekly:${wk}`, kind: 'week', emoji: '📅', title: 'Your week with Livoa', body: lines[wn % lines.length] })
    meta.weekly = { lastWeek: wk }
  }

  return { notifs: out, meta }
}

export const KIND_STYLE = {
  win: { tag: 'win', label: 'Streak' },
  soft: { tag: 'soft', label: 'Gentle' },
  nudge: { tag: 'nudge', label: 'People' },
  hello: { tag: 'hello', label: 'Livoa' },
  ai: { tag: 'ai', label: 'Livoa AI' },
  week: { tag: 'week', label: 'Weekly' },
}
