import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Circle, Path } from 'react-native-svg'
import { T } from './kit.js'
import { useTheme } from '../theme.js'

export function LogoMark({ size = 30 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="livoaOrb" x1="18" y1="20" x2="98" y2="104" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#b7a4e6" />
          <Stop offset="0.55" stopColor="#d7a9df" />
          <Stop offset="1" stopColor="#f6b3ce" />
        </LinearGradient>
      </Defs>
      <Circle cx="57" cy="63" r="40" fill="url(#livoaOrb)" />
      <Circle cx="92" cy="26" r="9" fill="#f7a6c6" />
      <Path
        d="M55 31 C 47 34, 45 47, 47 67 C 48.5 81, 61 85, 72 73"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  )
}

export function Wordmark({ size = 21 }) {
  const t = useTheme()
  return (
    <T size={size} style={{ letterSpacing: -0.4 }}>
      liv<T size={size} color={t.accent}>o</T>a
    </T>
  )
}

export function LogoLockup({ size = 92 }) {
  const t = useTheme()
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <LogoMark size={size} />
      <T size={size * 0.34} style={{ letterSpacing: -1 }}>
        liv<T size={size * 0.34} color={t.accent}>o</T>a
      </T>
      <T w="r" size={12} muted style={{ letterSpacing: 0.4 }}>your life, your vibe.</T>
    </View>
  )
}
