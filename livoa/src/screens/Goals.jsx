import { useState } from 'react'
import { useStore } from '../store.jsx'

export default function Goals() {
  const { state, dispatch } = useStore()
  const [goalText, setGoalText] = useState('')
  const [affText, setAffText] = useState('')

  const addGoal = () => {
    const v = goalText.trim()
    if (!v) return
    dispatch({ type: 'addGoal', text: v })
    setGoalText('')
  }
  const addAff = () => {
    const v = affText.trim()
    if (!v) return
    dispatch({ type: 'addAffirmation', text: v })
    setAffText('')
  }

  const done = state.goalList.filter((g) => g.done).length

  return (
    <div className="screen">
      <div className="h1">Goals</div>

      <div className="card col">
        <div className="row between">
          <div className="h2">🎯 My goals</div>
          {state.goalList.length > 0 && (
            <span className="tiny muted">{done}/{state.goalList.length} done</span>
          )}
        </div>
        <div className="row">
          <input
            className="input"
            placeholder="Add a goal…"
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          />
          <button className="btn primary" onClick={addGoal}>Add</button>
        </div>

        {state.goalList.length === 0 ? (
          <div className="empty"><div className="big">🎯</div>No goals yet. What are you working toward?</div>
        ) : (
          <div className="list">
            {state.goalList.map((g) => (
              <div className="li" key={g.id}>
                <div
                  className={'cbx' + (g.done ? ' on' : '')}
                  onClick={() => dispatch({ type: 'toggleGoal', id: g.id })}
                >
                  {g.done ? '✓' : ''}
                </div>
                <input
                  className={'tx' + (g.done ? ' done' : '')}
                  style={{ border: 'none', background: 'transparent', width: '100%' }}
                  value={g.text}
                  onChange={(e) => dispatch({ type: 'editGoal', id: g.id, text: e.target.value })}
                />
                <button className="btn ghost sm danger" onClick={() => dispatch({ type: 'removeGoal', id: g.id })}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card col">
        <div className="h2">🪞 Affirmations</div>
        <div className="tiny muted">One shows on your home screen each day.</div>
        <div className="row">
          <input
            className="input"
            placeholder="I am…"
            value={affText}
            onChange={(e) => setAffText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAff()}
          />
          <button className="btn primary" onClick={addAff}>Add</button>
        </div>

        {state.affirmations.length === 0 ? (
          <div className="empty"><div className="big">🪞</div>Add a few kind words to yourself.</div>
        ) : (
          <div className="list">
            {state.affirmations.map((a) => (
              <div className="li" key={a.id}>
                <span style={{ fontSize: 16 }}>“</span>
                <div className="tx" style={{ fontWeight: 700 }}>{a.text}</div>
                <button className="btn ghost sm danger" onClick={() => dispatch({ type: 'removeAffirmation', id: a.id })}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
