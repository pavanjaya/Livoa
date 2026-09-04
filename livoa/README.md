# livoa — your life, your vibe

A gentle habit tracker. No guilt, just nudges.

## Run

```bash
cd livoa
npm install
npm run dev
```

Open http://localhost:5180

## What's inside

- **Habits** — sleep (hours + bedtime), water (glasses), screen time, with daily rings and a 7-day strip.
- **Streaks** — hit your targets 7 days running and Livoa celebrates. Break a streak and it just says *"Streak ended. Life happens. Start again?"*
- **Goals** — a checklist of goals plus affirmations; one affirmation surfaces on Home each day.
- **People** — track birthday, last hangout, last call and memories. If it's been 14+ days, Livoa nudges: *"You haven't hung out with Aarav in 18 days 👀"*
- **Notifications** — an in-app inbox (bell, top right) collecting streak wins and people nudges.
- **Personalize** — profile photo / name / avatar, 10 built-in themes, a custom theme builder (background · accent · style · mood), 5 fonts, and toggleable Home widgets.

## Tech

React + Vite. All data is stored locally in `localStorage` (`livoa.v1`). No backend, no accounts.

## Structure

```
src/
  store.jsx          state, reducer, persistence, sample data
  themes.js          10 presets + custom-theme resolver + fonts
  App.jsx            theme application, notification derivation, routing
  lib/
    dates.js         day-key helpers
    streaks.js       per-metric pass/fail + streak math
    notifications.js derives streak & people notifications from state
  components/         Logo, Ring, Sheet
  screens/           Onboarding, Dashboard, Habits, Goals, People, Inbox, Personalize
```
