import Svg, { Defs, Pattern, Rect, Path, Circle, G } from 'react-native-svg'

const STARFISH =
  'M0,-15 L4.4,-4.6 L14.3,-4.6 L6.1,1.8 L9.2,12.1 L0,5.6 L-9.2,12.1 L-6.1,1.8 L-14.3,-4.6 L-4.4,-4.6 Z'

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
  const Bow = ({ x, y, s, fill }) => (
    <G transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <Path d="M0 0 L-24 -13 Q-30 0 -24 13 Z" />
      <Path d="M0 0 L24 -13 Q30 0 24 13 Z" />
      <Path d="M-3 3 L-12 25 L-4 21 L0 6 Z" />
      <Path d="M3 3 L12 25 L4 21 L0 6 Z" />
      <Circle cx={0} cy={0} r={4.6} />
    </G>
  )
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

export default function Wallpaper({ id }) {
  if (id === 'bows') return <Bows />
  return <Shells />
}
