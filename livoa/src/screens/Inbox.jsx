import { useEffect } from 'react'
import { useStore } from '../store.jsx'
import { KIND_STYLE } from '../lib/notifications.js'

function ago(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function Inbox({ back, openPerson }) {
  const { state, dispatch } = useStore()
  const list = state.notifications

  useEffect(() => {
    const id = setTimeout(() => dispatch({ type: 'readAllNotifs' }), 700)
    return () => clearTimeout(id)
  }, [dispatch])

  return (
    <div className="screen">
      <div className="row between">
        <button className="btn ghost sm" onClick={back}>← Home</button>
        {list.length > 0 && (
          <button className="btn ghost sm danger" onClick={() => dispatch({ type: 'clearNotifs' })}>Clear</button>
        )}
      </div>
      <div className="h1">Notifications</div>

      {list.length === 0 ? (
        <div className="card empty">
          <div className="big">🔔</div>
          Nothing yet. Streak wins and gentle nudges land here.
        </div>
      ) : (
        <div className="card">
          {list.map((n) => (
            <div
              key={n.id}
              className={'notif' + (n.read ? '' : ' unread')}
              onClick={() => n.personId && openPerson(n.personId)}
              style={{ cursor: n.personId ? 'pointer' : 'default' }}
            >
              <span className="em">{n.emoji}</span>
              <div className="grow">
                <div className="tt">{n.title}</div>
                <div className="bd">{n.body}</div>
                <div className="when">
                  {(KIND_STYLE[n.kind] || {}).label || 'Livoa'} · {ago(n.ts)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="tiny muted center" style={{ padding: '4px 20px' }}>
        Streak ended? Life happens. Start again — we don't do guilt here. 🤍
      </p>
    </div>
  )
}
