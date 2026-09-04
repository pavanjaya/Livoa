import { useState } from 'react'
import { useStore } from '../store.jsx'
import Sheet from '../components/Sheet.jsx'
import { todayKey, humanAgo, niceDate, daysAgo, daysUntilBirthday, ageAtNextBirthday } from '../lib/dates.js'
import { HANGOUT_THRESHOLD } from '../lib/notifications.js'

const EMOJIS = ['🙂', '🧑🏽', '👩🏻', '🧔🏾', '👵🏼', '👶🏻', '🦸', '🧑🏻‍🎤', '🐰', '🌻', '⭐', '🐥']

export default function People({ personId, setPersonId }) {
  const { state, dispatch } = useStore()
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🙂')

  const person = state.people.find((p) => p.id === personId)

  if (person) return <Detail person={person} back={() => setPersonId(null)} />

  const add = () => {
    const v = name.trim()
    if (!v) return
    dispatch({ type: 'addPerson', person: { name: v, emoji } })
    setName('')
    setEmoji('🙂')
    setAddOpen(false)
  }

  return (
    <div className="screen">
      <div className="row between">
        <div className="h1">People</div>
        <button className="btn primary sm" onClick={() => setAddOpen(true)}>+ Add</button>
      </div>

      {state.people.length === 0 ? (
        <div className="card empty">
          <div className="big">👥</div>
          Add the people who matter. Livoa nudges you when it's been too long.
        </div>
      ) : (
        <div className="card list">
          {state.people.map((p) => {
            const overdue = p.lastHangout && daysAgo(p.lastHangout) >= HANGOUT_THRESHOLD
            const bd = daysUntilBirthday(p.birthday)
            return (
              <div className="person-row" key={p.id} onClick={() => setPersonId(p.id)} style={{ cursor: 'pointer' }}>
                <div className="avatar" style={{ width: 44, height: 44, fontSize: 22 }}>{p.emoji}</div>
                <div className="meta">
                  <div className="nm">{p.name}</div>
                  <div className={'sub' + (overdue ? ' warn' : '')}>
                    {bd != null && bd <= 7
                      ? `🎂 birthday ${bd === 0 ? 'today' : `in ${bd}d`}`
                      : p.lastHangout
                        ? `Last hangout ${humanAgo(p.lastHangout)}`
                        : 'No hangouts logged'}
                  </div>
                </div>
                <span className="muted">›</span>
              </div>
            )
          })}
        </div>
      )}

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title="Add someone">
        <div className="col" style={{ marginTop: 10 }}>
          <input className="input" placeholder="Name" value={name} autoFocus
            onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          <div className="swatches">
            {EMOJIS.map((e) => (
              <button key={e} className={'chip' + (emoji === e ? ' on' : '')} onClick={() => setEmoji(e)}>{e}</button>
            ))}
          </div>
          <button className="btn primary block" onClick={add}>Add person</button>
        </div>
      </Sheet>
    </div>
  )
}

function Detail({ person, back }) {
  const { dispatch } = useStore()
  const [mem, setMem] = useState('')
  const p = person
  const upd = (patch) => dispatch({ type: 'updatePerson', id: p.id, patch })

  const overdue = p.lastHangout && daysAgo(p.lastHangout) >= HANGOUT_THRESHOLD
  const bd = daysUntilBirthday(p.birthday)
  const age = ageAtNextBirthday(p.birthday)

  const addMem = () => {
    const v = mem.trim()
    if (!v) return
    dispatch({ type: 'addMemory', id: p.id, text: v })
    setMem('')
  }

  return (
    <div className="screen">
      <button className="btn ghost sm" onClick={back}>← People</button>

      <div className="card row" style={{ gap: 14 }}>
        <div className="avatar" style={{ width: 56, height: 56, fontSize: 28 }}>{p.emoji}</div>
        <div className="grow">
          <input
            className="h1"
            style={{ fontSize: 22, border: 'none', background: 'transparent', width: '100%' }}
            value={p.name}
            onChange={(e) => upd({ name: e.target.value })}
          />
          {overdue && <div className="tiny warn">You haven't hung out in {daysAgo(p.lastHangout)} days 👀</div>}
          {bd != null && bd <= 30 && (
            <div className="tiny muted">🎂 {bd === 0 ? 'Birthday today!' : `Birthday in ${bd} days`}{age ? ` · turning ${age}` : ''}</div>
          )}
        </div>
      </div>

      <div className="card col">
        <div className="field">
          <label>🎂 Birthday</label>
          <input className="input" type="date" value={p.birthday || ''} onChange={(e) => upd({ birthday: e.target.value })} />
        </div>

        <DateField
          label="🧍 Last hangout"
          value={p.lastHangout}
          onChange={(v) => upd({ lastHangout: v })}
        />
        <DateField
          label="📞 Last call"
          value={p.lastCall}
          onChange={(v) => upd({ lastCall: v })}
        />
      </div>

      <div className="card col">
        <div className="h2">💭 Memories</div>
        <div className="row">
          <input className="input" placeholder="Something you want to remember…" value={mem}
            onChange={(e) => setMem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMem()} />
          <button className="btn primary" onClick={addMem}>Add</button>
        </div>
        {(p.memories || []).length === 0 ? (
          <div className="tiny muted" style={{ padding: '6px 2px' }}>No memories yet.</div>
        ) : (
          <div className="list">
            {p.memories.map((m) => (
              <div className="li" key={m.id}>
                <div className="tx" style={{ fontWeight: 600 }}>
                  {m.text}
                  <div className="tiny muted">{niceDate(m.date)}</div>
                </div>
                <button className="btn ghost sm danger" onClick={() => dispatch({ type: 'removeMemory', id: p.id, memId: m.id })}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="btn ghost danger block"
        onClick={() => { dispatch({ type: 'removePerson', id: p.id }); back() }}
      >
        Remove {p.name}
      </button>
    </div>
  )
}

function DateField({ label, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="row">
        <input className="input" type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        <button className="btn sm" onClick={() => onChange(todayKey())}>Today</button>
      </div>
      {value && <span className="tiny muted">{humanAgo(value)}</span>}
    </div>
  )
}
