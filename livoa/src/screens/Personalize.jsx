import { useRef } from 'react'
import { useStore } from '../store.jsx'
import ThemeCard from '../components/ThemeCard.jsx'
import {
  PRESET_ORDER, FONTS,
  CUSTOM_OPTIONS, ACCENT_SWATCH, ACCENT_EMOJI,
} from '../themes.js'

const AVATARS = ['🌙', '🍓', '🧊', '🌿', '☁️', '🪩', '🔥', '🦋', '🍵', '🌌', '⭐', '🐨']

function resizeToDataURL(file, size = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = () => { img.src = reader.result }
    reader.onerror = reject
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      const scale = Math.max(size / img.width, size / img.height)
      const w = img.width * scale
      const h = img.height * scale
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Personalize() {
  const { state, dispatch } = useStore()
  const fileRef = useRef(null)
  const { theme } = state
  const custom = theme.custom || {}

  const onPick = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const url = await resizeToDataURL(f)
      dispatch({ type: 'setProfile', patch: { picture: url } })
    } catch { /* ignore bad image */ }
  }

  return (
    <div className="screen">
      <div className="h1">You</div>

      {/* Profile */}
      <div className="card col">
        <div className="h2">Profile</div>
        <div className="row" style={{ gap: 14 }}>
          <div className="avatar" style={{ width: 64, height: 64, fontSize: 30 }}>
            {state.profile.picture ? <img src={state.profile.picture} alt="" /> : state.profile.avatar}
          </div>
          <div className="col grow">
            <button className="btn sm" onClick={() => fileRef.current?.click()}>Upload photo</button>
            {state.profile.picture && (
              <button className="btn ghost sm danger" onClick={() => dispatch({ type: 'setProfile', patch: { picture: null } })}>
                Remove photo
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
          </div>
        </div>
        <div className="field">
          <label>Name</label>
          <input className="input" value={state.profile.name}
            onChange={(e) => dispatch({ type: 'setProfile', patch: { name: e.target.value } })} />
        </div>
        <div className="field">
          <label>Avatar</label>
          <div className="swatches">
            {AVATARS.map((a) => (
              <button key={a} className={'chip' + (state.profile.avatar === a && !state.profile.picture ? ' on' : '')}
                onClick={() => dispatch({ type: 'setProfile', patch: { avatar: a } })}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Themes */}
      <div className="card col">
        <div className="h2">Themes</div>
        <div className="theme-grid">
          {PRESET_ORDER.map((id) => (
            <ThemeCard
              key={id}
              id={id}
              selected={theme.preset === id}
              onClick={() => dispatch({ type: 'setTheme', patch: { preset: id } })}
            />
          ))}
        </div>
        <div className="pill-row" style={{ marginTop: 4 }}>
          <button
            className={'chip' + (theme.picture ? ' on' : '')}
            onClick={() => dispatch({ type: 'setTheme', patch: { picture: !theme.picture } })}
          >
            🖼️ Theme picture on home {theme.picture ? '· on' : '· off'}
          </button>
        </div>
      </div>

      {/* Custom builder */}
      <div className="card col">
        <div className="h2">Build your Livoa</div>
        <div className="tiny muted">Make your own — it becomes your active theme.</div>

        <Picker label="Background" options={CUSTOM_OPTIONS.background} value={custom.background}
          onChange={(v) => dispatch({ type: 'setCustomTheme', patch: { background: v } })} />

        <div className="field">
          <label>Accent</label>
          <div className="swatches">
            {CUSTOM_OPTIONS.accent.map((a) => (
              <button key={a}
                className={custom.accent === a ? 'on' : ''}
                style={{ background: ACCENT_SWATCH[a] }}
                onClick={() => dispatch({ type: 'setCustomTheme', patch: { accent: a } })}>
                {ACCENT_EMOJI[a]}
              </button>
            ))}
          </div>
        </div>

        <Picker label="Style" options={CUSTOM_OPTIONS.style} value={custom.style}
          onChange={(v) => dispatch({ type: 'setCustomTheme', patch: { style: v } })} />
        <Picker label="Mood" options={CUSTOM_OPTIONS.mood} value={custom.mood}
          onChange={(v) => dispatch({ type: 'setCustomTheme', patch: { mood: v } })} />

        {theme.preset === 'custom' && <div className="chip soft">Custom theme active ✨</div>}
      </div>

      {/* Font */}
      <div className="card col">
        <div className="h2">Font</div>
        <div className="seg">
          {Object.entries(FONTS).map(([id, f]) => (
            <button key={id} className={state.theme.font === id ? 'on' : ''}
              style={{ fontFamily: f.stack }}
              onClick={() => dispatch({ type: 'setTheme', patch: { font: id } })}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Widgets */}
      <div className="card col">
        <div className="h2">Home widgets</div>
        <div className="pill-row">
          {Object.entries({
            sleep: 'Sleep', water: 'Water', screen: 'Screen',
            streaks: 'Streaks', affirmation: 'Affirmation', people: 'Reach out',
            goals: 'Goals', livoaAI: 'Livoa AI',
          }).map(([k, label]) => (
            <button key={k} className={'chip' + (state.widgets[k] ? ' on' : '')}
              onClick={() => dispatch({ type: 'setWidget', key: k, value: !state.widgets[k] })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="card col">
        <div className="h2">Data</div>
        <button className="btn sm" onClick={() => dispatch({ type: 'loadSample' })}>Load sample data</button>
        <button className="btn sm" onClick={() => dispatch({ type: 'loadSampleSlump' })}>Load “rough week” sample</button>
        <button className="btn ghost sm danger" onClick={() => {
          if (confirm('Erase everything and start fresh?')) dispatch({ type: 'reset' })
        }}>
          Reset Livoa
        </button>
        <div className="tiny muted">Everything is stored only on this device.</div>
      </div>
    </div>
  )
}

function Picker({ label, options, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="seg">
        {options.map((o) => (
          <button key={o} className={value === o ? 'on' : ''} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  )
}
