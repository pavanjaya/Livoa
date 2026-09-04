// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------
export const FONTS = {
  nunito: { label: 'Nunito', stack: "'Nunito', system-ui, sans-serif" },
  poppins: { label: 'Poppins', stack: "'Poppins', system-ui, sans-serif" },
  quicksand: { label: 'Quicksand', stack: "'Quicksand', system-ui, sans-serif" },
  grotesk: { label: 'Space Grotesk', stack: "'Space Grotesk', system-ui, sans-serif" },
  serif: { label: 'DM Serif', stack: "'DM Serif Display', Georgia, serif" },
}

// Defaults filled in for any var a theme doesn't set.
export const BASE_VARS = {
  '--bg-tint': 'transparent',
  '--blur': '0px',
  '--border-w': '1px',
  '--radius': '18px',
  '--shadow': '0 12px 30px rgba(20, 20, 50, 0.10)',
}

// ---------------------------------------------------------------------------
// 10 built-in themes
// ---------------------------------------------------------------------------
export const PRESETS = {
  midnight: {
    emoji: '🌙', name: 'Midnight', blurb: 'dark, mysterious, minimal', dark: true,
    vars: {
      '--bg': '#0d0d12', '--surface': '#16161f', '--surface-2': '#1e1e2b',
      '--text': '#e9e9f4', '--muted': '#9494ac', '--border': '#26263a',
      '--accent': '#7c7cf0', '--accent-contrast': '#0d0d12', '--accent-soft': 'rgba(124,124,240,0.16)',
      '--track': '#26263a', '--radius': '14px', '--shadow': '0 14px 34px rgba(0,0,0,0.40)',
    },
  },
  sweet: {
    emoji: '🍓', name: 'Sweet', blurb: 'soft, playful, pink & red', dark: false,
    vars: {
      '--bg': '#fff1f4', '--surface': '#ffffff', '--surface-2': '#fff5f8',
      '--text': '#4a2530', '--muted': '#9a6b78', '--border': '#ffdfe7',
      '--accent': '#ff4d6d', '--accent-contrast': '#ffffff', '--accent-soft': 'rgba(255,77,109,0.14)',
      '--track': '#ffe0e7', '--radius': '24px', '--shadow': '0 16px 36px rgba(255,77,109,0.18)',
    },
  },
  ice: {
    emoji: '🧊', name: 'Ice', blurb: 'clean, icy blue', dark: false,
    vars: {
      '--bg': '#eef6fb', '--surface': '#ffffff', '--surface-2': '#f2f9fd',
      '--text': '#173a4d', '--muted': '#5c8299', '--border': '#d8ebf5',
      '--accent': '#2bb6e6', '--accent-contrast': '#ffffff', '--accent-soft': 'rgba(43,182,230,0.14)',
      '--track': '#dcedf6', '--radius': '14px', '--shadow': '0 12px 28px rgba(43,182,230,0.16)',
    },
  },
  earthy: {
    emoji: '🌿', name: 'Earthy', blurb: 'green, calm, natural', dark: false,
    vars: {
      '--bg': '#f1f5ec', '--surface': '#ffffff', '--surface-2': '#f4f8ef',
      '--text': '#2f3d29', '--muted': '#6f8064', '--border': '#e0e9d5',
      '--accent': '#6a9a4c', '--accent-contrast': '#ffffff', '--accent-soft': 'rgba(106,154,76,0.16)',
      '--track': '#e3ecd8', '--radius': '16px', '--shadow': '0 12px 28px rgba(60,80,40,0.12)',
    },
  },
  cloud: {
    emoji: '☁️', name: 'Cloud', blurb: 'white, soft, dreamy', dark: false,
    vars: {
      '--bg': '#f7f8fc', '--surface': '#ffffff', '--surface-2': '#f2f3fb',
      '--text': '#3a3f52', '--muted': '#8a8fa6', '--border': '#e9eaf4',
      '--accent': '#9aa6ec', '--accent-contrast': '#ffffff', '--accent-soft': 'rgba(154,166,236,0.16)',
      '--track': '#ececf5', '--radius': '20px', '--shadow': '0 14px 32px rgba(60,60,120,0.10)',
    },
  },
  y2k: {
    emoji: '🪩', name: 'Y2K', blurb: 'glossy, nostalgic, playful', dark: false,
    vars: {
      '--bg': 'linear-gradient(160deg, #ffe3fb 0%, #e6ecff 55%, #dff8ff 100%)',
      '--bg-tint': 'radial-gradient(90% 60% at 15% 0%, rgba(255,110,230,0.20), transparent 60%)',
      '--surface': 'rgba(255,255,255,0.80)', '--surface-2': 'rgba(255,255,255,0.58)',
      '--text': '#2a1a4a', '--muted': '#6f5f93', '--border': 'rgba(255,255,255,0.75)',
      '--accent': '#c93ad6', '--accent-contrast': '#ffffff', '--accent-soft': 'rgba(201,58,214,0.14)',
      '--track': 'rgba(255,255,255,0.62)', '--radius': '22px', '--blur': '14px',
      '--shadow': '0 16px 40px rgba(160,60,200,0.20)',
    },
  },
  afterhours: {
    emoji: '🔥', name: 'After Hours', blurb: 'black + energetic accents', dark: true,
    vars: {
      '--bg': '#050505', '--surface': '#121212', '--surface-2': '#1b1b1b',
      '--text': '#f5f5f5', '--muted': '#8f8f8f', '--border': '#262626',
      '--accent': '#ff5a1f', '--accent-contrast': '#0a0a0a', '--accent-soft': 'rgba(255,90,31,0.16)',
      '--track': '#242424', '--radius': '12px', '--shadow': '0 16px 40px rgba(0,0,0,0.55)',
    },
  },
  butterfly: {
    emoji: '🦋', name: 'Butterfly', blurb: 'pastel, expressive', dark: false,
    vars: {
      '--bg': 'linear-gradient(160deg, #fdeefb 0%, #eef0ff 60%, #eafff4 100%)',
      '--surface': '#ffffff', '--surface-2': '#faf3fd',
      '--text': '#3d2b46', '--muted': '#8a7796', '--border': '#efe2f4',
      '--accent': '#b46be0', '--accent-contrast': '#ffffff', '--accent-soft': 'rgba(180,107,224,0.15)',
      '--track': '#efe3f5', '--radius': '22px', '--shadow': '0 14px 34px rgba(150,90,190,0.16)',
    },
  },
  matcha: {
    emoji: '🍵', name: 'Matcha', blurb: 'muted green, cozy', dark: false,
    vars: {
      '--bg': '#eef0e6', '--surface': '#f9faf3', '--surface-2': '#f0f2e6',
      '--text': '#3a4032', '--muted': '#7a8069', '--border': '#e0e3d2',
      '--accent': '#8ba76b', '--accent-contrast': '#ffffff', '--accent-soft': 'rgba(139,167,107,0.18)',
      '--track': '#e3e6d5', '--radius': '18px', '--shadow': '0 12px 26px rgba(70,80,50,0.12)',
    },
  },
  cosmic: {
    emoji: '🌌', name: 'Cosmic', blurb: 'deep purple / blue', dark: true,
    vars: {
      '--bg': 'linear-gradient(170deg, #0b0a1f 0%, #141233 55%, #1b1450 100%)',
      '--bg-tint': 'radial-gradient(80% 50% at 80% 0%, rgba(120,90,255,0.22), transparent 65%)',
      '--surface': 'rgba(30,26,66,0.66)', '--surface-2': 'rgba(40,34,82,0.55)',
      '--text': '#e9e6ff', '--muted': '#9a94c8', '--border': 'rgba(150,140,220,0.22)',
      '--accent': '#8b5cf6', '--accent-contrast': '#0b0a1f', '--accent-soft': 'rgba(139,92,246,0.20)',
      '--track': 'rgba(150,140,220,0.20)', '--radius': '18px', '--blur': '12px',
      '--shadow': '0 18px 44px rgba(0,0,0,0.45)',
    },
  },
}

