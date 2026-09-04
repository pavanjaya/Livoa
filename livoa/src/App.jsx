import { useEffect, useMemo, useState } from 'react'
import { useStore } from './store.jsx'
import { resolveTheme, FONTS } from './themes.js'
import { derive } from './lib/notifications.js'
import { LogoMark, Wordmark } from './components/Logo.jsx'
import Dashboard from './screens/Dashboard.jsx'
import Habits from './screens/Habits.jsx'
import Goals from './screens/Goals.jsx'
import People from './screens/People.jsx'
import Personalize from './screens/Personalize.jsx'
import Inbox from './screens/Inbox.jsx'
import Onboarding from './screens/Onboarding.jsx'

const TABS = [
  { id: 'home', ic: '🏠', label: 'Home' },
  { id: 'habits', ic: '📊', label: 'Habits' },
  { id: 'goals', ic: '🎯', label: 'Goals' },
  { id: 'people', ic: '👥', label: 'People' },
  { id: 'you', ic: '✨', label: 'You' },
]

export default function App() {
  const { state, dispatch } = useStore()
  const [route, setRoute] = useState('home')
  const [personId, setPersonId] = useState(null)

  // apply theme -> CSS custom properties on <html>
  const theme = useMemo(() => resolveTheme(state.theme), [state.theme])
  useEffect(() => {
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))
    root.style.setProperty('--font', (FONTS[state.theme.font] || FONTS.nunito).stack)
    root.dataset.dark = theme.dark ? 'true' : 'false'
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta && !String(theme.vars['--bg']).includes('gradient')) meta.setAttribute('content', theme.vars['--bg'])
  }, [theme, state.theme.font])

  // derive streak / people notifications whenever the underlying data shifts
  useEffect(() => {
    const { notifs, meta } = derive(state)
    dispatch({ type: 'ingestNotifs', notifs, meta })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.logs, state.people, state.goals])

  const unread = state.notifications.filter((n) => !n.read).length

  if (!state.onboarded) return <Onboarding />

  const openPerson = (id) => {
    setPersonId(id)
    setRoute('people')
  }

  return (
    <>
      <div id="bg-tint" />
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <LogoMark />
            <Wordmark />
          </div>
          <div className="spacer" />
          <button className="iconbtn" onClick={() => setRoute('inbox')} aria-label="Notifications">
            🔔
            {unread > 0 && <span className="dot">{unread > 9 ? '9+' : unread}</span>}
          </button>
        </header>

        <main>
          {route === 'home' && <Dashboard go={setRoute} openPerson={openPerson} />}
          {route === 'habits' && <Habits />}
          {route === 'goals' && <Goals />}
          {route === 'people' && (
            <People personId={personId} setPersonId={setPersonId} />
          )}
          {route === 'you' && <Personalize />}
          {route === 'inbox' && <Inbox back={() => setRoute('home')} openPerson={openPerson} />}
        </main>
      </div>

      <nav className="nav">
        <div className="nav-inner">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={route === t.id ? 'on' : ''}
              onClick={() => {
                setPersonId(null)
                setRoute(t.id)
              }}
            >
              <span className="ic">{t.ic}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
