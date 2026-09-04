export function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="livoaOrb" x1="18" y1="20" x2="98" y2="104" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b7a4e6" />
          <stop offset="0.55" stopColor="#d7a9df" />
          <stop offset="1" stopColor="#f6b3ce" />
        </linearGradient>
      </defs>
      <circle cx="57" cy="63" r="40" fill="url(#livoaOrb)" />
      <circle cx="92" cy="26" r="9" fill="#f7a6c6" />
      <path
        d="M55 31 C 47 34, 45 47, 47 67 C 48.5 81, 61 85, 72 73"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="word">
      liv<span className="o">o</span>a
    </span>
  )
}

export function LogoLockup({ size = 120 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <LogoMark size={size} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, fontWeight: 800, fontSize: size * 0.34, letterSpacing: '-0.03em' }}>
        liv<span style={{ color: 'var(--accent)' }}>o</span>a
      </div>
      <div className="muted tiny" style={{ letterSpacing: '0.04em' }}>your life, your vibe.</div>
    </div>
  )
}
