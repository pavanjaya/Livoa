import { useMemo, useState } from 'react'
import { useStore } from '../store.jsx'
import Ring from '../components/Ring.jsx'
import { todayKey, daysAgo, greeting } from '../lib/dates.js'
import { streakFor, METRIC_INFO, METRICS } from '../lib/streaks.js'
import { HANGOUT_THRESHOLD } from '../lib/notifications.js'
import { getInsights } from '../lib/ai.js'
import { resolveTheme } from '../themes.js'
import { artURI, MOTIF, MOOD_MOTIF } from '../lib/themeArt.js'

export default function Dashboard({ go, openPerson }) {
  const { state, dispatch } = useStore()
  const t = todayKey()
  const log = state.logs[t] || {}
  const w = state.widgets
  const g = state.goals

  const insights = useMemo(() => getInsights(state), [state.logs, state.goals, state.people])
  const [aiIdx, setAiIdx] = useState(0)
  const ins = insights[aiIdx % insights.length]

  const { vars } = useMemo(() => resolveTheme(state.theme), [state.theme])
  const motif =
    state.theme.preset === 'custom'
      ? MOOD_MOTIF[state.theme.custom?.mood] || 'waves'
      : MOTIF[state.theme.preset] || 'waves'
  const art = artURI(state.theme.preset || 'cloud', vars, motif)

  const streaks = METRICS.map((m) => ({ m, ...streakFor(m, state.logs, state.goals) })).filter((s) => s.current > 0)

  const affList = state.affirmations
  const affirmation = affList.length
    ? affList[new Date().getDate() % affList.length].text
    : null

  const nudges = (state.people || [])
    .filter((p) => p.lastHangout && daysAgo(p.lastHangout) >= HANGOUT_THRESHOLD)
    .sort((a, b) => daysAgo(b.lastHangout) - daysAgo(a.lastHangout))

  return (
    <div className="screen">
      {state.theme.picture ? (
        <div className="theme-banner" style={{ backgroundImage: `url("${art}")` }}>
          <div className="tb-inner">
            <div className="avatar">
              {state.profile.picture ? <img src={state.profile.picture} alt="" /> : state.profile.avatar}
            </div>
            <div className="grow">
              <div className="tiny tb-greet">{greeting()}</div>
              <div className="tb-name">{state.profile.name}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card hello-card">
          <div className="avatar">
            {state.profile.picture ? <img src={state.profile.picture} alt="" /> : state.profile.avatar}
          </div>
          <div className="grow">
            <div className="muted tiny">{greeting()}</div>
            <div className="h1" style={{ fontSize: 22 }}>{state.profile.name}</div>
          </div>
        </div>
      )}

      {(w.sleep || w.water || w.screen) && (
        <>
          <div className="section-label">Today</div>
          <div className="tri">
            {w.sleep && (
              <div className="card tap" onClick={() => go('habits')}>
                <Ring value={log.sleepHours || 0} max={g.sleepMinHours + 1.5} size={78} stroke={8}>
                  <div className="big">{log.sleepHours ? `${log.sleepHours}h` : '—'}</div>
                  <div className="sub">💤</div>
                </Ring>
                <div className="name">Sleep</div>
              </div>
            )}
            {w.water && (
              <div className="card tap" onClick={() => dispatch({ type: 'addWater', date: t, delta: 1 })}>
                <Ring value={log.water || 0} max={g.waterTargetGlasses} size={78} stroke={8}>
                  <div className="big">{log.water || 0}</div>
                  <div className="sub">/ {g.waterTargetGlasses} 💧</div>
                </Ring>
                <div className="name">Tap +1 glass</div>
              </div>
            )}
            {w.screen && (
              <div className="card tap" onClick={() => go('habits')}>
                <Ring
                  value={Math.min(log.screen || 0, g.screenLimitHours)}
                  max={g.screenLimitHours}
                  size={78}
                  stroke={8}
                  color={(log.screen || 0) > g.screenLimitHours ? '#e5844d' : undefined}
                >
                  <div className="big">{log.screen != null ? `${log.screen}h` : '—'}</div>
                  <div className="sub">≤ {g.screenLimitHours}h 📵</div>
                </Ring>
                <div className="name">Screen</div>
              </div>
            )}
          </div>
        </>
      )}

      {w.livoaAI && ins && (
        <div className="card ai-card">
          <div className="row between">
            <span className="ai-tag">✦ Livoa AI</span>
            {insights.length > 1 && (
              <button className="btn ghost sm" onClick={() => setAiIdx((i) => (i + 1) % insights.length)}>
                another →
              </button>
            )}
          </div>
          <div className="ai-head">{ins.tone === 'cheer' ? 'Livoa says' : 'Livoa noticed'} {ins.emoji}</div>
          {ins.lines.map((l, i) => (
            <div className="ai-line" key={i}>{l}</div>
          ))}
          {ins.suggestion && (
            <div className="ai-sugg">
              <div className="ai-sugg-label">Tiny suggestion</div>
              <div className="ai-line">{ins.suggestion}</div>
            </div>
          )}
        </div>
      )}

      {w.affirmation && affirmation && (
        <div className="card">
          <div className="section-label" style={{ padding: 0, marginBottom: 8 }}>Affirmation of the day</div>
          <div className="affirm">“{affirmation}”</div>
        </div>
      )}

      {w.streaks && (
        <div className="card">
          <div className="row between" style={{ marginBottom: 4 }}>
            <div className="h2">Streaks</div>
            <button className="btn ghost sm" onClick={() => go('habits')}>Log →</button>
          </div>
          {streaks.length === 0 ? (
            <div className="muted tiny" style={{ padding: '8px 2px' }}>
              No streaks yet — log a habit today to start one. 🌱
            </div>
          ) : (
            streaks.map((s) => (
              <div className="streak-line" key={s.m}>
                <span className="flame">{s.current >= 7 ? '🔥' : METRIC_INFO[s.m].emoji}</span>
                <span className="n">{s.current}</span>
                <span className="lbl">{METRIC_INFO[s.m].label}</span>
                <span className="grow" />
                {s.best > s.current && <span className="muted tiny">best {s.best}</span>}
              </div>
            ))
          )}
        </div>
      )}

      {w.people && nudges.length > 0 && (
        <div className="card">
          <div className="h2" style={{ marginBottom: 8 }}>Reach out 👀</div>
          {nudges.slice(0, 3).map((p) => (
            <div className="person-row" key={p.id} style={{ padding: '8px 0' }}>
              <div className="avatar" style={{ width: 40, height: 40, fontSize: 20 }}>{p.emoji}</div>
              <div className="meta">
                <div className="nm">{p.name}</div>
                <div className="sub warn">Last hangout {daysAgo(p.lastHangout)} days ago</div>
              </div>
              <button className="btn sm" onClick={() => openPerson(p.id)}>Open</button>
            </div>
          ))}
        </div>
      )}

      {w.goals && state.goalList.length > 0 && (
        <div className="card">
          <div className="row between" style={{ marginBottom: 8 }}>
            <div className="h2">Goals</div>
            <button className="btn ghost sm" onClick={() => go('goals')}>All →</button>
          </div>
          {state.goalList.slice(0, 3).map((gl) => (
            <div className="li" key={gl.id}>
              <div className={'cbx' + (gl.done ? ' on' : '')} onClick={() => dispatch({ type: 'toggleGoal', id: gl.id })}>
                {gl.done ? '✓' : ''}
              </div>
              <div className={'tx' + (gl.done ? ' done' : '')}>{gl.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
