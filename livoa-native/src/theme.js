import { createContext, useContext, useMemo } from 'react'

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------
export const FONTS = {
  nunito: 'Nunito',
  poppins: 'Poppins',
  quicksand: 'Quicksand',
  grotesk: 'Space Grotesk',
  serif: 'DM Serif',
}

const FAM = {
  nunito: { regular: 'Nunito_400Regular', bold: 'Nunito_800ExtraBold' },
  poppins: { regular: 'Poppins_400Regular', bold: 'Poppins_600SemiBold' },
  quicksand: { regular: 'Quicksand_400Regular', bold: 'Quicksand_700Bold' },
  grotesk: { regular: 'SpaceGrotesk_400Regular', bold: 'SpaceGrotesk_600SemiBold' },
  serif: { regular: 'DMSerifDisplay_400Regular', bold: 'DMSerifDisplay_400Regular' },
}

export function fontFamilies(key, loaded) {
  if (!loaded) return { regular: undefined, bold: undefined }
  return FAM[key] || FAM.nunito
}

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------
const SOFT_SHADOW = { shadowColor: '#141432', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 3 }
const DARK_SHADOW = { shadowColor: '#000000', shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 12 }, elevation: 5 }
const HARD_SHADOW = { shadowColor: '#141432', shadowOpacity: 0.16, shadowRadius: 1, shadowOffset: { width: 0, height: 7 }, elevation: 2 }
const PINK_SHADOW = { shadowColor: '#ff5d8f', shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 12 }, elevation: 4 }

// ---------------------------------------------------------------------------
// 10 built-in themes
// ---------------------------------------------------------------------------
export const PRESET_META = {
  midnight: { emoji: '🌙', name: 'Midnight', blurb: 'dark, mysterious, minimal' },
  sweet: { emoji: '🍓', name: 'Sweet', blurb: 'soft, playful, pink & red' },
  ice: { emoji: '🧊', name: 'Ice', blurb: 'clean, icy blue' },
  earthy: { emoji: '🌿', name: 'Earthy', blurb: 'green, calm, natural' },
  cloud: { emoji: '☁️', name: 'Cloud', blurb: 'white, soft, dreamy' },
  y2k: { emoji: '🪩', name: 'Y2K', blurb: 'party vibes · disco · glitter' },
  afterhours: { emoji: '🔥', name: 'After Hours', blurb: 'black + energetic accents' },
  butterfly: { emoji: '🦋', name: 'Butterfly', blurb: 'pastel, expressive' },
  matcha: { emoji: '🍵', name: 'Matcha', blurb: 'muted green, cozy' },
  cosmic: { emoji: '🌌', name: 'Cosmic', blurb: 'deep purple / blue' },
}

export const PRESET_ORDER = [
  'midnight', 'sweet', 'ice', 'earthy', 'cloud',
  'y2k', 'afterhours', 'butterfly', 'matcha', 'cosmic',
]