export const PRESET_ORDER = [
  'midnight', 'sweet', 'ice', 'earthy', 'cloud',
  'y2k', 'afterhours', 'butterfly', 'matcha', 'cosmic',
]

// ---------------------------------------------------------------------------
// Custom theme builder — "Pick your Livoa"
// ---------------------------------------------------------------------------
export const CUSTOM_OPTIONS = {
  background: ['Light', 'Dark', 'Cream', 'Gradient'],
  accent: ['pink', 'blue', 'purple', 'green', 'orange', 'red'],
  style: ['Minimal', 'Soft', 'Bold', 'Playful', 'Glassy'],
  mood: ['Calm', 'Energetic', 'Dreamy', 'Focused'],
}

export const ACCENT_SWATCH = {
  pink: '#ff5d8f', blue: '#38bdf8', purple: '#a855f7',
  green: '#34d399', orange: '#fb923c', red: '#ef4444',
}
export const ACCENT_EMOJI = { pink: '🩷', blue: '🩵', purple: '💜', green: '💚', orange: '🧡', red: '❤️' }

const ACCENTS = {
  pink: { c: '#ff5d8f', soft: 'rgba(255,93,143,0.15)' },
  blue: { c: '#2bb6e6', soft: 'rgba(43,182,230,0.15)' },
  purple: { c: '#9b5cf6', soft: 'rgba(155,92,246,0.15)' },
  green: { c: '#3aa76a', soft: 'rgba(58,167,106,0.16)' },
  orange: { c: '#f0821f', soft: 'rgba(240,130,31,0.15)' },
  red: { c: '#e5484d', soft: 'rgba(229,72,77,0.15)' },
}

