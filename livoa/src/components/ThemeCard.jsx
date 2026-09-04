import { PRESETS } from '../themes.js'
import { artURI, MOTIF } from '../lib/themeArt.js'

export default function ThemeCard({ id, selected, onClick }) {
  const p = PRESETS[id]
  const v = p.vars
  const art = artURI(id, v, MOTIF[id])
  return (
    <button
      className={'theme-card' + (selected ? ' on' : '')}
      style={{ background: v['--surface'], color: v['--text'] }}
      onClick={onClick}
    >
      <div className="tc-art" style={{ backgroundImage: `url("${art}")` }} />
      <div className="sw">
        <i style={{ background: v['--accent'] }} />
        <i style={{ background: v['--surface-2'] }} />
        <i style={{ background: v['--track'] }} />
      </div>
      <div className="tn">{p.emoji} {p.name}</div>
      <div className="tb" style={{ color: v['--muted'] }}>{p.blurb}</div>
    </button>
  )
}
