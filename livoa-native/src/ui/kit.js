import { useRef, useEffect } from 'react'
import {
  Text, View, Pressable, TextInput, ScrollView, Animated, Image,
} from 'react-native'
import { useTheme } from '../theme.js'

// ---- avatar (emoji or photo) -------------------------------------------
export function Avatar({ picture, emoji, size = 52 }) {
  const t = useTheme()
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size / 2, overflow: 'hidden',
        backgroundColor: t.accentSoft, alignItems: 'center', justifyContent: 'center',
      }}
    >
      {picture ? (
        <Image source={{ uri: picture }} style={{ width: size, height: size }} />
      ) : (
        <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
      )}
    </View>
  )
}

// ---- checkbox --------------------------------------------------------
export function Checkbox({ on, onPress, size = 22 }) {
  const t = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: size, height: size, borderRadius: 7, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: on ? 'transparent' : t.border, backgroundColor: on ? t.accent : 'transparent',
      }}
    >
      {on ? <Text style={{ color: t.accentContrast, fontSize: size * 0.6, fontFamily: t.fonts.bold }}>✓</Text> : null}
    </Pressable>
  )
}

// ---- text -----------------------------------------------------------------
export function T({ w = 'b', size = 14, color, muted, style, children, ...rest }) {
  const t = useTheme()
  return (
    <Text
      style={[
        { fontFamily: w === 'r' ? t.fonts.regular : t.fonts.bold, fontSize: size, color: color || (muted ? t.muted : t.text) },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  )
}

export function H1({ children, style }) {
  return <T size={26} style={[{ letterSpacing: -0.4 }, style]}>{children}</T>
}
export function H2({ children, style }) {
  return <T size={15} style={style}>{children}</T>
}
export function SectionLabel({ children, style }) {
  const t = useTheme()
  return (
    <T w="b" size={12} color={t.muted} style={[{ textTransform: 'uppercase', letterSpacing: 1 }, style]}>
      {children}
    </T>
  )
}

// ---- layout -------------------------------------------------------------
export function Row({ children, style, gap = 10 }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>
}
export function Divider() {
  const t = useTheme()
  return <View style={{ height: 1, backgroundColor: t.border }} />
}

export function Card({ children, style, flat }) {
  const t = useTheme()
  return (
    <View
      style={[
        {
          backgroundColor: t.surface,
          borderWidth: t.borderW,
          borderColor: t.border,
          borderRadius: t.radius,
          padding: 16,
        },
        !flat && t.shadow,
        style,
      ]}
    >
      {children}
    </View>
  )
}

// ---- buttons ----------------------------------------------------------
export function Btn({ title, onPress, kind = 'default', size = 'md', style, disabled, children }) {
  const t = useTheme()
  const bg = kind === 'primary' ? t.accent : kind === 'ghost' ? 'transparent' : t.surface2
  const fg = kind === 'primary' ? t.accentContrast : kind === 'danger' ? '#e5484d' : t.text
  const pad = size === 'sm' ? { paddingVertical: 8, paddingHorizontal: 12 } : { paddingVertical: 11, paddingHorizontal: 16 }
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          borderRadius: 999,
          borderWidth: t.borderW,
          borderColor: kind === 'primary' ? 'transparent' : t.border,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
        },
        pad,
        style,
      ]}
    >
      {children || <T size={size === 'sm' ? 13 : 14} color={fg}>{title}</T>}
    </Pressable>
  )
}

export function Chip({ label, on, onPress, tone, style }) {
  const t = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderRadius: 999,
          paddingVertical: 7,
          paddingHorizontal: 12,
          borderWidth: t.borderW,
          borderColor: on || tone === 'soft' ? 'transparent' : t.border,
          backgroundColor: on ? t.accent : tone === 'soft' ? t.accentSoft : t.surface2,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <T size={12.5} color={on ? t.accentContrast : t.text}>{label}</T>
    </Pressable>
  )
}

// ---- form -----------------------------------------------------------
export function Field({ label, children, style }) {
  const t = useTheme()
  return (
    <View style={[{ gap: 6 }, style]}>
      <T w="b" size={12} color={t.muted} style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</T>
      {children}
    </View>
  )
}

export function Input({ value, onChangeText, placeholder, onSubmitEditing, style, ...rest }) {
  const t = useTheme()
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={t.muted}
      onSubmitEditing={onSubmitEditing}
      style={[
        {
          backgroundColor: t.surface2,
          borderWidth: t.borderW,
          borderColor: t.border,
          borderRadius: 14,
          paddingVertical: 12,
          paddingHorizontal: 14,
          fontSize: 14,
          fontFamily: t.fonts.bold,
          color: t.text,
        },
        style,
      ]}
      {...rest}
    />
  )
}

export function Stepper({ value, onChange, step = 1, min = 0, max = 99, suffix }) {
  const t = useTheme()
  const round = (n) => Math.round(n * 100) / 100
  const btn = {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    backgroundColor: t.surface2, borderWidth: t.borderW, borderColor: t.border,
  }
  return (
    <Row gap={12}>
      <Pressable style={btn} onPress={() => onChange(round(Math.max(min, value - step)))}>
        <T size={20}>−</T>
      </Pressable>
      <T size={28} style={{ minWidth: 74, textAlign: 'center', letterSpacing: -0.5 }}>
        {value}
        {suffix ? <T size={14}>{suffix}</T> : null}
      </T>
      <Pressable style={btn} onPress={() => onChange(round(Math.min(max, value + step)))}>
        <T size={20}>+</T>
      </Pressable>
    </Row>
  )
}

// ---- screen wrapper (scroll + mount fade) -----------------------------
export function Screen({ children, contentStyle }) {
  const fade = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start()
  }, [fade])
  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ padding: 16, paddingBottom: 120, gap: 14 }, contentStyle]}
      >
        {children}
      </ScrollView>
    </Animated.View>
  )
}
