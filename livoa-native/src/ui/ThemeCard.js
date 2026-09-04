import { Pressable, View, useWindowDimensions } from 'react-native'
import { T } from './kit.js'
import ThemeArt from './ThemeArt.js'
import { resolveTheme, PRESET_META, useTheme } from '../theme.js'

export default function ThemeCard({ id, selected, onPress }) {
  const active = useTheme()
  const { width } = useWindowDimensions()
  // two per row inside a screen-padded + card-padded container
  const cw = Math.min(240, Math.max(140, Math.floor((width - 16 * 2 - 16 * 2 - 10) / 2) - 1))

  const p = resolveTheme({ preset: id })
  const meta = PRESET_META[id]
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: cw,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: selected ? active.accent : active.border,
        backgroundColor: p.surface,
        padding: 12,
      }}
    >
      <ThemeArt
        motif={p.motif}
        accent={p.accent}
        base={p.gradient ? p.gradient[0] : p.bg}
        width={cw - 24}
        height={46}
        radius={10}
      />
      <View style={{ flexDirection: 'row', gap: 5, marginTop: 9, marginBottom: 6 }}>
        <View style={{ width: 18, height: 18, borderRadius: 6, backgroundColor: p.accent }} />
        <View style={{ width: 18, height: 18, borderRadius: 6, backgroundColor: p.surface2 }} />
        <View style={{ width: 18, height: 18, borderRadius: 6, backgroundColor: p.track }} />
      </View>
      <T size={13} color={p.text}>{meta.emoji} {meta.name}</T>
      <T w="r" size={11} color={p.muted}>{meta.blurb}</T>
    </Pressable>
  )
}
