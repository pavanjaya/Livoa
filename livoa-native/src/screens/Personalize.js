import { View, Pressable, Alert, useWindowDimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useStore } from '../store.js'
import {
  useTheme, PRESET_ORDER, FONTS, CUSTOM_OPTIONS, ACCENT_SWATCH, ACCENT_EMOJI,
  WALLPAPERS, WALLPAPER_ORDER,
} from '../theme.js'
import ThemeCard from '../ui/ThemeCard.js'
import Wallpaper from '../ui/Wallpaper.js'
import { Screen, Card, Btn, Chip, T, H1, H2, Row, Field, Input, Avatar } from '../ui/kit.js'

const AVATARS = ['🌕', '👻', '😎', '☠️', '🎀', '🫶🏻', '🪬', '🤥', '😈', '🧚🏻‍♀️']

const WIDGETS = {
  sleep: 'Sleep', water: 'Water', screen: 'Screen',
  streaks: 'Streaks', affirmation: 'Affirmation', people: 'Reach out',
  goals: 'Goals', livoaAI: 'Livoa AI',
}

function Seg({ label, options, value, onChange }) {
  return (
    <Field label={label}>
      <Row gap={6} style={{ flexWrap: 'wrap' }}>
        {options.map((o) => (
          <Chip key={o} label={o} on={value === o} onPress={() => onChange(o)} />
        ))}
      </Row>
    </Field>
  )
}