const BACKGROUNDS = {
  Light: {
    dark: false,
    v: {
      '--surface': '#ffffff', '--surface-2': '#f1f1f8',
      '--text': '#26262e', '--muted': '#77778c', '--border': '#e7e7f0', '--track': '#ececf3',
    },
  },
  Dark: {
    dark: true,
    v: {
      '--bg': '#0e0e13', '--surface': '#17171f', '--surface-2': '#20202b',
      '--text': '#ececf4', '--muted': '#9797ad', '--border': '#272730', '--track': '#272730',
    },
  },
  Cream: {
    dark: false,
    v: {
      '--bg': '#faf4e9', '--surface': '#fffdf8', '--surface-2': '#f3ead9',
      '--text': '#3b3327', '--muted': '#8a7c66', '--border': '#ece0cc', '--track': '#efe4d1',
    },
  },
  Gradient: {
    dark: false,
    v: {
      '--surface': 'rgba(255,255,255,0.74)', '--surface-2': 'rgba(255,255,255,0.52)',
      '--text': '#2b2740', '--muted': '#6d6a86', '--border': 'rgba(255,255,255,0.65)',
      '--track': 'rgba(255,255,255,0.55)',
    },
  },
}

const STYLES = {
  Minimal: { '--radius': '10px', '--shadow': 'none', '--border-w': '1px', '--blur': '0px' },
  Soft: { '--radius': '20px', '--shadow': '0 14px 32px rgba(20,20,50,0.10)', '--border-w': '1px', '--blur': '0px' },
  Bold: { '--radius': '12px', '--shadow': '0 8px 0 rgba(20,20,50,0.14)', '--border-w': '2px', '--blur': '0px' },
  Playful: { '--radius': '26px', '--shadow': '0 16px 36px rgba(255,93,143,0.18)', '--border-w': '1.5px', '--blur': '0px' },
  Glassy: { '--radius': '20px', '--shadow': '0 14px 40px rgba(20,20,50,0.16)', '--border-w': '1px', '--blur': '14px' },
}

const MOODS = {
  Calm: { '--speed': '0.5s' },
  Energetic: { '--speed': '0.18s' },
  Dreamy: { '--speed': '0.6s' },
  Focused: { '--speed': '0.16s' },
}

export function customToVars(custom) {
  const c = {
    background: 'Light', accent: 'purple', style: 'Soft', mood: 'Calm',
    ...(custom || {}),
  }
  const acc = ACCENTS[c.accent] || ACCENTS.purple
  const back = BACKGROUNDS[c.background] || BACKGROUNDS.Light
  const style = STYLES[c.style] || STYLES.Soft
  const mood = MOODS[c.mood] || MOODS.Calm

  const vars = {
    ...BASE_VARS,
    ...back.v,
    ...style,
    ...mood,
    '--accent': acc.c,
    '--accent-contrast': '#ffffff',
    '--accent-soft': acc.soft,
  }

  // background surface
  if (c.background === 'Gradient') {
    vars['--bg'] = `linear-gradient(160deg, ${acc.soft} 0%, #fdeef6 45%, #eef1fd 100%)`
  } else if (c.background === 'Light') {
    vars['--bg'] = '#f6f6fb'
  }
  // Dark / Cream set --bg inside back.v already

  if (c.style === 'Glassy' && c.background !== 'Gradient') {
    vars['--surface'] = back.dark ? 'rgba(28,28,38,0.62)' : 'rgba(255,255,255,0.62)'
    vars['--surface-2'] = back.dark ? 'rgba(40,40,54,0.5)' : 'rgba(255,255,255,0.42)'
    vars['--border'] = back.dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)'
  }

  // mood colour of the room
  if (c.mood === 'Dreamy') {
    vars['--bg-tint'] = `radial-gradient(70% 45% at 50% -5%, ${acc.soft}, transparent 65%)`
    vars['--radius'] = `calc(${vars['--radius']} + 4px)`
  } else if (c.mood === 'Energetic') {
    vars['--bg-tint'] = `radial-gradient(60% 40% at 100% 0%, ${acc.soft}, transparent 60%)`
  } else if (c.mood === 'Focused') {
    vars['--shadow'] = 'none'
    vars['--muted'] = back.dark ? '#a9a9bd' : '#5f5f74'
  }

  return { vars, dark: back.dark }
}

// Resolve the active theme (preset or custom) to a { vars, dark } bundle.
export function resolveTheme(theme) {
  if (theme?.preset === 'custom') {
    return customToVars(theme.custom)
  }
  const p = PRESETS[theme?.preset] || PRESETS.cloud
  return { vars: { ...BASE_VARS, ...p.vars }, dark: !!p.dark }
}
