import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { todayKey, addDays, keyOf } from './lib/dates.js'

const KEY = 'livoa.v1'
const uid = () => Math.random().toString(36).slice(2, 10)

const defaultState = {
  version: 1,
  seeded: false,
  onboarded: false,
  profile: { name: 'friend', avatar: '🌙', picture: null },
  theme: { preset: 'cloud', custom: { background: 'Light', accent: 'purple', style: 'Soft', mood: 'Calm' }, font: 'nunito', picture: true, wallpaper: null },
  widgets: {
    affirmation: true, sleep: true, water: true, screen: true,
    streaks: true, people: true, goals: true, livoaAI: true,
  },
  goals: { sleepMinHours: 7, bedtimeLimit: '23:00', waterTargetGlasses: 8, screenLimitHours: 4 },
  logs: {},
  goalList: [],
  affirmations: [],
  people: [],
  notifications: [],
  notifMeta: {},
}

function merge(saved) {
  if (!saved) return defaultState
  return {
    ...defaultState,
    ...saved,
    profile: { ...defaultState.profile, ...saved.profile },
    theme: { ...defaultState.theme, ...saved.theme },
    widgets: { ...defaultState.widgets, ...saved.widgets },
    goals: { ...defaultState.goals, ...saved.goals },
  }
}

function sampleData(state) {
  const t = todayKey()
  const logs = { ...state.logs }
  for (let i = 1; i <= 12; i++) {
    logs[addDays(t, -i)] = { sleepHours: 7.5, bedtime: '22:40', water: 8, screen: 3 }
  }
  const bdaySoon = () => {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    return `1998-${keyOf(d).slice(5)}`
  }
  return {
    ...state,
    seeded: true,
    logs,
    people: [
      {
        id: uid(), name: 'Aarav', emoji: '🧑🏽',
        birthday: '', lastHangout: addDays(t, -18), lastCall: addDays(t, -4),
        memories: [{ id: uid(), text: 'Late night drive to the coast, terrible playlist', date: addDays(t, -18) }],
      },
      {
        id: uid(), name: 'Mia', emoji: '👩🏻',
        birthday: bdaySoon(), lastHangout: addDays(t, -5), lastCall: addDays(t, -1),
        memories: [],
      },
    ],
    goalList: [
      { id: uid(), text: 'Read 10 pages a day', done: false, createdAt: Date.now() },
      { id: uid(), text: 'Sleep by 11 on weekdays', done: true, createdAt: Date.now() },
    ],
    affirmations: [
      { id: uid(), text: 'I am allowed to rest.' },
      { id: uid(), text: 'Small steps still count.' },
      { id: uid(), text: 'I move at my own pace.' },
    ],
    notifications: [
      {
        id: 'hello:1', kind: 'hello', emoji: '🌸', title: 'Welcome to livoa',
        body: 'Your life, your vibe. Log a habit and your streaks start today.',
        ts: Date.now(), read: false,
      },
    ],
  }
}

function sampleSlump(state) {
  const base = sampleData(state)
  const t = todayKey()
  const logs = { ...base.logs }
  logs[addDays(t, -1)] = { sleepHours: 6, bedtime: '23:55', water: 5, screen: 5.5 }
  logs[addDays(t, -2)] = { sleepHours: 6.5, bedtime: '23:45', water: 5, screen: 5 }
  logs[addDays(t, -3)] = { sleepHours: 6.5, bedtime: '23:35', water: 6, screen: 4.5 }
  return {
    ...base,
    logs,
    notifications: [
      { id: 'break:sample', kind: 'soft', emoji: '🤍', title: 'Streak ended', body: 'Life happens. Start again?', ts: Date.now() - 3600e3, read: false },
      { id: 'hello:1', kind: 'hello', emoji: '🌸', title: 'Welcome to livoa', body: 'Your life, your vibe.', ts: Date.now() - 7200e3, read: false },
    ],
  }
}

