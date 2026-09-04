import { PRESETS } from '../themes.js'

// which decorative motif each built-in theme wears
export const MOTIF = {
  midnight: 'stars', sweet: 'hearts', ice: 'shards', earthy: 'leaves', cloud: 'clouds',
  y2k: 'sparkles', afterhours: 'streaks', butterfly: 'wings', matcha: 'waves', cosmic: 'nebula',
}
// custom themes pick a motif from their mood
export const MOOD_MOTIF = { Calm: 'waves', Energetic: 'streaks', Dreamy: 'sparkles', Focused: 'shards' }

const cache = new Map()

function pick(vars) {
  const bg = String(vars['--bg'] || '')
  const base = bg.startsWith('#') ? bg : String(vars['--surface'] || '#e9e9f0')
  return { base, accent: String(vars['--accent'] || '#8a8adf'), line: String(vars['--track'] || '#ccced9') }
}

const W = '#ffffff'
const star = (x, y, s, c, o) =>
  `<path d='M${x} ${y - s}L${x + s * 0.28} ${y - s * 0.28}L${x + s} ${y}L${x + s * 0.28} ${y + s * 0.28}L${x} ${y + s}L${x - s * 0.28} ${y + s * 0.28}L${x - s} ${y}L${x - s * 0.28} ${y - s * 0.28}Z' fill='${c}' opacity='${o}'/>`
const heartAt = (x, y, s, c, o) =>
  `<path transform='translate(${x} ${y}) scale(${s / 16})' d='M0 5C0 1 -3 -2 -6 -2C-11 -2 -12 3 -12 5C-12 10 -6 14 0 18C6 14 12 10 12 5C12 3 11 -2 6 -2C3 -2 0 1 0 5Z' fill='${c}' opacity='${o}'/>`
const leafAt = (x, y, s, c, o, r) =>
  `<ellipse cx='${x}' cy='${y}' rx='${s}' ry='${s * 0.42}' fill='${c}' opacity='${o}' transform='rotate(${r} ${x} ${y})'/>`

function motifShapes(kind, accent) {
  switch (kind) {
    case 'stars':
    case 'nebula':
      return [
        star(60, 50, 9, W, 0.9), star(150, 30, 5, W, 0.7), star(250, 68, 7, W, 0.8),
        star(330, 40, 5, W, 0.6), star(300, 150, 11, W, 0.85), star(110, 170, 6, W, 0.7),
        star(205, 120, 4, W, 0.6), star(370, 205, 7, W, 0.7),
      ].join('')
    case 'sparkles':
      return [
        star(70, 60, 13, W, 0.9), star(322, 50, 9, accent, 0.85), star(258, 162, 15, W, 0.85),
        star(140, 190, 8, accent, 0.7), star(200, 92, 6, W, 0.7), star(360, 150, 7, W, 0.6),
      ].join('')
    case 'hearts':
      return [
        heartAt(70, 58, 34, W, 0.85), heartAt(300, 92, 46, W, 0.65), heartAt(180, 172, 26, W, 0.8),
        heartAt(352, 192, 20, accent, 0.6), heartAt(128, 120, 16, accent, 0.5),
      ].join('')
    case 'leaves':
      return [
        leafAt(70, 70, 46, W, 0.5, -20), leafAt(300, 58, 60, W, 0.4, 30), leafAt(200, 172, 52, W, 0.45, -10),
        leafAt(362, 150, 40, accent, 0.32, 50), leafAt(120, 150, 34, accent, 0.3, 15),
      ].join('')
    case 'clouds':
      return `<g fill='${W}'>
        <g opacity='0.55'><ellipse cx='90' cy='92' rx='55' ry='30'/><ellipse cx='132' cy='102' rx='45' ry='26'/><ellipse cx='54' cy='106' rx='38' ry='22'/></g>
        <g opacity='0.4'><ellipse cx='300' cy='58' rx='60' ry='30'/><ellipse cx='346' cy='70' rx='40' ry='22'/></g>
        <g opacity='0.5'><ellipse cx='262' cy='182' rx='50' ry='26'/><ellipse cx='302' cy='190' rx='38' ry='20'/></g>
      </g>`
    case 'shards':
      return [
        `<polygon points='40,10 112,0 70,124' fill='${W}' opacity='0.12'/>`,
        `<polygon points='300,0 400,42 330,150' fill='${W}' opacity='0.10'/>`,
        `<polygon points='150,240 240,150 282,240' fill='${W}' opacity='0.12'/>`,
        `<polygon points='0,182 92,150 60,240' fill='${accent}' opacity='0.2'/>`,
      ].join('')
    case 'streaks':
      return [20, 72, 122, 190, 262, 332]
        .map((x, i) =>
          `<rect x='${x}' y='-40' width='${i % 2 ? 10 : 22}' height='320' fill='${i % 2 ? accent : W}' opacity='${i % 2 ? 0.35 : 0.16}' transform='rotate(18 ${x} 120)'/>`)
        .join('')
    case 'wings':
      return `<g fill='${W}' opacity='0.5'>
        <ellipse cx='150' cy='92' rx='60' ry='44' transform='rotate(-24 150 92)'/>
        <ellipse cx='250' cy='92' rx='60' ry='44' transform='rotate(24 250 92)'/>
        <ellipse cx='162' cy='170' rx='44' ry='34' transform='rotate(-16 162 170)'/>
        <ellipse cx='238' cy='170' rx='44' ry='34' transform='rotate(16 238 170)'/>
      </g><g fill='${accent}' opacity='0.35'>
        <ellipse cx='150' cy='92' rx='30' ry='22' transform='rotate(-24 150 92)'/>
        <ellipse cx='250' cy='92' rx='30' ry='22' transform='rotate(24 250 92)'/></g>`
    case 'waves':
    default:
      return [80, 130, 180]
        .map((y, i) =>
          `<path d='M-10 ${y} q 50 -26 100 0 t 100 0 t 100 0 t 100 0 t 100 0' fill='none' stroke='${i === 1 ? accent : W}' stroke-opacity='${i === 1 ? 0.4 : 0.3}' stroke-width='4'/>`)
        .join('')
  }
}

function build(vars, motif) {
  const { base, accent } = pick(vars)
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240' preserveAspectRatio='xMidYMid slice'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${base}'/><stop offset='1' stop-color='${accent}' stop-opacity='0.6'/>` +
    `</linearGradient></defs>` +
    `<rect width='400' height='240' fill='${base}'/>` +
    `<rect width='400' height='240' fill='url(#g)'/>` +
    `<circle cx='60' cy='28' r='130' fill='${accent}' opacity='0.22'/>` +
    `<circle cx='352' cy='232' r='150' fill='${accent}' opacity='0.14'/>` +
    motifShapes(motif, accent) +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function artURI(key, vars, motif) {
  const ck = `${key}|${vars['--accent']}|${vars['--bg']}|${vars['--surface']}|${motif}`
  if (cache.has(ck)) return cache.get(ck)
  const uri = build(vars, motif)
  cache.set(ck, uri)
  return uri
}

export function artForPreset(key) {
  return artURI(key, PRESETS[key].vars, MOTIF[key])
}
