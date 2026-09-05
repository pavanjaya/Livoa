import { useState } from 'react'
import { View, Pressable, ScrollView } from 'react-native'
import { useStore } from '../store.js'
import { LogoLockup } from '../ui/Logo.js'
import ThemeCard from '../ui/ThemeCard.js'
import { T, Card, Btn, Input, Field, Row } from '../ui/kit.js'
import { PRESET_ORDER, useTheme } from '../theme.js'

export default function Onboarding() {
  const { dispatch } = useStore()
  const t = useTheme()
  const [name, setName] = useState('')
  const [preset, setPreset] = useState('cloud')
  const [sample, setSample] = useState(true)

  const start = () => {
    dispatch({ type: 'setProfile', patch: { name: name.trim() || 'friend', avatar: '🌕' } })
    dispatch({ type: 'setTheme', patch: { preset, wallpaper: null } })
    if (sample) dispatch({ type: 'loadSample' })
    dispatch({ type: 'onboarded' })
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingTop: 28, paddingBottom: 40, gap: 20 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <LogoLockup size={88} />

      <Card style={{ gap: 14 }}>
        <Field label="What should we call you?">
          <Input placeholder="Your name" value={name} onChangeText={setName} onSubmitEditing={start} />
        </Field>

        <Field label="Pick your Livoa">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {PRESET_ORDER.map((id) => (
              <ThemeCard key={id} id={id} selected={preset === id} onPress={() => setPreset(id)} />
            ))}
          </View>
        </Field>

        <Pressable onPress={() => setSample((s) => !s)}>
          <Row gap={10}>
            <View
              style={{
                width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: sample ? 'transparent' : t.border, backgroundColor: sample ? t.accent : 'transparent',
              }}
            >
              {sample ? <T size={13} color={t.accentContrast}>✓</T> : null}
            </View>
            <T w="r" size={13} style={{ flex: 1 }}>Start with sample data (habits, people, notifications)</T>
          </Row>
        </Pressable>

        <Btn title="Enter Livoa  →" kind="primary" onPress={start} />
      </Card>

      <T w="r" size={12} muted style={{ textAlign: 'center' }}>
        Your life, your vibe. Everything stays on this device.
      </T>
    </ScrollView>
  )
}
