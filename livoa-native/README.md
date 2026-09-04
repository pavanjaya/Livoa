# livoa — React Native / Expo

Your life, your vibe. The Livoa habit tracker as a native app (Expo SDK 52).

## Run

```bash
cd livoa-native
npm install
npx expo start
```

Then:
- press **i** for the iOS Simulator, **a** for an Android emulator, or
- scan the QR code with **Expo Go** on your phone.

Web preview (handy for quick UI checks): `npx expo start --web`

## What's inside

Feature parity with the web version:

- **Habits** — sleep (hours + native time picker for bedtime), water (stepper + quick-add), screen time, with rings and a 7-day strip.
- **Streaks** — 4 independent streaks; hit 7 days and Livoa celebrates. Break one and it just says *"Streak ended. Life happens. Start again?"*
- **Livoa AI** — a card on Home that reads recent data and speaks like a friend: *"Livoa noticed 👀 — you've been sleeping late lately"* + a *Tiny suggestion*. Cycles through what it's noticing; also drops a daily "Livoa noticed" note in the inbox.
- **Goals & affirmations** — checklist + affirmations; one affirmation surfaces on Home each day.
- **People** — birthday, last hangout, last call, memories. 14+ days → *"You haven't hung out with Aarav in 18 days 👀"*.
- **Weekly check-in** — once per ISO week: *"Great {name}! You've changed a lot this week — keep going!"*
- **Notifications** — in-app inbox (bell, top right).
- **Personalize** — profile photo (expo-image-picker) / name / avatar, 10 themes with generated theme pictures, a custom theme builder (background · accent · style · mood), 5 fonts, toggleable Home widgets, and a "theme picture on home" switch.

## Tech

- **Expo SDK 52**, React Native 0.76, plain `App.js` entry (no expo-router) with a lightweight state router.
- **State**: `useReducer` + Context, persisted to `AsyncStorage` (`livoa.v1`). No backend, no accounts.
- **Theming**: `src/theme.js` resolves a preset or custom build into a token object served through `ThemeProvider` / `useTheme()`.
- **SVG**: `react-native-svg` for the logo, progress rings, and the parametric theme artwork (`src/ui/ThemeArt.js`).
- **Fonts**: `@expo-google-fonts/*` loaded with `useFonts`.
- Native pickers via `@react-native-community/datetimepicker`; gradients via `expo-linear-gradient`.

## Structure

```
App.js                 fonts, hydration gate, ThemeProvider, top bar, bottom nav, router
src/
  store.js             reducer + AsyncStorage persistence + sample data
  theme.js             10 presets + custom-theme resolver + fonts + <ThemeProvider>
  lib/                  dates, streaks, ai, notifications   (pure JS, shared with the web build)
  ui/                   kit (primitives), Logo, Ring, ThemeArt, ThemeCard, Sheet, DateField
  screens/             Onboarding, Dashboard, Habits, Goals, People, Inbox, Personalize
```

The `src/lib/*` modules are byte-for-byte the same logic as the web app — only the view layer was rewritten for React Native.

## Notifications

v1 uses the in-app inbox only (reliable in Expo Go, no permissions). The derivation lives in
`src/lib/notifications.js`; wiring it to `expo-notifications` for real local notifications is a
drop-in next step.
