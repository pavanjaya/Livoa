import { useEffect, useState } from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito'
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins'
import { Quicksand_400Regular, Quicksand_700Bold } from '@expo-google-fonts/quicksand'
import { SpaceGrotesk_400Regular, SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'

import { Store, useStore } from './src/store.js'
import { ThemeProvider, useTheme } from './src/theme.js'
import { derive } from './src/lib/notifications.js'
import { T } from './src/ui/kit.js'
import { LogoMark, Wordmark } from './src/ui/Logo.js'
import Wallpaper from './src/ui/Wallpaper.js'
import Onboarding from './src/screens/Onboarding.js'
import Dashboard from './src/screens/Dashboard.js'
import Habits from './src/screens/Habits.js'
import Goals from './src/screens/Goals.js'
import People from './src/screens/People.js'
import Inbox from './src/screens/Inbox.js'
import Personalize from './src/screens/Personalize.js'

const TABS = [
  { id: 'home', ic: 'home', label: 'Home' },
  { id: 'habits', ic: 'bar-chart-2', label: 'Habits' },
  { id: 'goals', ic: 'target', label: 'Goals' },
  { id: 'people', ic: 'users', label: 'People' },
  { id: 'you', ic: 'sliders', label: 'You' },
]

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold,
    Poppins_400Regular, Poppins_600SemiBold,
    Quicksand_400Regular, Quicksand_700Bold,
    SpaceGrotesk_400Regular, SpaceGrotesk_600SemiBold,
    DMSerifDisplay_400Regular,
  })
  return (
    <SafeAreaProvider>
      <Store>
        <Root fontsLoaded={fontsLoaded} />
      </Store>
    </SafeAreaProvider>
  )
}

function Root({ fontsLoaded }) {
  const { state, dispatch, hydrated } = useStore()

  useEffect(() => {
    const { notifs, meta } = derive(state)
    dispatch({ type: 'ingestNotifs', notifs, meta })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.logs, state.people, state.goals])

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: '#f7f8fc' }} />

  return (
    <ThemeProvider theme={state.theme} fontsLoaded={fontsLoaded}>
      {state.onboarded ? <Shell /> : <OnboardWrap />}
    </ThemeProvider>
  )
}

function OnboardWrap() {
  const t = useTheme()
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {t.wallpaper ? (
        <View style={StyleSheet.absoluteFill}><Wallpaper id={t.wallpaper} /></View>
      ) : t.gradient ? (
        <LinearGradient colors={t.gradient} style={StyleSheet.absoluteFill} />
      ) : null}
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Onboarding />
      </SafeAreaView>
    </View>
  )
}

function Shell() {
  const { state } = useStore()
  const t = useTheme()
  const insets = useSafeAreaInsets()
  const [route, setRoute] = useState('home')
  const [personId, setPersonId] = useState(null)

  const unread = state.notifications.filter((n) => !n.read).length
  const openPerson = (id) => {
    setPersonId(id)
    setRoute('people')
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {t.wallpaper ? (
        <View style={StyleSheet.absoluteFill}><Wallpaper id={t.wallpaper} /></View>
      ) : (
        <>
          {t.gradient ? <LinearGradient colors={t.gradient} style={StyleSheet.absoluteFill} /> : null}
          {t.tint ? <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, backgroundColor: t.tint }} /> : null}
        </>
      )}
      <StatusBar style={t.dark ? 'light' : 'dark'} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* top bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 9,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: t.surface,
            borderBottomWidth: t.borderW,
            borderBottomColor: t.border,
          }}
        >
          <LogoMark size={28} />
          <Wordmark />
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() => setRoute('inbox')}
            style={{
              width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
              backgroundColor: t.surface, borderWidth: t.borderW, borderColor: t.border, ...(t.shadow || {}),
            }}
          >
            <Feather name="bell" size={18} color={t.text} />
            {unread > 0 ? (
              <View
                style={{
                  position: 'absolute', top: 3, right: 3, minWidth: 16, height: 16, paddingHorizontal: 3,
                  borderRadius: 8, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center',
                }}
              >
                <T size={10} color={t.accentContrast}>{unread > 9 ? '9+' : unread}</T>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={{ flex: 1 }}>
          {route === 'home' && <Dashboard go={setRoute} openPerson={openPerson} />}
          {route === 'habits' && <Habits />}
          {route === 'goals' && <Goals />}
          {route === 'people' && <People personId={personId} setPersonId={setPersonId} />}
          {route === 'you' && <Personalize />}
          {route === 'inbox' && <Inbox back={() => setRoute('home')} openPerson={openPerson} />}
        </View>
      </SafeAreaView>

      {/* bottom nav */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: insets.bottom + 10,
          flexDirection: 'row',
          backgroundColor: t.surface,
          borderWidth: t.borderW,
          borderColor: t.border,
          borderRadius: 22,
          paddingVertical: 8,
          paddingHorizontal: 6,
          ...(t.shadow || {}),
        }}
      >
        {TABS.map((tab) => {
          const on = route === tab.id
          return (
            <Pressable
              key={tab.id}
              onPress={() => {
                setPersonId(null)
                setRoute(tab.id)
              }}
              style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 6 }}
            >
              <Feather name={tab.ic} size={20} color={on ? t.accent : t.muted} />
              <T size={10} color={on ? t.accent : t.muted}>{tab.label}</T>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
