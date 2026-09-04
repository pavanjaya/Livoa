import Svg, { Defs, Pattern, Rect, Path, Circle, G, RadialGradient, Stop } from 'react-native-svg'

const STARFISH =
  'M0,-15 L4.4,-4.6 L14.3,-4.6 L6.1,1.8 L9.2,12.1 L0,5.6 L-9.2,12.1 L-6.1,1.8 L-14.3,-4.6 L-4.4,-4.6 Z'

const Bow = ({ x, y, s, fill }) => (
  <G transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <Path d="M0 0 L-24 -13 Q-30 0 -24 13 Z" />
    <Path d="M0 0 L24 -13 Q30 0 24 13 Z" />
    <Path d="M-3 3 L-12 25 L-4 21 L0 6 Z" />
    <Path d="M3 3 L12 25 L4 21 L0 6 Z" />
    <Circle cx={0} cy={0} r={4.6} />
  </G>
)
const Sparkle = ({ x, y, s, fill, opacity = 0.85 }) => (
  <Path
    d={`M${x} ${y - s} l${s * 0.2} ${s} l${s} ${s * 0.2} l-${s} ${s * 0.2} l-${s * 0.2} ${s} l-${s * 0.2} -${s} l-${s} -${s * 0.2} l${s} -${s * 0.2} Z`}
    fill={fill}
    opacity={opacity}
  />
)

function Shells() {
  const ink = '#33518f'
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <Pattern id="shells" x="0" y="0" width={150} height={150} patternUnits="userSpaceOnUse">
          <G stroke={ink} strokeWidth={1.7} fill="none" strokeLinecap="round">
            <Path d="M22 66 C 20 33, 40 20, 58 20 C 76 20, 96 33, 94 66 C 94 66, 76 75, 58 75 C 40 75, 22 66, 22 66 Z" />
            <Path d="M58 22 L36 62 M58 22 L47 68 M58 22 L58 70 M58 22 L69 68 M58 22 L80 62 M58 22 L29 50 M58 22 L87 50" />
          </G>
          <Path d={STARFISH} transform="translate(116 112) rotate(18) scale(1.05)" fill={ink} fillOpacity={0.14} stroke={ink} strokeWidth={1.4} />
          <Path d="M104 34 c 5 -3 11 3 6 8 c -4 4 -12 -1 -6 -8 Z" fill="none" stroke={ink} strokeWidth={1.4} opacity={0.7} />
          <Circle cx={16} cy={116} r={2.6} fill={ink} opacity={0.5} />
          <Circle cx={132} cy={16} r={2} fill={ink} opacity={0.4} />
          <Circle cx={92} cy={104} r={1.7} fill={ink} opacity={0.4} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="#f3ede0" />
      <Rect width="100%" height="100%" fill="url(#shells)" />
    </Svg>
  )
}

function Bows() {
  const rose = '#c98a94'
  const dim = '#8f5f66'
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <Pattern id="bows" x="0" y="0" width={140} height={140} patternUnits="userSpaceOnUse">
          <Bow x={44} y={44} s={1} fill={rose} />
          <Bow x={112} y={112} s={0.82} fill={dim} />
          <Path d="M110 22 l2 -7 l2 7 l7 2 l-7 2 l-2 7 l-2 -7 l-7 -2 Z" fill={rose} opacity={0.8} />
          <Path d="M22 104 l1.6 -5 l1.6 5 l5 1.6 l-5 1.6 l-1.6 5 l-1.6 -5 l-5 -1.6 Z" fill={dim} opacity={0.8} />
          <Circle cx={120} cy={70} r={2} fill={rose} opacity={0.6} />
          <Circle cx={70} cy={128} r={1.8} fill={rose} opacity={0.5} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="#0c0a0b" />
      <Rect width="100%" height="100%" fill="url(#bows)" />
    </Svg>
  )
}

