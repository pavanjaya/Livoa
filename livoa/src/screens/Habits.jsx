import { useState } from 'react'
import { useStore } from '../store.jsx'
import Ring from '../components/Ring.jsx'
import Sheet from '../components/Sheet.jsx'
import { todayKey, addDays, parseKey } from '../lib/dates.js'
import { streakFor, dayPass, METRIC_INFO, METRICS } from '../lib/streaks.js'

function Stepper({ value, set, step = 1, min = 0, max = 99, suffix }) {
  return (
    <div className="stepper">
      <button onClick={() => set(Math.max(min, +(value - step).toFixed(2)))}>−</button>
      <div className="val">
        {value}
        {suffix && <span style={{ fontSize: 14, fontWeight: 700 }}>{suffix}</span>}
      </div>
      <button onClick={() => set(Math.min(max, +(value + step).toFixed(2)))}>+</button>
    </div>
  )
}

export default function Habits() {
  const { state, dispatch } = useStore()
  const t = todayKey()
  const log = state.logs[t] || {}
  const g = state.goals
  const [editGoals, setEditGoals] = useState(false)

  const set = (patch) => dispatch({ type: 'logDay', date: t, patch })

  const week = Array.from({ length: 7 }, (_, i) => addDays(t, -(6 - i)))

  return (
    <div className="screen">
      <div className="h1">Habits</div>

      {/* Sleep */}
      <div className="card col">
        <div className="row between">
          <div className="h2">💤 Sleep</div>
          <button className="btn ghost sm" onClick={() => setEditGoals(true)}>Targets</button>
        </div>
        <div className="row" style={{ gap: 16 }}>
          <Ring value={log.sleepHours || 0} max={g.sleepMinHours + 2} size={96}>
            <div className="big">{log.sleepHours || 0}h</div>
            <div className="sub">goal {g.sleepMinHours}h+</div>
          </Ring>
          <div className="grow col">
            <div className="field">
              <label>Hours slept</label>
              <Stepper value={log.sleepHours || 0} set={(v) => set({ sleepHours: v })} step={0.5} max={16} suffix="h" />
            </div>
            <div className="field">
              <label>Bedtime</label>
              <input
                className="input"
                type="time"
                value={log.bedtime || ''}
                onChange={(e) => set({ bedtime: e.target.value })}
              />
              <span className="tiny muted">Before {g.bedtimeLimit} keeps your “asleep before 11” streak.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Water */}
      <div className="card col">
        <div className="h2">💧 Water</div>
        <div className="row" style={{ gap: 16 }}>
          <Ring value={log.water || 0} max={g.waterTargetGlasses} size={96}>
            <div className="big">{log.water || 0}</div>
            <div className="sub">/ {g.waterTargetGlasses} glasses</div>
          </Ring>
          <div className="grow">
            <Stepper value={log.water || 0} set={(v) => set({ water: v })} max={30} />
            <div className="pill-row" style={{ marginTop: 12 }}>
              <button className="chip" onClick={() => dispatch({ type: 'addWater', date: t, delta: 1 })}>+1 glass</button>
              <button className="chip" onClick={() => dispatch({ type: 'addWater', date: t, delta: 2 })}>+2</button>
              <button className="chip" onClick={() => set({ water: 0 })}>reset</button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen time */}
      <div className="card col">
        <div className="h2">📵 Screen time</div>
        <div className="row" style={{ gap: 16 }}>
          <Ring
            value={Math.min(log.screen || 0, g.screenLimitHours)}
            max={g.screenLimitHours}
            size={96}
            color={(log.screen || 0) > g.screenLimitHours ? '#e5844d' : undefined}
          >
            <div className="big">{log.screen != null ? `${log.screen}h` : '0h'}</div>
            <div className="sub">limit {g.screenLimitHours}h</div>
          </Ring>
          <div className="grow">
            <Stepper value={log.screen || 0} set={(v) => set({ screen: v })} step={0.5} max={24} suffix="h" />
            {(log.screen || 0) > g.screenLimitHours && (
              <div className="tiny warn" style={{ marginTop: 10 }}>Over your limit today — tomorrow's a fresh start.</div>
            )}
          </div>
        </div>
      </div>

      {/* Streaks + week strip */}
      <div className="card">
        <div className="h2" style={{ marginBottom: 10 }}>This week</div>
        {METRICS.map((m) => {
          const s = streakFor(m, state.logs, state.goals)
          return (
            <div key={m} style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
              <div className="row between">
                <span style={{ fontWeight: 800, fontSize: 13 }}>
                  {METRIC_INFO[m].emoji} {METRIC_INFO[m].label}
                </span>
                <span className="tiny muted">
                  {s.current} {METRIC_INFO[m].unit} · best {s.best}
                </span>
              </div>
              <div className="row" style={{ gap: 6, marginTop: 6 }}>
                {week.map((k) => {
                  const v = dayPass(state.logs[k], state.goals)[m]
                  const bg = v === true ? 'var(--accent)' : v === false ? '#e5844d55' : 'var(--track)'
                  return (
                    <div key={k} title={k} style={{ flex: 1 }}>
                      <div style={{ height: 26, borderRadius: 8, background: bg }} />
                      <div className="tiny muted center" style={{ marginTop: 3 }}>
                        {parseKey(k).toLocaleDateString(undefined, { weekday: 'narrow' })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <Sheet open={editGoals} onClose={() => setEditGoals(false)} title="Targets">
        <div className="col" style={{ marginTop: 10 }}>
          <div className="field">
            <label>Minimum sleep (hours)</label>
            <input className="input" type="number" step="0.5" value={g.sleepMinHours}
              onChange={(e) => dispatch({ type: 'setGoals', patch: { sleepMinHours: +e.target.value } })} />
          </div>
          <div className="field">
            <label>Bedtime limit</label>
            <input className="input" type="time" value={g.bedtimeLimit}
              onChange={(e) => dispatch({ type: 'setGoals', patch: { bedtimeLimit: e.target.value } })} />
          </div>
          <div className="field">
            <label>Water target (glasses)</label>
            <input className="input" type="number" value={g.waterTargetGlasses}
              onChange={(e) => dispatch({ type: 'setGoals', patch: { waterTargetGlasses: +e.target.value } })} />
          </div>
          <div className="field">
            <label>Screen time limit (hours)</label>
            <input className="input" type="number" step="0.5" value={g.screenLimitHours}
              onChange={(e) => dispatch({ type: 'setGoals', patch: { screenLimitHours: +e.target.value } })} />
          </div>
          <button className="btn primary block" onClick={() => setEditGoals(false)}>Done</button>
        </div>
      </Sheet>
    </div>
  )
}