const PRESETS = {
  midnight: {
    dark: true, motif: 'stars', radius: 14,
    bg: '#0d0d12', gradient: null, tint: null,
    surface: '#16161f', surface2: '#1e1e2b',
    text: '#e9e9f4', muted: '#9494ac', border: '#26263a',
    accent: '#7c7cf0', accentContrast: '#0d0d12', accentSoft: 'rgba(124,124,240,0.16)', track: '#26263a',
  },
  sweet: {
    dark: false, motif: 'hearts', radius: 24,
    bg: '#fff1f4', gradient: null, tint: null,
    surface: '#ffffff', surface2: '#fff5f8',
    text: '#4a2530', muted: '#9a6b78', border: '#ffdfe7',
    accent: '#ff4d6d', accentContrast: '#ffffff', accentSoft: 'rgba(255,77,109,0.14)', track: '#ffe0e7',
  },
  ice: {
    dark: false, motif: 'shards', radius: 14,
    bg: '#eef6fb', gradient: null, tint: null,
    surface: '#ffffff', surface2: '#f2f9fd',
    text: '#173a4d', muted: '#5c8299', border: '#d8ebf5',
    accent: '#2bb6e6', accentContrast: '#ffffff', accentSoft: 'rgba(43,182,230,0.14)', track: '#dcedf6',
  },
  earthy: {
    dark: false, motif: 'leaves', radius: 16,
    bg: '#f1f5ec', gradient: null, tint: null,
    surface: '#ffffff', surface2: '#f4f8ef',
    text: '#2f3d29', muted: '#6f8064', border: '#e0e9d5',
    accent: '#6a9a4c', accentContrast: '#ffffff', accentSoft: 'rgba(106,154,76,0.16)', track: '#e3ecd8',
  },
  cloud: {
    dark: false, motif: 'clouds', radius: 20,
    bg: '#f7f8fc', gradient: null, tint: null,
    surface: '#ffffff', surface2: '#f2f3fb',
    text: '#3a3f52', muted: '#8a8fa6', border: '#e9eaf4',
    accent: '#9aa6ec', accentContrast: '#ffffff', accentSoft: 'rgba(154,166,236,0.16)', track: '#ececf5',
  },
  y2k: {
    dark: false, motif: 'disco', radius: 22,
    bg: '#f3e6ff', gradient: ['#ff4fe4', '#9b4dff', '#39d0ff'], tint: 'rgba(255,79,228,0.16)',
    surface: 'rgba(255,255,255,0.88)', surface2: 'rgba(255,255,255,0.66)',
    text: '#2b1150', muted: '#6a4d94', border: 'rgba(255,255,255,0.85)',
    accent: '#ff2fd0', accentContrast: '#ffffff', accentSoft: 'rgba(255,47,208,0.16)', track: 'rgba(255,255,255,0.6)',
  },
  afterhours: {
    dark: true, motif: 'streaks', radius: 12,
    bg: '#050505', gradient: null, tint: null,
    surface: '#121212', surface2: '#1b1b1b',
    text: '#f5f5f5', muted: '#8f8f8f', border: '#262626',
    accent: '#ff5a1f', accentContrast: '#0a0a0a', accentSoft: 'rgba(255,90,31,0.16)', track: '#242424',
  },
  butterfly: {
    dark: false, motif: 'wings', radius: 22,
    bg: '#f6eefb', gradient: ['#fdeefb', '#eef0ff', '#eafff4'], tint: null,
    surface: '#ffffff', surface2: '#faf3fd',
    text: '#3d2b46', muted: '#8a7796', border: '#efe2f4',
    accent: '#b46be0', accentContrast: '#ffffff', accentSoft: 'rgba(180,107,224,0.15)', track: '#efe3f5',
  },
  matcha: {
    dark: false, motif: 'waves', radius: 18,
    bg: '#eef0e6', gradient: null, tint: null,
    surface: '#f9faf3', surface2: '#f0f2e6',
    text: '#3a4032', muted: '#7a8069', border: '#e0e3d2',
    accent: '#8ba76b', accentContrast: '#ffffff', accentSoft: 'rgba(139,167,107,0.18)', track: '#e3e6d5',
  },
  cosmic: {
    dark: true, motif: 'nebula', radius: 18,
    bg: '#0c0b1f', gradient: ['#0b0a1f', '#141233', '#1b1450'], tint: 'rgba(120,90,255,0.16)',
    surface: 'rgba(30,26,66,0.72)', surface2: 'rgba(40,34,82,0.6)',
    text: '#e9e6ff', muted: '#9a94c8', border: 'rgba(150,140,220,0.24)',
    accent: '#8b5cf6', accentContrast: '#0b0a1f', accentSoft: 'rgba(139,92,246,0.2)', track: 'rgba(150,140,220,0.2)',
  },
}

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
  pink: '#ff5d8f', blue: '#38bdf8', purple: '#a855f7', green: '#34d399', orange: '#fb923c', red: '#ef4444',
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
  Light: { dark: false, bg: '#f6f6fb', surface: '#ffffff', surface2: '#f1f1f8', text: '#26262e', muted: '#77778c', border: '#e7e7f0', track: '#ececf3' },
  Dark: { dark: true, bg: '#0e0e13', surface: '#17171f', surface2: '#20202b', text: '#ececf4', muted: '#9797ad', border: '#272730', track: '#272730' },
  Cream: { dark: false, bg: '#faf4e9', surface: '#fffdf8', surface2: '#f3ead9', text: '#3b3327', muted: '#8a7c66', border: '#ece0cc', track: '#efe4d1' },
  Gradient: { dark: false, bg: '#f4eef8', surface: 'rgba(255,255,255,0.78)', surface2: 'rgba(255,255,255,0.54)', text: '#2b2740', muted: '#6d6a86', border: 'rgba(255,255,255,0.7)', track: 'rgba(255,255,255,0.55)' },
}
const STYLES = {
  Minimal: { radius: 10, shadow: null, borderW: 1, glass: false },
  Soft: { radius: 20, shadow: SOFT_SHADOW, borderW: 1, glass: false },
  Bold: { radius: 12, shadow: HARD_SHADOW, borderW: 2, glass: false },
  Playful: { radius: 26, shadow: PINK_SHADOW, borderW: 1.5, glass: false },
  Glassy: { radius: 20, shadow: SOFT_SHADOW, borderW: 1, glass: true },
}
export const MOOD_MOTIF = { Calm: 'waves', Energetic: 'streaks', Dreamy: 'sparkles', Focused: 'shards' }