// cream, hand-drawn bows with a soft blush glow behind them
function Sweetheart() {
  const bow = '#e19bb0'
  const bow2 = '#c97690'
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <RadialGradient id="sh-glow" cx="50%" cy="42%" r="65%">
          <Stop offset="0" stopColor="#fbdfe6" stopOpacity="0.9" />
          <Stop offset="1" stopColor="#faf3ea" stopOpacity="0" />
        </RadialGradient>
        <Pattern id="sweetheart" x="0" y="0" width={130} height={130} patternUnits="userSpaceOnUse">
          <Bow x={40} y={38} s={0.85} fill={bow} />
          <Bow x={100} y={96} s={0.62} fill={bow2} />
          <Sparkle x={112} y={22} s={7} fill={bow} />
          <Sparkle x={18} y={98} s={5} fill={bow2} opacity={0.7} />
          <Circle cx={70} cy={14} r={1.8} fill={bow} opacity={0.6} />
          <Circle cx={16} cy={60} r={1.6} fill={bow2} opacity={0.5} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="#faf3ea" />
      <Rect width="100%" height="100%" fill="url(#sh-glow)" />
      <Rect width="100%" height="100%" fill="url(#sweetheart)" />
    </Svg>
  )
}

// aged book-page texture: faux justified text lines on warm paper
function Pages() {
  const paper = '#e7dfcd'
  const ink = '#2e2a22'
  const rows = [
    [8, 96], [112, 34], [8, 70], [86, 42], [8, 108], [126, 16], [8, 58], [76, 50],
  ]
  const lines = rows.map(([x, w], i) => (
    <Rect key={i} x={x} y={10 + i * 15} width={w} height={3} rx={1.4} fill={ink} opacity={i % 3 === 0 ? 0.6 : 0.34} />
  ))
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <Pattern id="pages" x="0" y="0" width={150} height={130} patternUnits="userSpaceOnUse">
          {lines}
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={paper} />
      <Rect width="100%" height="100%" fill="url(#pages)" />
    </Svg>
  )
}

// mauve gingham check
function Gingham() {
  const base = '#f3e6e0'
  const check = '#a9556f'
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <Pattern id="gingham" x="0" y="0" width={48} height={48} patternUnits="userSpaceOnUse">
          <Rect width={48} height={48} fill={base} />
          <Rect x={0} y={0} width={48} height={16} fill={check} opacity={0.35} />
          <Rect x={0} y={32} width={48} height={16} fill={check} opacity={0.35} />
          <Rect x={0} y={0} width={16} height={48} fill={check} opacity={0.35} />
          <Rect x={32} y={0} width={16} height={48} fill={check} opacity={0.35} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#gingham)" />
    </Svg>
  )
}

// deep red starfield / nebula
function Crimson() {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <RadialGradient id="cr-bg" cx="32%" cy="18%" r="90%">
          <Stop offset="0" stopColor="#3a0a0a" />
          <Stop offset="0.6" stopColor="#220505" />
          <Stop offset="1" stopColor="#120202" />
        </RadialGradient>
        <Pattern id="crimson" x="0" y="0" width={160} height={160} patternUnits="userSpaceOnUse">
          <Circle cx={20} cy={30} r={1.4} fill="#ffffff" opacity={0.8} />
          <Circle cx={70} cy={12} r={1} fill="#ffffff" opacity={0.6} />
          <Circle cx={110} cy={60} r={1.6} fill="#e8c98a" opacity={0.8} />
          <Circle cx={140} cy={20} r={1} fill="#ffffff" opacity={0.5} />
          <Circle cx={30} cy={100} r={1.2} fill="#ffffff" opacity={0.7} />
          <Circle cx={90} cy={120} r={1} fill="#e8c98a" opacity={0.6} />
          <Circle cx={130} cy={140} r={1.4} fill="#ffffff" opacity={0.8} />
          <Circle cx={55} cy={150} r={1} fill="#ffffff" opacity={0.5} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#cr-bg)" />
      <Rect width="100%" height="100%" fill="url(#crimson)" />
    </Svg>
  )
}

const MAP = { shells: Shells, bows: Bows, sweetheart: Sweetheart, pages: Pages, gingham: Gingham, crimson: Crimson }

export default function Wallpaper({ id }) {
  const C = MAP[id] || Shells
  return <C />
}