export default function Personalize() {
  const { state, dispatch } = useStore()
  const t = useTheme()
  const { width } = useWindowDimensions()
  const wpW = Math.floor((width - 16 * 2 - 16 * 2 - 10 - 6) / 2)
  const { theme } = state
  const custom = theme.custom || {}

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('Photos permission needed', 'Enable photo access for Livoa in Settings to use a profile picture.')
      return
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    })
    if (!res.canceled && res.assets?.[0]?.base64) {
      dispatch({ type: 'setProfile', patch: { picture: `data:image/jpeg;base64,${res.assets[0].base64}` } })
    }
  }

  const confirmReset = () =>
    Alert.alert('Reset Livoa', 'Erase everything and start fresh?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'reset' }) },
    ])

  return (
    <Screen>
      <H1>You</H1>

      {/* Profile */}
      <Card style={{ gap: 12 }}>
        <H2>Profile</H2>
        <Row gap={14}>
          <Avatar picture={state.profile.picture} emoji={state.profile.avatar} size={64} />
          <View style={{ flex: 1, gap: 8 }}>
            <Btn title="Upload photo" size="sm" onPress={pickPhoto} />
            {state.profile.picture ? (
              <Btn title="Remove photo" kind="ghost" size="sm" onPress={() => dispatch({ type: 'setProfile', patch: { picture: null } })} />
            ) : null}
          </View>
        </Row>
        <Field label="Name">
          <Input value={state.profile.name} onChangeText={(v) => dispatch({ type: 'setProfile', patch: { name: v } })} />
        </Field>
        <Field label="Avatar">
          <Row gap={8} style={{ flexWrap: 'wrap' }}>
            {AVATARS.map((a) => (
              <Chip
                key={a}
                label={a}
                on={state.profile.avatar === a && !state.profile.picture}
                onPress={() => dispatch({ type: 'setProfile', patch: { avatar: a } })}
              />
            ))}
          </Row>
        </Field>
      </Card>

      {/* Themes */}
      <Card style={{ gap: 12 }}>
        <H2>Themes</H2>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {PRESET_ORDER.map((id) => (
            <ThemeCard
              key={id}
              id={id}
              selected={theme.preset === id && !theme.wallpaper}
              onPress={() => dispatch({ type: 'setTheme', patch: { preset: id, wallpaper: null } })}
            />
          ))}
        </View>
        <Chip
          label={`🖼️ Theme picture on home ${theme.picture ? '· on' : '· off'}`}
          on={theme.picture}
          onPress={() => dispatch({ type: 'setTheme', patch: { picture: !theme.picture } })}
        />

        <T w="b" size={12} color={t.muted} style={{ textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 6 }}>
          Pick Livoa images
        </T>
        <T w="r" size={12} muted>Sets a full-screen wallpaper as your whole theme.</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {WALLPAPER_ORDER.map((id) => {
            const on = theme.wallpaper === id
            return (
              <Pressable
                key={id}
                onPress={() => dispatch({ type: 'setTheme', patch: { wallpaper: id } })}
                style={{
                  width: wpW, borderRadius: 14, overflow: 'hidden',
                  borderWidth: 2, borderColor: on ? t.accent : t.border,
                }}
              >
                <View style={{ height: 104 }}>
                  <Wallpaper id={id} />
                </View>
                <View style={{ padding: 8, backgroundColor: t.surface }}>
                  <T size={12}>{WALLPAPERS[id].name}{on ? '  ✓' : ''}</T>
                </View>
              </Pressable>
            )
          })}
        </View>
      </Card>

      {/* Custom builder */}
      <Card style={{ gap: 12 }}>
        <H2>Build your Livoa</H2>
        <T w="r" size={12} muted>Make your own — it becomes your active theme.</T>

        <Seg label="Background" options={CUSTOM_OPTIONS.background} value={custom.background}
          onChange={(v) => dispatch({ type: 'setCustomTheme', patch: { background: v } })} />

        <Field label="Accent">
          <Row gap={10} style={{ flexWrap: 'wrap' }}>
            {CUSTOM_OPTIONS.accent.map((a) => (
              <Pressable
                key={a}
                onPress={() => dispatch({ type: 'setCustomTheme', patch: { accent: a } })}
                style={{
                  width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: ACCENT_SWATCH[a],
                  borderWidth: 3, borderColor: custom.accent === a ? t.text : 'transparent',
                }}
              >
                <T size={16}>{ACCENT_EMOJI[a]}</T>
              </Pressable>
            ))}
          </Row>
        </Field>

        <Seg label="Style" options={CUSTOM_OPTIONS.style} value={custom.style}
          onChange={(v) => dispatch({ type: 'setCustomTheme', patch: { style: v } })} />
        <Seg label="Mood" options={CUSTOM_OPTIONS.mood} value={custom.mood}
          onChange={(v) => dispatch({ type: 'setCustomTheme', patch: { mood: v } })} />

        {theme.preset === 'custom' ? <Chip label="Custom theme active ✨" tone="soft" /> : null}
      </Card>

      {/* Font */}
      <Card style={{ gap: 12 }}>
        <H2>Font</H2>
        <Row gap={6} style={{ flexWrap: 'wrap' }}>
          {Object.entries(FONTS).map(([id, label]) => (
            <Chip key={id} label={label} on={state.theme.font === id} onPress={() => dispatch({ type: 'setTheme', patch: { font: id } })} />
          ))}
        </Row>
      </Card>

      {/* Widgets */}
      <Card style={{ gap: 12 }}>
        <H2>Home widgets</H2>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          {Object.entries(WIDGETS).map(([k, label]) => (
            <Chip
              key={k}
              label={label}
              on={!!state.widgets[k]}
              onPress={() => dispatch({ type: 'setWidget', key: k, value: !state.widgets[k] })}
            />
          ))}
        </Row>
      </Card>

      {/* Data */}
      <Card style={{ gap: 10 }}>
        <H2>Data</H2>
        <Btn title="Load sample data" size="sm" onPress={() => dispatch({ type: 'loadSample' })} />
        <Btn title="Load “rough week” sample" size="sm" onPress={() => dispatch({ type: 'loadSampleSlump' })} />
        <Btn title="Reset Livoa" kind="danger" size="sm" onPress={confirmReset} />
        <T w="r" size={12} muted>Everything is stored only on this device.</T>
      </Card>
    </Screen>
  )
}