function reducer(state, a) {
  switch (a.type) {
    case 'hydrate':
      return merge(a.saved)

    case 'setProfile':
      return { ...state, profile: { ...state.profile, ...a.patch } }
    case 'setTheme':
      return { ...state, theme: { ...state.theme, ...a.patch } }
    case 'setCustomTheme':
      return { ...state, theme: { ...state.theme, preset: 'custom', wallpaper: null, custom: { ...state.theme.custom, ...a.patch } } }
    case 'setWidget':
      return { ...state, widgets: { ...state.widgets, [a.key]: a.value } }
    case 'setGoals':
      return { ...state, goals: { ...state.goals, ...a.patch } }
    case 'onboarded':
      return { ...state, onboarded: true }

    case 'logDay': {
      const prev = state.logs[a.date] || {}
      return { ...state, logs: { ...state.logs, [a.date]: { ...prev, ...a.patch } } }
    }
    case 'addWater': {
      const prev = state.logs[a.date] || {}
      const water = Math.max(0, (prev.water || 0) + a.delta)
      return { ...state, logs: { ...state.logs, [a.date]: { ...prev, water } } }
    }

    case 'addGoal':
      return { ...state, goalList: [{ id: uid(), text: a.text, done: false, createdAt: Date.now() }, ...state.goalList] }
    case 'toggleGoal':
      return { ...state, goalList: state.goalList.map((g) => (g.id === a.id ? { ...g, done: !g.done } : g)) }
    case 'editGoal':
      return { ...state, goalList: state.goalList.map((g) => (g.id === a.id ? { ...g, text: a.text } : g)) }
    case 'removeGoal':
      return { ...state, goalList: state.goalList.filter((g) => g.id !== a.id) }

    case 'addAffirmation':
      return { ...state, affirmations: [{ id: uid(), text: a.text }, ...state.affirmations] }
    case 'removeAffirmation':
      return { ...state, affirmations: state.affirmations.filter((x) => x.id !== a.id) }

    case 'addPerson':
      return {
        ...state,
        people: [
          { id: uid(), name: a.person.name, emoji: a.person.emoji || '🙂', birthday: '', lastHangout: '', lastCall: '', memories: [], ...a.person },
          ...state.people,
        ],
      }
    case 'updatePerson':
      return { ...state, people: state.people.map((p) => (p.id === a.id ? { ...p, ...a.patch } : p)) }
    case 'removePerson':
      return { ...state, people: state.people.filter((p) => p.id !== a.id) }
    case 'addMemory':
      return {
        ...state,
        people: state.people.map((p) =>
          p.id === a.id ? { ...p, memories: [{ id: uid(), text: a.text, date: a.date || todayKey() }, ...(p.memories || [])] } : p
        ),
      }
    case 'removeMemory':
      return {
        ...state,
        people: state.people.map((p) =>
          p.id === a.id ? { ...p, memories: (p.memories || []).filter((m) => m.id !== a.memId) } : p
        ),
      }

    case 'ingestNotifs': {
      if (!a.notifs.length && JSON.stringify(a.meta) === JSON.stringify(state.notifMeta)) return state
      const known = new Set(state.notifications.map((n) => n.id))
      const fresh = a.notifs.filter((n) => !known.has(n.id))
      return {
        ...state,
        notifications: [...fresh.reverse(), ...state.notifications].slice(0, 120),
        notifMeta: a.meta,
      }
    }
    case 'readNotif':
      return { ...state, notifications: state.notifications.map((n) => (n.id === a.id ? { ...n, read: true } : n)) }
    case 'readAllNotifs':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) }
    case 'clearNotifs':
      return { ...state, notifications: [] }

    case 'loadSample':
      return sampleData(state)
    case 'loadSampleSlump':
      return sampleSlump(state)
    case 'reset':
      return { ...defaultState, onboarded: true }

    default:
      return state
  }
}

const Ctx = createContext(null)

export function Store({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState)
  const [hydrated, setHydrated] = useState(false)
  const saving = useRef(false)

  useEffect(() => {
    let alive = true
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!alive) return
        if (raw) {
          try {
            dispatch({ type: 'hydrate', saved: JSON.parse(raw) })
          } catch {
            /* corrupt store — fall back to defaults */
          }
        }
      })
      .finally(() => alive && setHydrated(true))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saving.current = true
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {})
  }, [state, hydrated])

  const value = useMemo(() => ({ state, dispatch, hydrated }), [state, hydrated])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore outside <Store>')
  return ctx
}
