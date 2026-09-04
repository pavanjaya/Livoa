import { useState } from 'react'
import { useStore } from '../store.jsx'
import { LogoLockup } from '../components/Logo.jsx'
import ThemeCard from '../components/ThemeCard.jsx'
import { PRESETS, PRESET_ORDER } from '../themes.js'

export default function Onboarding() {
  const { dispatch } = useStore()
  const [name, setName] = useState('')
  const [preset, setPreset] = useState('cloud')
  const [sample, setSample] = useState(true)

  const start = () => {
    dispatch({ type: 'setProfile', patch: { name: name.trim() || 'friend', avatar: PRESETS[preset].emoji } })
    dispatch({ type: 'setTheme', patch: { preset } })
    if (sample) dispatch({ type: 'loadSample' })
    dispatch({ type: 'onboarded' })
  }

  return (
    <div className="app" style={{ paddingBottom: 24 }}>
      <div className="screen" style={{ paddingTop: 40, gap: 20 }}>
        <LogoLockup size={92} />

        <div className="card col">
          <div className="field">
            <label>What should we call you?</label>
            <input
              className="input"
              placeholder="Your name"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && start()}
            />
          </div>

          <div className="field">
            <label>Pick your Livoa</label>
            <div className="theme-grid">
              {PRESET_ORDER.map((id) => (
                <ThemeCard key={id} id={id} selected={preset === id} onClick={() => setPreset(id)} />
              ))}
            </div>
          </div>

          <label className="row" style={{ gap: 8, fontSize: 13, fontWeight: 700 }}>
            <input type="checkbox" checked={sample} onChange={(e) => setSample(e.target.checked)} />
            Start with sample data (habits, people, notifications)
          </label>

          <button className="btn primary block" onClick={start}>Enter Livoa →</button>
        </div>
        <p className="tiny muted center">Your life, your vibe. Everything stays on this device.</p>
      </div>
    </div>
  )
}
