import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path, Ellipse, Polygon, G } from 'react-native-svg'

const W = '#ffffff'

const star = (k, x, y, s, c, o) => (
  <Path
    key={k}
    d={`M${x} ${y - s}L${x + s * 0.28} ${y - s * 0.28}L${x + s} ${y}L${x + s * 0.28} ${y + s * 0.28}L${x} ${y + s}L${x - s * 0.28} ${y + s * 0.28}L${x - s} ${y}L${x - s * 0.28} ${y - s * 0.28}Z`}
    fill={c}
    opacity={o}
  />
)
const heart = (k, x, y, s, c, o) => (
  <Path
    key={k}
    d="M0 5C0 1 -3 -2 -6 -2C-11 -2 -12 3 -12 5C-12 10 -6 14 0 18C6 14 12 10 12 5C12 3 11 -2 6 -2C3 -2 0 1 0 5Z"
    fill={c}
    opacity={o}
    transform={`translate(${x} ${y}) scale(${s / 16})`}
  />
)
const leaf = (k, x, y, s, c, o, rot) => (
  <Ellipse key={k} cx={x} cy={y} rx={s} ry={s * 0.42} fill={c} opacity={o} transform={`rotate(${rot} ${x} ${y})`} />
)

function motif(kind, accent) {
  switch (kind) {
    case 'stars':
    case 'nebula':
      return [
        star('a', 60, 50, 9, W, 0.9), star('b', 150, 30, 5, W, 0.7), star('c', 250, 68, 7, W, 0.8),
        star('d', 330, 40, 5, W, 0.6), star('e', 300, 150, 11, W, 0.85), star('f', 110, 170, 6, W, 0.7),
        star('g', 205, 120, 4, W, 0.6), star('h', 370, 205, 7, W, 0.7),
      ]
    case 'sparkles':
      return [
        star('a', 70, 60, 13, W, 0.9), star('b', 322, 50, 9, accent, 0.85), star('c', 258, 162, 15, W, 0.85),
        star('d', 140, 190, 8, accent, 0.7), star('e', 200, 92, 6, W, 0.7), star('f', 360, 150, 7, W, 0.6),
      ]
    case 'disco': {
      const cols = ['#ff2fd0', '#39d0ff', '#ffd23f', '#8aff5b', '#ffffff', '#b06bff']
      const conf = [
        [36, 44, 20], [96, 24, -25], [168, 54, 40], [236, 28, 10], [300, 58, -15], [352, 108, 30],
        [318, 156, -40], [250, 138, 15], [188, 168, -10], [120, 150, 25], [64, 132, -30], [280, 96, 50],
        [150, 90, 0], [210, 112, -20], [40, 96, 12], [340, 40, -30],
      ].map(([x, y, r], i) => (
        <Rect key={`c${i}`} x={x} y={y} width={7} height={13} rx={2} fill={cols[i % cols.length]} opacity={0.92} transform={`rotate(${r} ${x} ${y})`} />
      ))
      const burst = [
        <Circle key="r1" cx={330} cy={70} r={16} fill="none" stroke={W} strokeWidth={3} opacity={0.5} />,
        <Circle key="r2" cx={330} cy={70} r={28} fill="none" stroke={accent} strokeWidth={2} opacity={0.5} />,
        <Circle key="r3" cx={70} cy={172} r={20} fill="none" stroke={W} strokeWidth={2.5} opacity={0.4} />,
      ]
      const spk = [
        star('s1', 300, 40, 13, W, 0.9), star('s2', 150, 120, 10, accent, 0.85),
        star('s3', 360, 182, 8, W, 0.7), star('s4', 40, 60, 9, W, 0.8),
      ]
      return [...burst, ...conf, ...spk]
    }
    case 'hearts':
      return [
        heart('a', 70, 58, 34, W, 0.85), heart('b', 300, 92, 46, W, 0.65), heart('c', 180, 172, 26, W, 0.8),
        heart('d', 352, 192, 20, accent, 0.6), heart('e', 128, 120, 16, accent, 0.5),
      ]
    case 'leaves':
      return [
        leaf('a', 70, 70, 46, W, 0.5, -20), leaf('b', 300, 58, 60, W, 0.4, 30), leaf('c', 200, 172, 52, W, 0.45, -10),
        leaf('d', 362, 150, 40, accent, 0.32, 50), leaf('e', 120, 150, 34, accent, 0.3, 15),
      ]
    case 'clouds':
      return [
        <G key="c1" fill={W} opacity={0.55}>
          <Ellipse cx={90} cy={92} rx={55} ry={30} /><Ellipse cx={132} cy={102} rx={45} ry={26} /><Ellipse cx={54} cy={106} rx={38} ry={22} />
        </G>,
        <G key="c2" fill={W} opacity={0.4}>
          <Ellipse cx={300} cy={58} rx={60} ry={30} /><Ellipse cx={346} cy={70} rx={40} ry={22} />
        </G>,
        <G key="c3" fill={W} opacity={0.5}>
          <Ellipse cx={262} cy={182} rx={50} ry={26} /><Ellipse cx={302} cy={190} rx={38} ry={20} />
        </G>,
      ]
    case 'shards':
      return [
        <Polygon key="a" points="40,10 112,0 70,124" fill={W} opacity={0.12} />,
        <Polygon key="b" points="300,0 400,42 330,150" fill={W} opacity={0.1} />,
        <Polygon key="c" points="150,240 240,150 282,240" fill={W} opacity={0.12} />,
        <Polygon key="d" points="0,182 92,150 60,240" fill={accent} opacity={0.2} />,
      ]
    case 'streaks':
      return [20, 72, 122, 190, 262, 332].map((x, i) => (
        <Rect
          key={i}
          x={x}
          y={-40}
          width={i % 2 ? 10 : 22}
          height={320}
          fill={i % 2 ? accent : W}
          opacity={i % 2 ? 0.35 : 0.16}
          transform={`rotate(18 ${x} 120)`}
        />
      ))
    case 'wings':
      return [
        <G key="w1" fill={W} opacity={0.5}>
          <Ellipse cx={150} cy={92} rx={60} ry={44} transform="rotate(-24 150 92)" />
          <Ellipse cx={250} cy={92} rx={60} ry={44} transform="rotate(24 250 92)" />
          <Ellipse cx={162} cy={170} rx={44} ry={34} transform="rotate(-16 162 170)" />
          <Ellipse cx={238} cy={170} rx={44} ry={34} transform="rotate(16 238 170)" />
        </G>,
        <G key="w2" fill={accent} opacity={0.35}>
          <Ellipse cx={150} cy={92} rx={30} ry={22} transform="rotate(-24 150 92)" />
          <Ellipse cx={250} cy={92} rx={30} ry={22} transform="rotate(24 250 92)" />
        </G>,
      ]
    case 'waves':
    default:
      return [80, 130, 180].map((y, i) => (
        <Path
          key={i}
          d={`M-10 ${y} q 50 -26 100 0 t 100 0 t 100 0 t 100 0 t 100 0`}
          fill="none"
          stroke={i === 1 ? accent : W}
          strokeOpacity={i === 1 ? 0.4 : 0.3}
          strokeWidth={4}
        />
      ))
  }
}

export default function ThemeArt({ motif: kind, accent, base, width = '100%', height, radius = 0 }) {
  return (
    <View style={{ width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: base }}>
      <Svg width="100%" height="100%" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="ta" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={base} />
            <Stop offset="1" stopColor={accent} stopOpacity="0.6" />
          </LinearGradient>
        </Defs>
        <Rect width="400" height="240" fill={base} />
        <Rect width="400" height="240" fill="url(#ta)" />
        <Circle cx="60" cy="28" r="130" fill={accent} opacity={0.22} />
        <Circle cx="352" cy="232" r="150" fill={accent} opacity={0.14} />
        {motif(kind, accent)}
      </Svg>
    </View>
  )
}