function customTokens(custom) {
  const c = { background: 'Light', accent: 'purple', style: 'Soft', mood: 'Calm', ...(custom || {}) }
  const acc = ACCENTS[c.accent] || ACCENTS.purple
  const back = BACKGROUNDS[c.background] || BACKGROUNDS.Light
  const style = STYLES[c.style] || STYLES.Soft

  const t = {
    key: 'custom',
    dark: back.dark,
    motif: MOOD_MOTIF[c.mood] || 'waves',
    radius: style.radius,
    borderW: style.borderW,
    shadow: style.shadow,
    bg: back.bg,
    gradient: null,
    tint: null,
    surface: back.surface,
    surface2: back.surface2,
    text: back.text,
    muted: back.muted,
    border: back.border,
    track: back.track,
    accent: acc.c,
    accentContrast: '#ffffff',
    accentSoft: acc.soft,
  }

  if (c.background === 'Gradient') {
    t.gradient = [acc.soft, '#fdeef6', '#eef1fd']
  }
  if (style.glass && c.background !== 'Gradient') {
    t.surface = back.dark ? 'rgba(28,28,38,0.62)' : 'rgba(255,255,255,0.62)'
    t.surface2 = back.dark ? 'rgba(40,40,54,0.5)' : 'rgba(255,255,255,0.44)'
    t.border = back.dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.72)'
  }
  if (c.mood === 'Dreamy') {
    t.tint = acc.soft
    t.radius += 4
  } else if (c.mood === 'Energetic') {
    t.tint = acc.soft
  } else if (c.mood === 'Focused') {
    t.shadow = null
    t.muted = back.dark ? '#a9a9bd' : '#5f5f74'
  }
  return t
}

// ---------------------------------------------------------------------------
// Livoa Images — full-bleed pattern wallpapers that become the whole theme
// ---------------------------------------------------------------------------
export const WALLPAPERS = {
  shells: {
    name: 'Shells', dark: false,
    bg: '#f3ede0', surface: '#fffdf7', surface2: '#efe7d6',
    text: '#22304f', muted: '#6b7793', border: '#e4dac6',
    accent: '#33518f', accentContrast: '#ffffff', accentSoft: 'rgba(51,81,143,0.14)', track: '#e7ddcb',
  },
  bows: {
    name: 'Bows', dark: true,
    bg: '#0c0a0b', surface: '#181113', surface2: '#221a1c',
    text: '#f4e9ec', muted: '#a98d94', border: '#2c2124',
    accent: '#d98a9a', accentContrast: '#1a1012', accentSoft: 'rgba(217,138,154,0.16)', track: '#2c2124',
  },
}
export const WALLPAPER_ORDER = ['shells', 'bows']

export function resolveTheme(theme) {
  if (theme?.wallpaper && WALLPAPERS[theme.wallpaper]) {
    const w = WALLPAPERS[theme.wallpaper]
    return {
      key: `wp:${theme.wallpaper}`,
      wallpaper: theme.wallpaper,
      dark: w.dark,
      motif: null,
      radius: 20,
      borderW: 1,
      shadow: w.dark ? DARK_SHADOW : SOFT_SHADOW,
      bg: w.bg, gradient: null, tint: null,
      surface: w.surface, surface2: w.surface2, text: w.text, muted: w.muted,
      border: w.border, track: w.track,
      accent: w.accent, accentContrast: w.accentContrast, accentSoft: w.accentSoft,
    }
  }
  if (theme?.preset === 'custom') return { wallpaper: null, ...customTokens(theme.custom) }
  const p = PRESETS[theme?.preset] || PRESETS.cloud
  return {
    key: theme?.preset || 'cloud',
    wallpaper: null,
    borderW: 1,
    shadow: p.dark ? DARK_SHADOW : SOFT_SHADOW,
    ...p,
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
const ThemeCtx = createContext(null)

export function ThemeProvider({ theme, fontsLoaded, children }) {
  const value = useMemo(() => {
    const t = resolveTheme(theme)
    t.fonts = fontFamilies(theme?.font || 'nunito', fontsLoaded)
    return t
  }, [theme, fontsLoaded])
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export function useTheme() {
  const t = useContext(ThemeCtx)
  if (!t) throw new Error('useTheme outside <ThemeProvider>')
  return t
}
